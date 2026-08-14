#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 验证 FastRx 扩展组件...\n');

// 检查必要的文件
const requiredFiles = [
  'manifest.json',
  'content-script.js',
  'background_scripts/background.js',
  'devtools/devtools-page.html',
  'devtools/devtools.js',
  'devtools/panel/dist/index.html',
  'icons/favicon.png'
];

let allFilesExist = true;

console.log('📁 检查必要文件:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

// 检查 manifest.json
console.log('\n📋 检查 manifest.json:');
try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  console.log(`  ✅ manifest_version: ${manifest.manifest_version}`);
  console.log(`  ✅ name: ${manifest.name}`);
  console.log(`  ✅ version: ${manifest.version}`);

  if (manifest.manifest_version === 3) {
    console.log('  ✅ 使用 Manifest V3');
  } else {
    console.log('  ⚠️  建议升级到 Manifest V3');
  }

  if (manifest.permissions && manifest.permissions.includes('scripting')) {
    console.log('  ✅ 包含 scripting 权限');
  } else {
    console.log('  ❌ 缺少 scripting 权限');
  }

  if (manifest.host_permissions && manifest.host_permissions.includes('<all_urls>')) {
    console.log('  ✅ 包含 host_permissions');
  } else {
    console.log('  ❌ 缺少 host_permissions');
  }

} catch (error) {
  console.log(`  ❌ 无法解析 manifest.json: ${error.message}`);
  allFilesExist = false;
}

// 检查构建文件
console.log('\n🏗️  检查构建文件:');
const distPath = path.join(__dirname, 'devtools/panel/dist');
if (fs.existsSync(distPath)) {
  const distFiles = fs.readdirSync(distPath);
  console.log(`  ✅ dist 目录存在，包含 ${distFiles.length} 个文件`);
  distFiles.forEach(file => {
    console.log(`    - ${file}`);
  });
} else {
  console.log('  ❌ dist 目录不存在，需要运行 npm run build');
  allFilesExist = false;
}

// 检查 package.json
console.log('\n📦 检查 package.json:');
const packagePath = path.join(__dirname, 'devtools/panel/package.json');
if (fs.existsSync(packagePath)) {
  try {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`  ✅ 项目名称: ${package.name}`);
    console.log(`  ✅ React 版本: ${package.dependencies.react}`);
    console.log(`  ✅ Vite 版本: ${package.devDependencies.vite}`);
  } catch (error) {
    console.log(`  ❌ 无法解析 package.json: ${error.message}`);
  }
} else {
  console.log('  ❌ package.json 不存在');
}

// 总结
console.log('\n📊 验证总结:');
if (allFilesExist) {
  console.log('  ✅ 所有必要文件都存在');
  console.log('  ✅ 扩展应该可以正常工作');
  console.log('\n🚀 下一步:');
  console.log('  1. 在 Chrome 中访问 chrome://extensions/');
  console.log('  2. 启用开发者模式');
  console.log('  3. 点击"加载已解压的扩展程序"');
  console.log('  4. 选择 devtools 文件夹');
  console.log('  5. 打开 test-extension.html 进行测试');
} else {
  console.log('  ❌ 发现一些问题，请检查上述错误');
  console.log('\n🔧 修复建议:');
  console.log('  1. 运行 npm install 安装依赖');
  console.log('  2. 运行 npm run build 构建面板');
  console.log('  3. 检查文件路径是否正确');
}

console.log('\n📖 更多信息请查看 TROUBLESHOOTING.md'); 