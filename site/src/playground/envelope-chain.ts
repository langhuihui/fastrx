import type { Envelope } from "fastrx";

/**
 * Sequence numbers in the causal chain ending at `selectedSeq`.
 */
export function causeChainSet(
  events: Envelope[],
  selectedSeq: number | null,
): Set<number> {
  if (selectedSeq == null) return new Set();
  const set = new Set<number>([selectedSeq]);
  let cur = events.find((e) => e.sequence === selectedSeq);
  while (cur?.cause && !set.has(cur.cause.sequence)) {
    set.add(cur.cause.sequence);
    cur = events.find((e) => e.sequence === cur!.cause!.sequence);
  }
  return set;
}
