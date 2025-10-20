# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个功能完整的纯前端网页时钟应用，使用原生 HTML/CSS/JavaScript 构建，支持 PWA 离线功能，无需构建工具或依赖项。

## 核心架构

### 文件结构
- `index.html` - 主页面，包含时钟容器和各个信息展示区域
- `script.js` - 核心逻辑，模块化架构，处理所有功能
- `style.css` - 样式表，支持深浅主题、响应式设计和过渡动画
- `manifest.json` - PWA 配置文件
- `sw.js` - Service Worker，实现离线缓存

### 功能模块 (script.js)

**配置常量 (script.js:1-55)**
- `CONFIG.CITIES` - 8个主要城市的坐标映射
- `CONFIG.WEATHER_CODES` - Open-Meteo 天气代码中文映射
- `CONFIG.API_TIMEOUT` - API 超时设置 (10秒)
- `CONFIG.MAX_RETRIES` - 重试次数 (3次)

**工具函数 (script.js:57-104)**
- `fetchWithTimeout()` - 带超时控制的 fetch
- `fetchWithRetry()` - 指数退避重试机制
- `Storage` - localStorage 封装，安全读写

**时钟模块 (script.js:125-151)**
- `Clock.init()` - 初始化时钟
- `Clock.updateTime()` - 每秒更新时间和日期

**天气模块 (script.js:153-214)**
- `Weather.init()` - 初始化天气更新
- `Weather.fetchWeather()` - 从 Open-Meteo API 获取天气
- `Weather.showCachedData()` - 失败时显示缓存数据
- API: `https://api.open-meteo.com/v1/forecast`

**一言模块 (script.js:216-262)**
- `Hitokoto.init()` - 初始化语录更新
- `Hitokoto.fetch()` - 获取一言语录
- `Hitokoto.refresh()` - 手动刷新（点击语录触发）

**主题管理 (script.js:106-123)**
- `Theme.init()` - 加载保存的主题
- `Theme.toggle()` - 切换深浅主题
- 支持深色/浅色两种主题

**设置面板 (script.js:264-358)**
- `Settings.createPanel()` - 动态创建设置界面
- 双击屏幕打开设置
- 支持城市选择、主题切换、手动刷新

**地理位置检测 (script.js:360-394)**
- `Geolocation.detectCity()` - 自动检测用户位置
- `Geolocation.findNearestCity()` - 查找最近城市
- 首次运行自动检测

### 样式特点 (style.css)

**主题系统**
- CSS 变量实现深浅主题
- 深色主题：黑色背景 (#000)
- 浅色主题：浅灰背景 (#f5f5f7)

**动画效果**
- 淡入动画 (fadeIn)
- 错误抖动动画 (shake)
- 设置面板滑入动画 (slideUp)
- 按钮悬停效果

**响应式设计**
- 横屏/竖屏自适应
- 移动端优化 (<768px, <480px)
- 使用 `env(safe-area-inset-*)` 适配刘海屏

### PWA 功能

**manifest.json**
- 支持添加到主屏幕
- 独立窗口运行 (standalone)
- SVG 图标支持

**Service Worker (sw.js)**
- 缓存静态资源 (HTML/CSS/JS)
- API 网络优先策略
- 离线时使用缓存数据
- 自动清理旧缓存

## 开发说明

### 本地运行
直接在浏览器中打开 `index.html` 即可，但 Service Worker 需要 HTTPS 或 localhost：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:8000
```

### 添加新城市
在 `script.js:4-12` 的 `CONFIG.CITIES` 中添加：
```javascript
'城市名': { lat: 纬度, lon: 经度, name: '城市名' }
```

### 修改配置
所有配置集中在 `script.js:1-55` 的 `CONFIG` 对象中：
- 更新频率
- API 超时时间
- 重试次数
- 天气代码映射

### 主题定制
修改 `style.css:1-24` 的 CSS 变量：
```css
:root {
    --bg-color: #000;
    --text-color: #fff;
    /* ... */
}
```

## API 说明

### Open-Meteo 天气 API
- **免费无限制**，无需 API Key
- 返回实时温度和天气代码
- 自动时区检测

### 一言 API
- 免费公共 API
- 返回随机语录文本
- 类型 `c=f` (来自网络)

## 用户交互

- **双击屏幕** - 打开设置面板
- **点击语录** - 刷新一言
- **设置面板** - 城市选择、主题切换、手动刷新

## 数据持久化

使用 localStorage 保存：
- `selectedCity` - 选择的城市
- `theme` - 主题设置
- `lastWeather` - 最后获取的天气数据
- `lastHitokoto` - 最后获取的语录

## 浏览器兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- iOS Safari (支持 PWA)
- Android Chrome (支持 PWA)
- 需要 ES6+ 支持 (async/await)
