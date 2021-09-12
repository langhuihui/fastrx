import { LastSink, Observable } from "./common";

export const koaEventStream = async function (ctx: any, next: () => Promise<Observable<unknown>>) {
    const sink = new LastSink();
    const { res, req } = ctx;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', // <- Important headers
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    sink.next = (data: string | Object) =>
        res.write((typeof data == 'string' ? data : 'data: ' + JSON.stringify(data)) + '\n\n');
    sink.complete = () => res.end();
    sink.error = () => res.end();
    const id = setInterval(() => res.write(':keep-alive\n\n'), 1000 * 30);
    sink.defer(() => clearInterval(id));
    (await next())(sink);
    ctx.respond = false;
    req.on('close', () => sink.dispose());
};