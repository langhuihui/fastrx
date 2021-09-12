import { ISink } from "./common";
declare type NodeSink = ISink<unknown> & {
    streamId: number;
    nodeId: number;
};
export declare class Node {
    name: string | {
        name: string;
    };
    arg: any[];
    source?: Node;
    id: number;
    end: boolean;
    subscribeSink?: Function;
    constructor(name?: string | {
        name: string;
    }, arg?: any[]);
    toString(): string;
    get unProxy(): this;
    checkSubNode(x: Node | ((...args: any[]) => any)): Node | ((...args: any[]) => any);
    set args(value: any[]);
    pipe(): unknown;
    createSink(name: string): Node;
    subscribe(sink?: NodeSink): unknown;
}
export {};
//# sourceMappingURL=devtools.d.ts.map