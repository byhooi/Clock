# 智能时钟 ⏰

一个功能完整的现代化网页时钟应用，支持深浅主题、自动定位、离线使用等功能。

## ✨ 主要功能

### 核心功能
- 🕐 **实时时间** - 精确到秒的时间显示
- 📅 **日期星期** - 完整的日期和星期信息
- 🌤️ **实时天气** - 基于 Open-Meteo API 的准确天气数据
- 💭 **一言语录** - 定期更新的精选语录

### 增强功能
- 🎨 **主题切换** - 深色/浅色主题自由切换
- 📍 **自动定位** - 首次使用自动检测城市
- 🏙️ **多城市支持** - 内置 8 个主要城市
- 💾 **离线缓存** - 失败时显示缓存数据
- 📱 **PWA 支持** - 可添加到主屏幕
- ⚡ **离线使用** - Service Worker 离线缓存

### 交互特性
- 双击屏幕打开设置
- 点击语录刷新内容
- 设置面板支持城市选择、主题切换、手动刷新

## 🚀 使用方法

### 在线访问
直接在浏览器中打开 `index.html` 即可使用。

### 本地运行
如需测试 PWA 功能，需要使用 HTTPS 或 localhost：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 访问
http://localhost:8000
```

### 添加到主屏幕
1. 在移动浏览器中打开应用
2. 选择"添加到主屏幕"
3. 享受原生应用般的体验

## 🛠️ 技术特性

- **纯前端实现** - 无需构建工具或后端
- **模块化架构** - 清晰的代码组织
- **响应式设计** - 适配各种屏幕尺寸
- **错误处理** - 完善的错误处理和重试机制
- **数据持久化** - localStorage 保存用户设置
- **API 优化** - 超时控制、指数退避重试

## 📦 项目结构

```
Clock/
├── index.html       # 主页面
├── script.js        # 核心逻辑 (430+ 行)
├── style.css        # 样式表 (390+ 行)
├── manifest.json    # PWA 配置
├── sw.js           # Service Worker
├── CLAUDE.md       # 代码库指南
└── README.md       # 项目说明
```

## 🎨 主题系统

应用支持两种主题：

- **深色主题** - 黑色背景，白色文字（默认）
- **浅色主题** - 浅灰背景，深色文字

主题设置会自动保存到本地存储。

## 🌍 支持城市

内置支持以下城市：
- 深圳、北京、上海、广州
- 杭州、成都、武汉、西安

可通过修改 `script.js` 中的 `CONFIG.CITIES` 添加更多城市。

## 🔧 自定义配置

所有配置集中在 `script.js` 的 `CONFIG` 对象中：

```javascript
const CONFIG = {
    WEATHER_INTERVAL: 30 * 60 * 1000,  // 天气更新间隔
    HITOKOTO_INTERVAL: 10 * 60 * 1000, // 语录更新间隔
    API_TIMEOUT: 10000,                 // API 超时时间
    MAX_RETRIES: 3,                     // 最大重试次数
    // ...
};
```

## 🌐 API 说明

### Open-Meteo 天气 API
- 免费无限制，无需 API Key
- 提供准确的天气数据
- 官网: https://open-meteo.com/

### 一言 API
- 免费公共服务
- 提供随机语录
- 官网: https://hitokoto.cn/

## 📱 浏览器兼容性

- ✅ Chrome / Edge (推荐)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Android Chrome
- ⚠️ 需要支持 ES6+ (async/await)

## 特别感谢

特别感谢 [Trae](https://github.com/Trae) 的贡献。

## 📄 开源协议

本项目采用 MIT 协议开源。