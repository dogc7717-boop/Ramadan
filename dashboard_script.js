// ===== حماية الصفحة =====
function protectDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  if (!user.accepted_policy) {
    window.location.href = "policy_page.html";
    return;
  }
}
protectDashboard();

// ===== تسجيل خروج =====
function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===== التبويبات =====
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ===== الاشتراكات =====
const subscriptions = [
  { name: "200ج", price: 200, days: 3 },
  { name: "500ج", price: 500, days: 4 },
  { name: "750ج", price: 750, days: 7 },
  { name: "1000ج", price: 1000, days: 7 },
  { name: "5000ج", price: 5000, days: 15 },
  { name: "10000ج", price: 10000, days: 30 },
  { name: "VIP1", price: 25000, days: 40 },
  { name: "VIP2", price: 50000, days: 40 }
];

// ===== تحميل بيانات المستخدم =====
function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userInfo = document.getElementById("userInfo");
  const subscriptionList = document.getElementById("subscriptionList");
  const availableSubs = document.getElementById("availableSubs");

  if (!userInfo || !subscriptionList || !availableSubs) return;

  // بيانات المستخدم
  userInfo.innerText = `الاسم: ${user.name}\nالهاتف: ${user.phone}\nالبريد: ${user.email}`;

  // الاشتراكات الحالية
  if (!user.subscriptions) user.subscriptions = [];
  user.subscriptions = user.subscriptions.filter(s => new Date(s.end) > new Date());
  localStorage.setItem("currentUser", JSON.stringify(user));

  subscriptionList.innerHTML = "";
  user.subscriptions.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h4>${s.name}</h4>
      <p class="count" data-end="${s.end}"></p>
    `;
    subscriptionList.appendChild(div);
  });

  // الاشتراكات المتاحة
  availableSubs.innerHTML = "";
  subscriptions.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";
    div.onclick = () => buySubscription(s);
    div.innerHTML = `<h4>${s.name}</h4><p>${s.price} جنيه</p><p>${s.days} يوم</p>`;
    availableSubs.appendChild(div);
  });

  startCountdown();
}

// ===== شراء اشتراك =====
function buySubscription(s) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const end = new Date();
  end.setDate(end.getDate() + s.days);
  if (!user.subscriptions) user.subscriptions = [];
  user.subscriptions.push({ ...s, end: end });
  localStorage.setItem("currentUser", JSON.stringify(user));
  loadDashboard();
}

// ===== عداد الاشتراكات =====
function startCountdown() {
  document.querySelectorAll(".count").forEach(el => {
    const end = new Date(el.dataset.end);
    setInterval(() => {
      const diff = end - new Date();
      if (diff <= 0) {
        loadDashboard();
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff / 3600000) % 24;
      const m = Math.floor(diff / 60000) % 60;
      const s = Math.floor(diff / 1000) % 60;
      el.innerText = `${d}ي ${h}س ${m}د ${s}ث`;
    }, 1000);
  });
}

// ===== صفحة اللعبة =====
function loadGame() {
  const container = document.getElementById("gameContainer");
  if (!container) return;

  container.innerHTML = `
    <iframe src="game_page.html"></iframe>
  `;
}

// ===== بدء التحميل =====
window.onload = () => {
  loadDashboard();
  loadGame();
};
