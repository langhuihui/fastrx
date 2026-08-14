interface ChromePort {
  onMessage: { addListener(fn: (msg: unknown) => void): void };
  onDisconnect: { addListener(fn: () => void): void };
  postMessage(msg: unknown): void;
}

declare const chrome: {
  runtime?: {
    connect: (info: { name: string }) => ChromePort;
  };
  devtools?: {
    inspectedWindow: { tabId: number };
  };
};
