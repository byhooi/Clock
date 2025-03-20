function updateTime() {
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

async function updateWeather() {
    try {
        const response = await fetch('https://wttr.in/深圳?format=j1');
        const data = await response.json();

        const temperature = data.current_condition[0].temp_C;
        const description = data.current_condition[0].lang_zh[0].value;

        document.getElementById('temperature').textContent = `${temperature}°C`;
        document.getElementById('description').textContent = description;
    } catch (error) {
        console.error('获取天气信息失败:', error);
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('description').textContent = '获取天气失败';
    }
}

// 每秒更新时间
setInterval(updateTime, 1000);

// 立即更新时间
updateTime();

// 每30分钟更新一次天气
setInterval(updateWeather, 30 * 60 * 1000);

// 立即更新天气
updateWeather();