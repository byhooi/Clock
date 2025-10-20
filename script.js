// ==================== 配置常量 ====================
const CONFIG = {
    // 城市坐标映射
    CITIES: {
        '深圳': { lat: 22.54, lon: 114.06, name: '深圳' },
        '北京': { lat: 39.90, lon: 116.41, name: '北京' },
        '上海': { lat: 31.23, lon: 121.47, name: '上海' },
        '广州': { lat: 23.13, lon: 113.26, name: '广州' },
        '杭州': { lat: 30.27, lon: 120.15, name: '杭州' },
        '成都': { lat: 30.57, lon: 104.07, name: '成都' },
        '武汉': { lat: 30.59, lon: 114.30, name: '武汉' },
        '西安': { lat: 34.27, lon: 108.93, name: '西安' }
    },

    // 更新间隔
    WEATHER_INTERVAL: 30 * 60 * 1000, // 30分钟
    HITOKOTO_INTERVAL: 10 * 60 * 1000, // 10分钟

    // API 超时
    API_TIMEOUT: 10000, // 10秒

    // 重试配置
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000, // 2秒

    // 天气代码映射 (Open-Meteo)
    WEATHER_CODES: {
        0: '晴朗',
        1: '基本晴朗',
        2: '部分多云',
        3: '阴天',
        45: '有雾',
        48: '雾凇',
        51: '小毛毛雨',
        53: '中毛毛雨',
        55: '大毛毛雨',
        61: '小雨',
        63: '中雨',
        65: '大雨',
        66: '冻雨',
        67: '强冻雨',
        71: '小雪',
        73: '中雪',
        75: '大雪',
        77: '雪粒',
        80: '小阵雨',
        81: '中阵雨',
        82: '大阵雨',
        85: '小阵雪',
        86: '大阵雪',
        95: '雷暴',
        96: '雷暴伴冰雹',
        99: '强雷暴伴冰雹'
    }
};

// ==================== 工具函数 ====================

// 带超时的 fetch
async function fetchWithTimeout(url, timeout = CONFIG.API_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// 指数退避重试
async function fetchWithRetry(url, maxRetries = CONFIG.MAX_RETRIES) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetchWithTimeout(url);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * Math.pow(2, i)));
        }
    }
}

// 本地存储工具
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('存储失败:', error);
        }
    }
};

// ==================== 主题管理 ====================
const Theme = {
    init() {
        const savedTheme = Storage.get('theme', 'dark');
        this.apply(savedTheme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.apply(newTheme);
        Storage.set('theme', newTheme);
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

// ==================== 时钟模块 ====================
const Clock = {
    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    },

    updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        // 更新时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // 更新日期
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekday = weekdays[now.getDay()];
        dateElement.textContent = `${year}年${month}月${date}日 ${weekday}`;
    }
};

// ==================== 天气模块 ====================
const Weather = {
    async init() {
        await this.update();
        setInterval(() => this.update(), CONFIG.WEATHER_INTERVAL);
    },

    async update() {
        const city = Storage.get('selectedCity', '深圳');

        try {
            const data = await this.fetchWeather(city);
            this.display(data);
            Storage.set('lastWeather', { data, timestamp: Date.now() });
        } catch (error) {
            console.error('获取天气信息失败:', error);
            this.showError();
            // 显示缓存数据
            this.showCachedData();
        }
    },

    async fetchWeather(city) {
        const cityData = CONFIG.CITIES[city];
        if (!cityData) throw new Error('城市不存在');

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,weather_code&timezone=auto`;
        const response = await fetchWithRetry(url);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        return {
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            description: CONFIG.WEATHER_CODES[data.current.weather_code] || '未知天气',
            city: cityData.name
        };
    },

    display(data) {
        document.getElementById('temperature').textContent = `${data.temperature}°C`;
        document.getElementById('description').textContent = data.description;
        document.getElementById('temperature').classList.remove('error');
        document.getElementById('description').classList.remove('error');
    },

    showError() {
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('description').textContent = '获取天气失败';
        document.getElementById('temperature').classList.add('error');
        document.getElementById('description').classList.add('error');
    },

    showCachedData() {
        const cached = Storage.get('lastWeather');
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            this.display(cached.data);
        }
    }
};

// ==================== 一言模块 ====================
const Hitokoto = {
    async init() {
        await this.fetch();
        setInterval(() => this.fetch(), CONFIG.HITOKOTO_INTERVAL);
    },

    async fetch() {
        try {
            const response = await fetchWithRetry('https://v1.hitokoto.cn/?c=f&encode=text');

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const text = await response.text();
            this.display(text);
            Storage.set('lastHitokoto', { text, timestamp: Date.now() });
        } catch (error) {
            console.error('获取一言失败:', error);
            this.showError();
            this.showCachedData();
        }
    },

    display(text) {
        const element = document.querySelector('#hitokoto_text');
        element.textContent = text;
        element.classList.remove('error');
    },

    showError() {
        const element = document.querySelector('#hitokoto_text');
        element.textContent = '获取语录失败';
        element.classList.add('error');
    },

    showCachedData() {
        const cached = Storage.get('lastHitokoto');
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            this.display(cached.text);
        }
    },

    // 手动刷新
    refresh() {
        this.fetch();
    }
};

// ==================== 设置面板 ====================
const Settings = {
    init() {
        this.createPanel();
        this.bindEvents();
    },

    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <div class="settings-content">
                <h2>设置</h2>

                <div class="setting-group">
                    <label>城市选择</label>
                    <select id="city-select">
                        ${Object.keys(CONFIG.CITIES).map(city =>
                            `<option value="${city}">${city}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="setting-group">
                    <label>主题</label>
                    <div class="theme-buttons">
                        <button class="theme-btn" data-theme="dark">深色</button>
                        <button class="theme-btn" data-theme="light">浅色</button>
                    </div>
                </div>

                <div class="setting-actions">
                    <button id="refresh-weather">刷新天气</button>
                    <button id="refresh-hitokoto">刷新语录</button>
                    <button id="close-settings">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 恢复保存的城市
        const savedCity = Storage.get('selectedCity', '深圳');
        document.getElementById('city-select').value = savedCity;
    },

    bindEvents() {
        // 打开设置 - 双击屏幕
        document.querySelector('.clock-container').addEventListener('dblclick', () => {
            this.show();
        });

        // 关闭设置
        document.getElementById('close-settings').addEventListener('click', () => {
            this.hide();
        });

        // 城市切换
        document.getElementById('city-select').addEventListener('change', (e) => {
            Storage.set('selectedCity', e.target.value);
            Weather.update();
        });

        // 主题切换
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                Theme.apply(theme);
                Storage.set('theme', theme);
            });
        });

        // 刷新按钮
        document.getElementById('refresh-weather').addEventListener('click', () => {
            Weather.update();
        });

        document.getElementById('refresh-hitokoto').addEventListener('click', () => {
            Hitokoto.refresh();
        });

        // 点击一言刷新
        document.querySelector('.hitokoto').addEventListener('click', () => {
            Hitokoto.refresh();
        });
    },

    show() {
        document.getElementById('settings-panel').classList.add('show');
    },

    hide() {
        document.getElementById('settings-panel').classList.remove('show');
    }
};

// ==================== 地理位置检测 ====================
const Geolocation = {
    async detectCity() {
        if (!navigator.geolocation) return null;

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const city = this.findNearestCity(latitude, longitude);
                    resolve(city);
                },
                () => resolve(null),
                { timeout: 5000 }
            );
        });
    },

    findNearestCity(lat, lon) {
        let nearest = null;
        let minDistance = Infinity;

        for (const [name, coords] of Object.entries(CONFIG.CITIES)) {
            const distance = Math.sqrt(
                Math.pow(coords.lat - lat, 2) + Math.pow(coords.lon - lon, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearest = name;
            }
        }

        return nearest;
    }
};

// ==================== 应用初始化 ====================
async function init() {
    // 初始化主题
    Theme.init();

    // 初始化时钟
    Clock.init();

    // 尝试地理位置检测
    if (!Storage.get('selectedCity')) {
        const detectedCity = await Geolocation.detectCity();
        if (detectedCity) {
            Storage.set('selectedCity', detectedCity);
        }
    }

    // 初始化天气
    await Weather.init();

    // 初始化一言
    await Hitokoto.init();

    // 初始化设置面板
    Settings.init();

    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('Service Worker 注册失败:', err);
        });
    }
}

// 启动应用
init();
