
// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1500;
const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// אלמנטים
// ==================================================

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");


// חלונית

const dayModal =
    document.getElementById("dayModal");

const closeModal =
    document.getElementById("closeModal");

const modalDate =
    document.getElementById("modalDate");

const modalTasks =
    document.getElementById("modalTasks");

const modalScore =
    document.getElementById("modalScore");


// ==================================================
// נתונים
// ==================================================

const dietData =
    JSON.parse(
        localStorage.getItem("dietData")
    ) || {};

const foodData =
    JSON.parse(
        localStorage.getItem("foodData")
    ) || {};

const activityData =
    JSON.parse(
        localStorage.getItem("activityData")
    ) || {};

const finishDayData =
    JSON.parse(
        localStorage.getItem("finishDayData")
    ) || {};


// ==================================================
// החודש שמוצג
// ==================================================

let displayedDate =
    new Date();


// ==================================================
// שמות חודשים
// ==================================================

const monthNames = [

    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר"

];


// ==================================================
// יצירת מפתח לתאריך
// ==================================================

function getDateKey(
    year,
    month,
    day
) {

    return (
        year +
        "-" +
        String(
            month + 1
        ).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


// ==================================================
// תאריך היום בישראל
// ==================================================

function getIsraelToday() {

    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Jerusalem",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).formatToParts(
            new Date()
        );


    return new Date(

        Number(
            parts.find(
                x => x.type === "year"
            ).value
        ),

        Number(
            parts.find(
                x => x.type === "month"
            ).value
        ) - 1,

        Number(
            parts.find(
                x => x.type === "day"
            ).value
        )

    );

}


// ==================================================
// חישוב קלוריות של יום
// ==================================================

function getCalories(dateKey) {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (
            total,
            food
        ) => {

            return (
                total +
                Number(food.calories)
            );

        },
        0
    );

}


// ==================================================
// חישוב דקות פעילות
// ==================================================

function getActivityMinutes(
    dateKey
) {

    const activities =
        activityData[dateKey] || [];


    return activities.reduce(
        (
            total,
            activity
        ) => {

            return (
                total +
                Number(activity.minutes)
            );

        },
        0
    );

}


// ==================================================
// האם התזונה הצליחה
// ==================================================

function isFoodSuccess(
    dateKey
) {

    // חייבים לסיים את היום
    if (
        !finishDayData[dateKey] ||
        finishDayData[dateKey].finished !== true
    ) {

        return false;

    }


    const calories =
        getCalories(dateKey);


    return (
        calories <=
        DAILY_CALORIE_TARGET
    );

}


// ==================================================
// האם הפעילות הצליחה
// ==================================================

function isActivitySuccess(
    dateKey
) {

    const minutes =
        getActivityMinutes(dateKey);


    return (
        minutes >=
        DAILY_ACTIVITY_TARGET
    );

}


// ==================================================
// האם האתגר הצליח
// ==================================================

function isChallengeSuccess(
    dateKey
) {

    return !!(
        dietData[dateKey] &&
        dietData[dateKey].challenge
    );

}


// ==================================================
// ציון היום
// ==================================================

function getScore(
    dateKey
) {

    let score = 0;


    if (
        isFoodSuccess(dateKey)
    ) {

        score++;

    }


    if (
        isActivitySuccess(dateKey)
    ) {

        score++;

    }


    if (
        isChallengeSuccess(dateKey)
    ) {

        score++;

    }


    return score;

}


// ==================================================
// יצירת לוח השנה
// ==================================================

function renderCalendar() {

    calendar.innerHTML =
        "";


    const year =
        displayedDate.getFullYear();

    const month =
        displayedDate.getMonth();


    monthTitle.textContent =
        `${monthNames[month]} ${year}`;


    // ----------------------------------------------
    // היום הראשון בחודש
    // ----------------------------------------------

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // ----------------------------------------------
    // היום האחרון בחודש
    // ----------------------------------------------

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    // 0 = ראשון
    // ולכן אין צורך להזיז

    const startingDay =
        firstDay.getDay();


    // ----------------------------------------------
    // תאים ריקים
    // ----------------------------------------------

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement(
                "div"
            );


        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );


        calendar.appendChild(
            emptyDay
        );

    }


    // ----------------------------------------------
    // היום בישראל
    // ----------------------------------------------

    const today =
        getIsraelToday();


    // ----------------------------------------------
    // ימי החודש
    // ----------------------------------------------

    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        const score =
            getScore(dateKey);


        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.classList.add(
            "calendar-day",
            `score-${score}`
        );


        // ------------------------------------------
        // היום הנוכחי
        // ------------------------------------------

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // ------------------------------------------
        // תוכן
        // ------------------------------------------

        dayElement.innerHTML = `

            <span class="date-number">
                ${day}
            </span>

            <span class="score">
                ${score}/3
            </span>

        `;


        // ------------------------------------------
        // לחיצה
        // ------------------------------------------

        dayElement.addEventListener(
            "click",
            () => {

                openDayModal(
                    dateKey,
                    day
                );

            }
        );


        calendar.appendChild(
            dayElement
        );

    }

}


// ==================================================
// פתיחת חלונית יום
// ==================================================

function openDayModal(
    dateKey,
    day
) {

    const month =
        displayedDate.getMonth();

    const year =
        displayedDate.getFullYear();


    modalDate.textContent =
        `${day} ב${monthNames[month]} ${year}`;


    const calories =
        getCalories(dateKey);


    const activityMinutes =
        getActivityMinutes(dateKey);


    const foodSuccess =
        isFoodSuccess(dateKey);


    const activitySuccess =
        isActivitySuccess(dateKey);


    const challengeSuccess =
        isChallengeSuccess(dateKey);


    const score =
        getScore(dateKey);


    // ----------------------------------------------
    // תוכן החלונית
    // ----------------------------------------------

    modalTasks.innerHTML =
        "";


    // ----------------------------------------------
    // תזונה
    // ----------------------------------------------

    const foodElement =
        document.createElement("div");


    foodElement.className =
        "modal-task";


    foodElement.innerHTML = `

        <span>
            🍽️ תזונה
        </span>

        <span
            class="modal-task-status">

            ${
                foodSuccess
                    ? "✓"
                    : "○"
            }

        </span>

    `;


    modalTasks.appendChild(
        foodElement
    );


    // ----------------------------------------------
    // פרטי קלוריות
    // ----------------------------------------------

    const calorieInfo =
        document.createElement("div");


    calorieInfo.className =
        "modal-detail";


    if (
        calories >
        DAILY_CALORIE_TARGET
    ) {

        calorieInfo.innerHTML = `
            ${calories} / ${DAILY_CALORIE_TARGET} קלוריות
            <span class="modal-warning">
                ⚠️ חריגה של
                ${calories - DAILY_CALORIE_TARGET}
                קלוריות
            </span>
        `;

    } else {

        calorieInfo.innerHTML = `
            ${calories} / ${DAILY_CALORIE_TARGET} קלוריות
        `;

    }


    modalTasks.appendChild(
        calorieInfo
    );


    // ----------------------------------------------
    // פעילות
    // ----------------------------------------------

    const activityElement =
        document.createElement("div");


    activityElement.className =
        "modal-task";


    activityElement.innerHTML = `

        <span>
            🏃 פעילות
        </span>

        <span
            class="modal-task-status">

            ${
                activitySuccess
                    ? "✓"
                    : "○"
            }

        </span>

    `;


    modalTasks.appendChild(
        activityElement
    );


    // ----------------------------------------------
    // פרטי פעילות
    // ----------------------------------------------

    const activityInfo =
        document.createElement("div");


    activityInfo.className =
        "modal-detail";


    activityInfo.textContent =
        `${activityMinutes} / ${DAILY_ACTIVITY_TARGET} דקות`;


    modalTasks.appendChild(
        activityInfo
    );


    // ----------------------------------------------
    // אתגר
    // ----------------------------------------------

    const challengeElement =
        document.createElement("div");


    challengeElement.className =
        "modal-task";


    challengeElement.innerHTML = `

        <span>
            🎯 אתגר
        </span>

        <span
            class="modal-task-status">

            ${
                challengeSuccess
                    ? "✓"
                    : "○"
            }

        </span>

    `;


    modalTasks.appendChild(
        challengeElement
    );


    // ----------------------------------------------
    // הציון
    // ----------------------------------------------

    modalScore.textContent =
        `${score} / 3`;


    // ----------------------------------------------
    // הצגת החלונית
    // ----------------------------------------------

    dayModal.classList.add(
        "show"
    );

}


// ==================================================
// חודש קודם
// ==================================================

prevMonth.addEventListener(
    "click",
    () => {

        displayedDate.setMonth(
            displayedDate.getMonth() - 1
        );


        renderCalendar();

    }
);


// ==================================================
// חודש הבא
// ==================================================

nextMonth.addEventListener(
    "click",
    () => {

        displayedDate.setMonth(
            displayedDate.getMonth() + 1
        );


        renderCalendar();

    }
);


// ==================================================
// סגירת חלונית
// ==================================================

closeModal.addEventListener(
    "click",
    () => {

        dayModal.classList.remove(
            "show"
        );

    }
);


// ==================================================
// סגירה בלחיצה על הרקע
// ==================================================

dayModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            dayModal
        ) {

            dayModal.classList.remove(
                "show"
            );

        }

    }
);


// ==================================================
// סגירה עם ESC
// ==================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            dayModal.classList.remove(
                "show"
            );

        }

    }
);


// ==================================================
// הפעלה ראשונית
// ==================================================

renderCalendar();
