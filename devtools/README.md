# FastRx Chrome 扩展

这是一个用于调试和可视化 FastRx 数据流的 Chrome DevTools 扩展。

## 🚀 新特性

- **Manifest V3 支持** - 已升级到最新的 Chrome 扩展标准
- **多轴时间轴** - 不同数据流在独立的时间轴上显示
- **动态动画** - 实时数据流动画和时间轴滚动
- **现代化 UI** - 使用 Naive UI 组件库
- **响应式设计** - 适配不同屏幕尺寸

## 📦 安装步骤

### 1. 构建面板

```bash
cd devtools/panel
npm install
npm run build
```

### 2. 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `devtools` 文件夹

### 3. 测试扩展

1. 打开 `devtools/test.html` 文件
2. 按 F12 打开 DevTools
3. 查看 "FastRx" 面板
4. 点击"模拟事件"按钮测试功能

## 🔧 主要文件结构

```
devtools/
├── manifest.json              # 扩展清单文件 (Manifest V3)
├── background_scripts/
│   └── background.js          # Service Worker
├── content-script.js          # 内容脚本
├── proxy.js                   # 代理脚本
├── devtools/
│   ├── devtools-page.html     # DevTools 页面
│   ├── devtools.js            # DevTools 脚本
│   └── panel/                 # 面板应用
│       ├── src/
│       ├── dist/              # 构建输出
│       └── package.json
├── icons/
│   └── Rx_Logo_S.png          # 扩展图标
└── test.html                  # 测试页面
```

## 🎯 功能特性

### 时间轴功能
- **单轴视图** - 所有事件在同一个时间轴上显示
- **多轴视图** - 每个数据流有独立的时间轴
- **实时滚动** - 时间轴持续滚动显示当前时间
- **事件标记** - 不同类型事件用不同颜色和动画显示

### 数据流可视化
- **流状态** - 显示每个流的活跃状态
- **事件筛选** - 按事件类型筛选显示
- **流分组** - 自动按数据流ID分组
- **颜色编码** - 每个流有独特的颜色标识

### 动画效果
- **数据流动画** - 数据在节点间流动的粒子动画
- **状态动画** - 活跃、完成、错误等状态的动画
- **悬停效果** - 鼠标悬停时的交互反馈
- **平滑过渡** - 视图切换的平滑动画

## 🔄 Manifest V3 升级说明

### 主要变更
1. **manifest_version**: 2 → 3
2. **background.scripts** → **background.service_worker**
3. **permissions** 分离为 **permissions** 和 **host_permissions**
4. **chrome.tabs.executeScript** → **chrome.scripting.executeScript**
5. 添加 **web_accessible_resources** 配置

### 兼容性
- ✅ Chrome 88+
- ✅ Edge 88+
- ❌ Firefox (需要额外适配)

## 🐛 故障排除

### 扩展无法加载
1. 确保已开启开发者模式
2. 检查 manifest.json 语法是否正确
3. 查看 Chrome 扩展页面的错误信息

### 面板无法显示
1. 确保已运行 `npm run build`
2. 检查 dist 文件夹是否存在
3. 重新加载扩展

### 连接问题
1. 确保在测试页面打开 DevTools
2. 检查控制台是否有错误信息
3. 尝试刷新页面

## 📝 开发说明

### 修改面板
```bash
cd devtools/panel
npm run dev    # 开发模式
npm run build  # 构建生产版本
```

### 修改扩展
- 修改 `manifest.json` 后需要重新加载扩展
- 修改 background script 后需要重新加载扩展
- 修改 content script 后需要刷新页面

## �� 许可证

MIT License 