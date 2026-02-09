// ===============================
// Supabase Init
// ===============================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "PUT_YOUR_URL_HERE";
const SUPABASE_ANON_KEY = "PUT_YOUR_KEY_HERE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// UI Message Handler
// ===============================
function showMessage(text, type = "error") {
  const box = document.getElementById("auth-message");
  if (!box) return;

  box.textContent = text;
  box.className = `auth-message ${type}`;
  box.classList.remove("hidden");
}

// ===============================
// Signup
// ===============================
async function signup(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("rate limit")) {
      showMessage("⏳ تم المحاولة كثيرًا، انتظر قليلًا ثم أعد المحاولة");
    } else {
      showMessage("⚠️ فشل إنشاء الحساب، حاول لاحقًا");
    }
    return;
  }

  showMessage(
    "📩 تم إرسال رسالة تأكيد إلى بريدك الإلكتروني، افتحها لتفعيل الحساب",
    "success"
  );
}

// ===============================
// Login
// ===============================
async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login")) {
      showMessage("❌ البريد أو كلمة المرور غير صحيحة");
    } else if (error.message.includes("Email not confirmed")) {
      showMessage("📩 يجب تأكيد البريد الإلكتروني أولًا");
    } else if (error.message.includes("rate limit")) {
      showMessage("⏳ تم المحاولة كثيرًا، انتظر قليلًا");
    } else {
      showMessage("⚠️ حدث خطأ غير متوقع");
    }
    return;
  }

  window.location.href = "dashboard.html";
}

// ===============================
// Logout
// ===============================
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// ===============================
// Expose functions
// ===============================
window.signup = signup;
window.login = login;
window.logout = logout;
