# fastrx DevTools 故障排除

新架构用 `externally_connectable` 直连，旧的 4 跳中继（content script + proxy.js + 双 background 路径）已移除，绝大多数旧排错条目不再适用。

## 面板看不到事件

1. 确认页面使用了带 devtools 插桩的 fastrx（库始终包装 `Inspect`；若用 `__FASTRX_NO_DEVTOOLS__` 编译则无插桩）。
2. 在页面控制台检查 `window.__fastrxExtId`：面板打开后应为扩展 ID，面板关闭后为 `''`。
   - 若打开面板后仍为 `undefined`：`devtools.js` 的 `handleShown` 没执行，检查 `chrome.devtools.inspectedWindow.eval` 是否被 CSP 拦截。
3. 在页面控制台检查 `typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.connect`：
   - 为 `true` 说明 `externally_connectable` 生效。
   - 为 `false` 说明页面不在 `matches`（`<all_urls>` 应覆盖所有 http/https 页面；`chrome://` 等浏览器页面不支持）。
4. 在扩展的 Service Worker 控制台（`chrome://extensions` → 扩展 → "Service Worker"）看 `onConnectExternal` 是否触发。未触发说明库未成功 `connect`。
5. 刷新页面：`__fastrxExtId` 在页面加载时若已存在（面板此前打开过），库会在加载时即连接；若库先于 `__fastrxExtId` 加载，库通过 setter 在 ID 写入时连接。

## 面板空白 / "FastRx" 面板不存在

1. `cd devtools/devtools/panel && npm run build` 确认 `dist/index.html` 存在。
2. `chrome://extensions` 重新加载扩展。
3. 关闭并重开 DevTools。

## 事件在 devtools 关闭时丢失

预期行为：devtools 关闭时，库把事件缓冲到 500 条 ring buffer，打开面板连接建立后排空。超过 500 条的旧事件被丢弃。若需要更长历史，调大 `src/common.ts` 的 `RING_MAX`。

## Service Worker 死亡（MV3）

SW 空闲会被 Chrome 回收。SW 死亡时库的端口断开，`port` 置空，库恢复 ring 缓冲。面板的 1s 重连循环会唤醒 SW，`onConnectExternal` 重新配对，库重新连接并排空 ring。无需手动干预。

## Firefox 不支持

`externally_connectable` 需 Firefox 128+，且本扩展未在 Firefox 上测试。Chrome 优先。

## 旧协议（已废弃）

以下旧文件已删除，旧排错条目（content-script 注入、proxy.js、`__FASTRX_DEVTOOLS__` 全局标志、双 background 路径）全部不再适用：
- `devtools/content-script.js`
- `devtools/proxy.js`
- `devtools/devtools/panel/devtools-panel.js`（legacy scaffold）
- `window.__FASTRX_DEVTOOLS__` 全局标志（改用 `window.__fastrxExtId`）
