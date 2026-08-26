// הגדרת סיסמת ברירת מחדל במידה ולא הוגדרה סיסמה בעבר
if (!localStorage.getItem("app_password")) {
    localStorage.setItem("app_password", "1234");
}

// אלמנטים להתחברות
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// אלמנטים לשינוי סיסמה
const currentPassInput = document.getElementById("currentPassInput");
const newPassInput = document.getElementById("newPassInput");
const changePassBtn = document.getElementById("changePassBtn");
const changePassMsg = document.getElementById("changePassMsg");

// ==========================================
// אימות והתחברות
// ==========================================
if (loginBtn) {
    loginBtn.addEventListener("click", performLogin);
}

if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performLogin();
    });
}

function performLogin() {
    const enteredPassword = passwordInput.value;
    const savedPassword = localStorage.getItem("app_password");

    if (enteredPassword === savedPassword) {
        // סיסמה נכונה - מעבר לדף המשקל
        sessionStorage.setItem("is_authenticated", "true");
        window.location.href = "weight.html";
    } else {
        // סיסמה שגויה
        loginError.style.display = "block";
        passwordInput.value = "";
    }
}

// ==========================================
// שינוי סיסמה
// ==========================================
if (changePassBtn) {
    changePassBtn.addEventListener("click", () => {
        const currentVal = currentPassInput.value;
        const newVal = newPassInput.value;
        const savedPassword = localStorage.getItem("app_password");

        if (currentVal !== savedPassword) {
            changePassMsg.style.color = "red";
            changePassMsg.textContent = "הסיסמה הנוכחית אינה נכונה.";
            changePassMsg.style.display = "block";
            return;
        }

        if (!newVal || newVal.trim() === "") {
            changePassMsg.style.color = "red";
            changePassMsg.textContent = "נא להזין סיסמה חדשה תקינה.";
            changePassMsg.style.display = "block";
            return;
        }

        // שמירת הסיסמה החדשה
        localStorage.setItem("app_password", newVal.trim());

        changePassMsg.style.color = "green";
        changePassMsg.textContent = "הסיסמה עודכנה בהצלחה! כעת ניתן להתחבר עם הסיסמה החדשה.";
        changePassMsg.style.display = "block";

        // איפוס שדות
        currentPassInput.value = "";
        newPassInput.value = "";
    });
}