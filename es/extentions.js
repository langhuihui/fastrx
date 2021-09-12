var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LastSink } from "./common";
export const koaEventStream = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sink = new LastSink();
        const { res, req } = ctx;
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        sink.next = (data) => res.write((typeof data == 'string' ? data : 'data: ' + JSON.stringify(data)) + '\n\n');
        sink.complete = () => res.end();
        sink.error = () => res.end();
        const id = setInterval(() => res.write(':keep-alive\n\n'), 1000 * 30);
        sink.defer(() => clearInterval(id));
        (yield next())(sink);
        ctx.respond = false;
        req.on('close', () => sink.dispose());
    });
};
