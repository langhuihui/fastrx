# fastrx DevTools 扩展

调试和可视化 fastrx 数据流的 Chrome DevTools 扩展。

## 架构

扩展通过 `externally_connectable` 与页面内的 fastrx 库直接通信，无需 content script 或注入脚本：

```
fastrx 库 (页面 main world)
  │ chrome.runtime.connect(extId, {name:'fastrx-backend'})
  ▼
background service worker
  │ onConnectExternal → 按 tabId 配对
  │ onConnect         → 面板端口 (name='fastrx-panel:<tabId>')
  ▼
devtools 面板 (Vue 3 + Naive UI)
```

- 面板打开时，`devtools.js` 通过 `inspectedWindow.eval` 把扩展 ID 写入 `window.__fastrxExtId`。
- fastrx 库检测到 `__fastrxExtId` 后，用 `chrome.runtime.connect` 打开长连接端口，按 `Envelope` 协议发送调试事件。
- 库未连接时（devtools 关闭 / Node 环境），事件入 500 条 ring buffer，连接建立时排空。
- 协议带 `version`、稳定 `nodeId`（`opName#N` + 可选 `.label()`）、`sequence`、`cause`（因果链）。

## 安装

```bash
# 1. 构建面板
cd devtools/devtools/panel
npm install
npm run build

# 2. 加载扩展
# chrome://extensions → 开发者模式 → 加载已解压的扩展程序 → 选择 devtools/ 文件夹

# 3. 使用
# 在使用 fastrx 的页面上打开 DevTools → 切到 "FastRx" 面板
```

## 文件结构

```
devtools/
├── manifest.json              # MV3 清单（externally_connectable）
├── background_scripts/
│   └── background.js          # service worker，端口配对 + doublePipe
├── devtools/
│   ├── devtools-page.html
│   ├── devtools.js            # 面板注册 + 设置 __fastrxExtId
│   └── panel/                 # Vue 3 面板
│       ├── src/App.vue
│       ├── dist/              # 构建输出
│       └── package.json
└── icons/
```

## 协议（Envelope）

```ts
interface Envelope {
  version: 1;
  sequence: number;            // 全局单调递增
  nodeId: string;              // `${opName}#${counter}`
  nodeLabel?: string;          // .label() 覆盖的显示名
  kind: 'create'|'next'|'complete'|'error'|'defer'|'subscribe'|'pipe'|'addSource';
  streamId: number;
  cause?: { nodeId: string; sequence: number };  // 因果前驱
  data?: string;               // 有界序列化值 / 结构事件的源 nodeId
  err?: string;
  ts: number;
}
```

点击事件流中的某条事件，面板会沿 `cause` 向上高亮整条因果链。

## 开发

```bash
cd devtools/devtools/panel
npm run dev    # Vite HMR
npm run build  # 生产构建
```

修改 `manifest.json` 或 `background.js` 后需在 `chrome://extensions` 重新加载扩展。

## 兼容性

- ✅ Chrome（`externally_connectable` 需 Chrome 76+）
- ❌ Firefox（`externally_connectable` 在 Firefox 128+ 支持，但未测试）
