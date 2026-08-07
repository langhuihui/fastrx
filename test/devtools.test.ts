import { pipe, of, map, filter, subscribe, subject } from '../src/index';
import { __testInstallBackend } from '../src/common';
import type { Envelope, BackendReply } from '../src/protocol';

/** Flush the asap (microtask + setTimeout) scheduler. */
const flush = () => new Promise<void>((r) => setTimeout(r, 10));

/** Attach a mock backend, run `fn`, flush, detach. Returns all emitted envelopes. */
async function collect(fn: () => void): Promise<Envelope[]> {
  const events: Envelope[] = [];
  const disconnect = __testInstallBackend((e) => events.push(e));
  fn();
  await flush();
  disconnect();
  return events;
}

test('envelope shape', async () => {
  const events = await collect(() => {
    pipe(of(1), subscribe(() => {}));
  });
  expect(events.length).toBeGreaterThan(0);
  for (const e of events) {
    expect(e.version).toBe(1);
    expect(typeof e.sequence).toBe('number');
    expect(typeof e.nodeId).toBe('string');
    expect(typeof e.kind).toBe('string');
    expect(typeof e.streamId).toBe('number');
    expect(typeof e.ts).toBe('number');
  }
});

test('stable nodeId format opName#N', async () => {
  const events = await collect(() => {
    pipe(of(1), map((x) => x + 1), subscribe(() => {}));
  });
  const ids = events.map((e) => e.nodeId);
  for (const id of ids) {
    expect(id).toMatch(/^[a-zA-Z]+#\d+$/);
  }
  expect(ids.some((id) => id.startsWith('of#'))).toBe(true);
  expect(ids.some((id) => id.startsWith('map#'))).toBe(true);
});

test('causal chain links next events', async () => {
  const events = await collect(() => {
    pipe(of(1), map((x) => x + 1), filter((x) => x > 0), subscribe(() => {}));
  });
  const nexts = events.filter((e) => e.kind === 'next');
  expect(nexts.length).toBeGreaterThan(0);
  const seqs = new Set(nexts.map((e) => e.sequence));
  // Root source's next has no cause; every later next has a cause pointing to
  // an earlier next event's sequence.
  expect(nexts.some((n) => !n.cause)).toBe(true);
  for (const n of nexts) {
    if (n.cause) {
      expect(seqs.has(n.cause.sequence)).toBe(true);
      expect(n.cause.sequence).toBeLessThan(n.sequence);
    }
  }
  expect(nexts.some((n) => n.cause)).toBe(true);
});

test('ring buffer drains on attach', async () => {
  // Drain any leftover events from prior tests, then detach.
  const drain = __testInstallBackend(() => {});
  drain();
  // With no backend attached, events accumulate in the ring buffer.
  pipe(of(99), subscribe(() => {}));
  await flush(); // let of's microtask emit into the ring
  // Attaching a backend drains the ring.
  const drained: Envelope[] = [];
  __testInstallBackend((e) => drained.push(e));
  expect(drained.some((e) => e.kind === 'next' && e.data === '99')).toBe(true);
});

test('reverse channel: inspect returns latest value + subscription count', async () => {
  const events: Envelope[] = [];
  const replies: BackendReply[] = [];
  const backend = __testInstallBackend(
    (e) => events.push(e),
    (r) => replies.push(r),
  );
  pipe(of(42), subscribe(() => {}));
  await flush();

  const ofNode = events.find((e) => e.kind === 'next')!.nodeId;
  backend.sendCommand({ type: 'inspect', nodeId: ofNode });
  const result = replies.find((r) => r.type === 'inspect-result');
  expect(result?.type).toBe('inspect-result');
  if (result?.type === 'inspect-result') {
    expect(result.latest).toBe('42');
    expect(result.subscriptionCount).toBeGreaterThanOrEqual(1);
  }
  backend.disconnect();
});

test('reverse channel: breakpoint marks next envelopes', async () => {
  const events: Envelope[] = [];
  const replies: BackendReply[] = [];
  const backend = __testInstallBackend(
    (e) => events.push(e),
    (r) => replies.push(r),
  );
  // Reuse one node (subject) so the breakpoint targets the same nodeId.
  const s = subject<number>();
  pipe(s, subscribe(() => {}));
  s.next(0); // produce a next event so we can learn the subject's nodeId
  await flush();

  const nodeId = events.find((e) => e.kind === 'next')!.nodeId;
  expect(nodeId).toBeTruthy();
  backend.sendCommand({ type: 'breakpoint', nodeId: nodeId!, on: true });
  expect(replies.some((r) => r.type === 'breakpoint-ack')).toBe(true);

  s.next(7);
  await flush();
  const nexts = events.filter((e) => e.kind === 'next');
  expect(nexts.some((e) => e.breakpoint === true)).toBe(true);
  backend.disconnect();
});
