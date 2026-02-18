 async function getPrayerTimes() {
    const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
    const json = await res.json();
    document.getElementById('imsak-time').innerText = json.data.timings.Imsak;
    document.getElementById('maghrib-time').innerText = json.data.timings.Maghrib;
}

async function loadAzkar() {
    const container = document.getElementById('azkar-container');
    try {
        const res = await fetch('azkar.json?nocache=' + Math.random());
        const azkar = await res.json();
        container.innerHTML = '';
        if (azkar.length > 0) {
            const latest = azkar[0].text;
            checkNotification(latest);
            azkar.forEach(item => {
                const div = document.createElement('div');
                div.className = 'zekr-item';
                div.innerHTML = `<p>${item.text}</p>`;
                container.appendChild(div);
            });
        }
    } catch (e) { container.innerHTML = '<p>لا توجد أذكار حالياً.</p>'; }
}

function checkNotification(text) {
    if (localStorage.getItem('lastZekr') !== text) {
        if (Notification.permission === "granted") {
            new Notification("✨ ذكر جديد", { body: text, icon: "icon.png" });
        }
        localStorage.setItem('lastZekr', text);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getPrayerTimes();
    loadAzkar();
    if ("Notification" in window) Notification.requestPermission();
    document.getElementById('date-today').innerText = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
});
