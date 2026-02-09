// ==================
// Supabase init (NO import)
// ==================
const SUPABASE_URL = "https://dxqpttiffkdrtbwzmvcd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CWdAdibfoDfxUpALqTyOHQ_Jltfbggt";

const supabase = supabase.createClient

  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ==================
// Messages
// ==================
function showMessage(msg) {
  alert(msg); // مؤقتًا – هنجمّله بعدين
}

// ==================
// Sign Up
// ==================
async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    showMessage(error.message);
  } else {
    showMessage("تم إرسال رسالة تأكيد للإيميل");
  }
}

// ==================
// Sign In
// ==================
async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showMessage("خطأ في الدخول");
  } else {
    window.location.href = "dashboard.html";
  }
}

// ==================
// Expose
// ==================
window.signUp = signUp;
window.signIn = signIn;
