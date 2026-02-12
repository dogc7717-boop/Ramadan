// ===== تسجيل مستخدم جديد =====
function signupUser() {
  const name = document.getElementById("signupName")?.value.trim();
  const phone = document.getElementById("signupPhone")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const code = document.getElementById("signupCode")?.value.trim();
  const password = document.getElementById("signupPassword")?.value;
  const confirm = document.getElementById("signupConfirm")?.value;

  if (!name || !phone || !email || !password) {
    alert("أكمل جميع البيانات");
    return;
  }

  if (password !== confirm) {
    alert("كلمة المرور غير متطابقة");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.phone === phone)) {
    alert("رقم الهاتف مسجل مسبقاً");
    return;
  }

  const user = {
    name,
    phone,
    email,
    code,
    password,
    accepted_policy: false
  };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("تم التسجيل بنجاح");
  window.location.href = "index.html";
}

// ===== تسجيل دخول =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("loginPhone").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
      alert("بيانات غير صحيحة");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (!user.accepted_policy) {
      window.location.href = "policy_page.html";
    } else {
      window.location.href = "dashboard_page.html";
    }
  });
}

// ===== قبول السياسة =====
function acceptPolicy() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  user.accepted_policy = true;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(u => u.phone === user.phone ? user : u);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  window.location.href = "dashboard_page.html";
}

// ===== رفض السياسة =====
function rejectPolicy() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
