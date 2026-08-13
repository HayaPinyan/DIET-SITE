// ==================================================
// הגדרות
// ==================================================

const WEIGHT_PASSWORD =
    "543543";


// ==================================================
// אלמנטים
// ==================================================

const passwordInput =
    document.getElementById(
        "weightPassword"
    );

const loginButton =
    document.getElementById(
        "weightLoginButton"
    );

const errorMessage =
    document.getElementById(
        "weightLoginError"
    );


// ==================================================
// כניסה
// ==================================================

function loginToWeight() {

    const enteredPassword =
        passwordInput.value;


    if (
        enteredPassword ===
        WEIGHT_PASSWORD
    ) {

        localStorage.setItem(
            "weightAccess",
            "true"
        );


        window.location.href =
            "weight.html";


        return;

    }


    errorMessage.textContent =
        "❌ הסיסמה שגויה";


    passwordInput.value =
        "";


    passwordInput.focus();

}


// ==================================================
// לחיצה על הכפתור
// ==================================================

loginButton.addEventListener(
    "click",
    loginToWeight
);


// ==================================================
// Enter
// ==================================================

passwordInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            loginToWeight();

        }

    }
);