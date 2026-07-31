import { merge } from "./combination";
import { create, LastSink, pipe } from "./common";
import { takeUntil } from "./filtering";
import { fromEvent, throwError } from "./producer";
import { switchMap } from "./transformation";
export const koaEventStream = async function (ctx, next) {
    const sink = new LastSink();
    const { res, req } = ctx;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', // <- Important headers
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    sink.next = (data) => res.write((typeof data == 'string' ? data : 'data: ' + JSON.stringify(data)) + '\n\n');
    sink.complete = () => res.end();
    sink.error = () => res.end();
    const id = setInterval(() => res.write(':keep-alive\n\n'), 1000 * 30);
    sink.defer(() => clearInterval(id));
    (await next())(sink);
    ctx.respond = false;
    req.on('close', () => sink.dispose());
};
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */
export function fromMessageEvent(target) {
    return create((sink) => {
        const closeOb = fromEvent(target, 'close');
        const messageOb = fromEvent(target, 'message');
        const errorOb = fromEvent(target, 'error');
        sink.defer(() => target.close());
        sink.subscribe(pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb)));
    }, "fromMessageEvent", arguments);
}
;
//# sourceMappingURL=extentions.js.map