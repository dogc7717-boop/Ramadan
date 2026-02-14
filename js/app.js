let count = 0;
const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

function addCount() { count++; document.getElementById('counter').innerText = count; if(navigator.vibrate) navigator.vibrate(40); }

function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }

function setZekr(z) { document.getElementById('zekrName').innerText = z; resetCounter(); }

function showPage(p) {
    document.getElementById('subhaPage').style.display = p === 'subha' ? 'block' : 'none';
    document.getElementById('prayerPage').style.display = p === 'prayer' ? 'block' : 'none';
}

function toggleSettings() {
    let s = document.getElementById('settingsPanel');
    s.style.display = s.style.display === 'block' ? 'none' : 'block';
}

function changeColor(c) { document.body.style.backgroundColor = c; document.body.style.backgroundImage = 'none'; }

function changeBg(e) {
    let r = new FileReader();
    r.onload = function() { document.body.style.backgroundImage = `url(${r.result})`; }
    r.readAsDataURL(e.target.files[0]);
}

// توليد الجدول بجميع المواقيت
const tableBody = document.getElementById('tableBody');
const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

days.forEach(d => {
    tableBody.innerHTML += `
    <tr>
        <td style="font-weight:bold; background:#f9f9f9;">${d}</td>
        <td contenteditable="true">04:15</td> <td contenteditable="true">04:30</td> <td contenteditable="true">12:05</td> <td contenteditable="true">03:20</td> <td contenteditable="true">06:10</td> <td contenteditable="true">07:30</td> </tr>`;
});
