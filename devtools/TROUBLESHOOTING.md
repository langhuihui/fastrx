# FastRx 扩展故障排除指南

## 🔍 消息传递问题排查

### 1. 检查扩展是否正确加载

1. 打开 `chrome://extensions/`
2. 确保 FastRx 扩展已启用
3. 检查是否有错误信息
4. 点击"重新加载"按钮

### 2. 检查 DevTools 面板

1. 打开测试页面 `devtools/test.html`
2. 按 F12 打开 DevTools
3. 查看是否有 "FastRx" 面板
4. 如果没有，检查控制台错误

### 3. 检查消息传递

1. 打开测试页面
2. 打开浏览器控制台
3. 点击"测试连接"按钮
4. 查看控制台输出

### 4. 调试步骤

#### 步骤 1: 检查扩展状态
```javascript
// 在控制台执行
console.log('Extension status:', window.__FASTRX_DEVTOOLS__);
```

#### 步骤 2: 手动发送测试消息
```javascript
// 在控制台执行
window.postMessage({
    source: 'fastrx-devtools-backend',
    payload: {
        event: 'test',
        data: 'Manual test',
        timestamp: Date.now()
    }
}, '*');
```

#### 步骤 3: 检查消息监听
```javascript
// 在控制台执行
window.addEventListener('message', function(event) {
    console.log('Message received:', event.data);
});
```

### 5. 常见问题

#### 问题 1: 扩展未连接
**症状**: `window.__FASTRX_DEVTOOLS__` 为 undefined

**解决方案**:
1. 确保扩展已安装并启用
2. 重新加载扩展
3. 刷新页面

#### 问题 2: 消息未到达 DevTools
**症状**: 页面发送消息但 DevTools 面板无反应

**解决方案**:
1. 检查 content script 是否正确注入
2. 检查 background script 是否正常工作
3. 检查 DevTools 连接是否建立

#### 问题 3: 面板显示空白
**症状**: DevTools 面板打开但显示空白

**解决方案**:
1. 检查面板构建是否成功
2. 查看 DevTools 控制台错误
3. 重新构建面板

### 6. 日志检查

#### Content Script 日志
在页面控制台查看是否有以下日志：
- "FastRx Debug Script Loaded"
- "Extension status: ..."
- "Sending test message: ..."

#### Background Script 日志
在扩展管理页面点击"检查视图"查看 background script 日志

#### DevTools 日志
在 DevTools 控制台查看是否有：
- "DevTools received message: ..."
- "Unknown event type: ..."

### 7. 手动测试

#### 测试 1: 基本连接
1. 打开测试页面
2. 点击"测试连接"
3. 应该显示"✅ 扩展连接正常"

#### 测试 2: 消息发送
1. 点击"测试消息"
2. 查看调试信息
3. 检查 DevTools 面板是否收到消息

#### 测试 3: 事件模拟
1. 点击"模拟事件"
2. 观察时间轴变化
3. 检查事件列表更新

### 8. 重置步骤

如果问题持续存在，按以下步骤重置：

1. **卸载扩展**
   - 在 `chrome://extensions/` 中移除扩展

2. **清理缓存**
   - 清除浏览器缓存
   - 重启浏览器

3. **重新安装**
   - 重新加载扩展
   - 刷新测试页面

4. **验证安装**
   - 检查扩展状态
   - 测试基本功能

### 9. 联系支持

如果问题仍然存在，请提供以下信息：

1. Chrome 版本
2. 扩展版本
3. 错误日志
4. 复现步骤
5. 系统信息

## 常见问题及解决方案

### 1. 扩展加载问题

#### 问题：扩展无法加载或显示错误
**解决方案：**
1. 确保已构建面板：
   ```bash
   cd devtools/panel
   npm run build
   ```
2. 在 Chrome 中访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `devtools` 文件夹
6. 检查是否有错误信息

#### 问题：Content Security Policy (CSP) 错误
**错误信息：** `Refused to execute inline script because it violates the following Content Security Policy directive`
**解决方案：**
- ✅ **已修复**：扩展现在使用外部 JavaScript 文件而不是内联脚本
- 如果仍然遇到问题，请重新加载扩展：
  1. 在 `chrome://extensions/` 中点击扩展的刷新按钮
  2. 或者删除扩展后重新加载

### 2. DevTools 面板不可见

#### 问题：在 DevTools 中看不到 FastRx 标签页
**解决方案：**
1. 确保扩展已正确加载（在 `chrome://extensions/` 中显示为已启用）
2. 关闭所有 DevTools 窗口
3. 重新打开 DevTools (F12)
4. 检查标签页列表中是否有 "FastRx"
5. 如果仍然没有，尝试刷新页面后重新打开 DevTools

#### 问题：面板显示空白或加载错误
**解决方案：**
1. 检查 DevTools 控制台是否有错误信息
2. 确保 `devtools/panel/dist/` 目录存在且包含构建文件
3. 重新构建面板：
   ```bash
   cd devtools/panel
   npm run build
   ```
4. 重新加载扩展

### 3. 消息传递问题

#### 问题：页面消息无法传递到 DevTools 面板
**解决方案：**
1. 确保页面包含正确的消息格式：
   ```javascript
   window.postMessage({
     source: 'fastrx-devtools-backend',
     payload: {
       event: 'next',
       data: 'your data',
       timestamp: Date.now()
     }
   }, '*');
   ```
2. 检查 content script 是否正确注入（在页面控制台中应该能看到 `window.__FASTRX_DEVTOOLS__` 为 `true`）
3. 使用测试页面验证连接：打开 `devtools/test.html`

#### 问题：DevTools 面板无法接收消息
**解决方案：**
1. 检查 background script 是否正常运行
2. 在 DevTools 面板的控制台中查看是否有错误
3. 确保消息格式正确
4. 尝试重新加载扩展和页面

### 4. 调试步骤

#### 基本调试流程：
1. **检查扩展状态**：
   - 访问 `chrome://extensions/`
   - 确认扩展已启用且无错误

2. **检查页面连接**：
   - 打开测试页面 `devtools/test.html`
   - 点击"测试连接"按钮
   - 查看连接状态

3. **检查消息传递**：
   - 在测试页面点击"发送测试消息"
   - 查看调试信息是否显示消息发送成功
   - 在 DevTools 面板中查看是否收到消息

4. **检查 DevTools 面板**：
   - 打开 DevTools (F12)
   - 切换到 FastRx 标签页
   - 查看控制台是否有错误信息

#### 高级调试：
1. **查看 background script 日志**：
   - 在 `chrome://extensions/` 中点击扩展的"检查视图"
   - 查看控制台日志

2. **查看 content script 日志**：
   - 在页面控制台中查看日志
   - 检查 `window.__FASTRX_DEVTOOLS__` 变量

3. **查看 DevTools 面板日志**：
   - 在 DevTools 面板中打开控制台
   - 查看是否有错误或调试信息

### 5. 常见错误及解决方案

#### Manifest V3 相关问题：
- **错误**：`Service worker registration failed`
- **解决**：确保 background script 使用正确的格式，不使用已废弃的 API

#### 权限问题：
- **错误**：`Cannot access a chrome-extension:// URL`
- **解决**：确保 manifest.json 中包含正确的权限和 host_permissions

#### 构建问题：
- **错误**：`Module not found`
- **解决**：运行 `npm install` 安装依赖，然后重新构建

### 6. 重置和重新安装

如果遇到无法解决的问题，可以尝试完全重置：

1. **删除扩展**：
   - 在 `chrome://extensions/` 中删除扩展

2. **清理缓存**：
   - 清除浏览器缓存和 cookie
   - 重启浏览器

3. **重新安装**：
   - 重新构建面板：`npm run build`
   - 重新加载扩展

### 7. 测试页面使用

使用 `devtools/test.html` 进行功能测试：

1. **连接测试**：验证扩展是否正确注入
2. **消息测试**：验证消息传递是否正常
3. **事件模拟**：模拟 Rx 事件流
4. **调试信息**：查看详细的调试日志

### 8. 获取帮助

如果问题仍然存在：

1. 检查浏览器控制台的所有错误信息
2. 查看扩展的错误日志
3. 确认使用的 Chrome 版本支持 Manifest V3
4. 尝试在无痕模式下测试

---

**注意**：此扩展使用 Manifest V3，需要 Chrome 88+ 版本。如果使用较旧版本，请升级 Chrome 浏览器。 