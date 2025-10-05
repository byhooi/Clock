# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个简洁的纯前端网页时钟应用，使用原生 HTML/CSS/JavaScript 构建，无需构建工具或依赖项。

## 核心架构

### 文件结构
- `index.html` - 主页面，包含时钟容器和各个信息展示区域
- `script.js` - 核心逻辑，处理时间更新、天气获取和一言语录
- `style.css` - 样式表，使用响应式设计和安全区域适配

### 功能模块

**时间更新 (script.js:1-19)**
- `updateTime()` - 每秒更新时间和日期显示
- 使用 `setInterval(updateTime, 1000)` 定时执行

**天气信息 (script.js:21-36)**
- `updateWeather()` - 从 wttr.in API 获取深圳天气
- 每30分钟更新一次：`setInterval(updateWeather, 30 * 60 * 1000)`
- 默认城市硬编码为"深圳"

**一言语录 (script.js:44-53)**
- `fetchHitokoto()` - 从 hitokoto.cn API 获取随机语录
- 每10分钟更新一次：`setInterval(fetchHitokoto, 10 * 60 * 1000)`
- 使用类型 `c=f`（来自网络）

### 样式特点

- 黑色背景 (#000) + 白色文字的极简设计
- 响应式布局：横屏、竖屏、移动端适配
- 使用 `env(safe-area-inset-*)` 适配刘海屏等特殊屏幕
- 禁用文字选择和长按菜单，优化全屏体验

## 开发说明

### 本地运行
直接在浏览器中打开 `index.html` 即可，无需任何构建步骤。

或使用简单的 HTTP 服务器：
```bash
python -m http.server 8000
# 或
npx serve
```

### 修改天气城市
在 `script.js:23` 修改 URL 中的城市名称：
```javascript
const response = await fetch('https://wttr.in/你的城市?format=j1');
```

### 调整更新频率
- 天气更新间隔：`script.js:56`
- 一言更新间隔：`script.js:62`

## PWA 功能

虽然代码中配置了 PWA meta 标签（Apple Web App），但当前仓库中没有 manifest.json 或 service worker。如需完整 PWA 支持，需要添加这些文件。
