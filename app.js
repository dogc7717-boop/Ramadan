// ==================
// Supabase init
// ==================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(https://dxqpttiffkdrtbwzmvcd.supabase.co, sb_publishable_CWdAdibfoDfxUpALqTyOHQ_Jltfbggt);

// ==================
// UI helpers
// ==================
function showMessage(msg, type = "info") {
  const box = document.getElementById("msg");
  if (!box) return;

  box.textContent = msg;
  box.className = `msg ${type}`;
  box.style.display = "block";
}

// ==================
// Sign up (email + password)
// ==================
async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://dogc7717-boop.github.io/confirm.html",
    },
  });

  if (error) {
    showMessage(error.message, "error");
  } else {
    showMessage("📧 تم إرسال رسالة تأكيد إلى بريدك", "success");
  }
}

// ==================
// Sign in (email + password)
// ==================
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showMessage("❌ الإيميل أو الباسورد غير صحيح", "error");
    return;
  }

  if (!data.user.email_confirmed_at) {
    showMessage("⚠️ لازم تأكد الإيميل الأول", "warning");
    return;
  }

  window.location.href = "dashboard.html";
}

// ==================
// MAGIC LINK
// ==================
async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://dogc7717-boop.github.io/confirm.html",
    },
  });

  if (error) {
    showMessage(error.message, "error");
  } else {
    showMessage("✨ تم إرسال رابط الدخول على الإيميل", "success");
  }
}

// ==================
// Protect dashboard
// ==================
async function protectPage() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
  }
}

// ==================
// Export to window
// ==================
window.signUp = signUp;
window.signIn = signIn;
window.sendMagicLink = sendMagicLink;
window.protectPage = protectPage;
