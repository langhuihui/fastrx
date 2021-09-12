import { Events, ISink, Sink } from "./common";
import * as fastrx from './index';
let COUNT = 0;
type NodeSink = ISink<unknown> & { streamId: number, nodeId: number; };
export class Node {
    source?: Node;
    id: number = COUNT++;
    end: boolean;
    subscribeSink?: Function;
    constructor(public name: string | { name: string; } = '', public arg: any[] = []) {
        switch (name) {
            case 'subscribe':
            case 'toPromise':
            case 'toRef':
                this.end = true;
                break;
            default:
                this.end = false;
        }
        Events.create(this);
        if (arg.length) {
            this.args = arg;
        }
    }
    toString() {
        return `${typeof this.name == 'string' ? this.name : this.name.name}(${this.arg
            .map((x) =>
                typeof x == 'object' || typeof x == 'function'
                    ? (typeof x.name == 'function' ? x.name.name : x.name) || '...'
                    : x
            )
            .join(',')})`;
    }
    get unProxy() {
        return this;
    }
    //是否属于子流
    checkSubNode(x: Node | ((...args: any[]) => any)) {
        if ("unProxy" in x) {
            const isNode = x.unProxy;
            Events.addSource(this, isNode),
                (s: NodeSink) => {
                    s.nodeId = this.id;
                    s.streamId = 0;
                    isNode.subscribe(s);
                };
        } else if (typeof x == 'function') {
            (...arg: any[]): any => this.checkSubNode(x(...arg));
        }
        return x;
    }
    //过滤子事件流，放入sources数组中，就能显示
    set args(value: any[]) {
        this.arg = value.map((x) => this.checkSubNode(x));
    }
    // 通过返回proxy产生链式调用
    pipe() {
        if (this.end) {
            return this.subscribe();
        }
        const target = this;
        return new Proxy((sink: NodeSink) => this.subscribe(sink), {
            get(_, prop: (keyof Node) | string) {
                if (prop != 'subscribe' && (prop in target))
                    // @ts-ignore
                    return target[prop];
                if (prop == 'subscribe' && target.subscribeSink) return target.subscribeSink;
                const sink = target.createSink(prop);
                return (target.subscribeSink = (...args: any[]) => {
                    sink.args = args;
                    Events.update(sink);
                    return sink.pipe();
                });
            },
        });
    }
    createSink(name: string) {
        const sink = new Node(name);
        sink.source = this;
        Events.pipe(sink);
        return sink;
    }
    subscribe(sink?: NodeSink): unknown {
        const { source, name, arg } = this;
        // @ts-ignore
        const realrx = typeof name == 'string' ? fastrx[name](...arg) : name;
        let f =
            source && !this.end
                ? realrx((s: NodeSink) => {
                    s.streamId = streamCount - 1;
                    s.nodeId = this.id;
                    source.subscribe(s);
                })
                : realrx;
        let streamCount = 0;
        this.subscribe = function (sink?: NodeSink) {
            const streamId = streamCount++;
            if (sink) {
                const newSink = new Sink(sink);
                newSink.next = (data) => {
                    Events.next(this, streamId, data);
                    sink.next(data);
                };
                newSink.complete = () => {
                    Events.complete(this, streamId);
                    sink.complete();
                };
                newSink.error = (err) => {
                    Events.complete(this, streamId, err);
                    sink.error(err);
                };
                newSink.defer(() => {
                    Events.defer(this, streamId);
                });
                Events.subscribe(this, sink);
                f(newSink);
                return newSink;
            }
            return f((s: NodeSink) => {
                const { next, complete, error } = s;
                s.next = (data: any) => {
                    Events.next(this, streamId, data);
                    next(data);
                };
                s.error = (err) => {
                    Events.complete(this, streamId, err);
                    error(err);
                };
                s.complete = () => {
                    Events.complete(this, streamId);
                    complete();
                };
                s.streamId = streamId;
                s.nodeId = this.id;
                Events.subscribe(this);
                source!.subscribe(s);
            });

        };
        return this.subscribe(sink);
    }
}
