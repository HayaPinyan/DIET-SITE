// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1500;
const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// אלמנטים
// ==================================================

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const dayModal = document.getElementById("dayModal");
const closeModal = document.getElementById("closeModal");
const modalDate = document.getElementById("modalDate");
const modalTasks = document.getElementById("modalTasks");
const modalScore = document.getElementById("modalScore");


// ==================================================
// נתונים
// ==================================================

const dietData =
    JSON.parse(localStorage.getItem("dietData")) || {};

const foodData =
    JSON.parse(localStorage.getItem("foodData")) || {};

const activityData =
    JSON.parse(localStorage.getItem("activityData")) || {};

const finishDayData =
    JSON.parse(localStorage.getItem("finishDayData")) || {};


// ==================================================
// החודש שמוצג
// ==================================================

let displayedDate = new Date();


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
// יצירת מפתח תאריך
// ==================================================

function getDateKey(year, month, day) {

    return (
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


// ==================================================
// היום של האתר
// 06:00 = תחילת יום חדש
// ==================================================

function getSiteToday() {

    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Jerusalem",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                hour12: false
            }
        ).formatToParts(new Date());


    let year =
        Number(
            parts.find(x => x.type === "year").value
        );

    let month =
        Number(
            parts.find(x => x.type === "month").value
        ) - 1;

    let day =
        Number(
            parts.find(x => x.type === "day").value
        );

    const hour =
        Number(
            parts.find(x => x.type === "hour").value
        );


    if (hour < 6) {

        const previousDay =
            new Date(year, month, day);

        previousDay.setDate(
            previousDay.getDate() - 1
        );

        year = previousDay.getFullYear();
        month = previousDay.getMonth();
        day = previousDay.getDate();
    }


    return new Date(year, month, day);

}


// ==================================================
// קלוריות
// ==================================================

function getCalories(dateKey) {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (total, food) =>
            total +
            Number(food.calories || 0),
        0
    );

}


// ==================================================
// דקות פעילות
// ==================================================

function getActivityMinutes(dateKey) {

    const activities =
        activityData[dateKey] || [];


    return activities.reduce(
        (total, activity) =>
            total +
            Number(activity.minutes || 0),
        0
    );

}


// ==================================================
// הצלחת תזונה
// ==================================================

function isFoodSuccess(dateKey) {

    if (
        !finishDayData[dateKey] ||
        finishDayData[dateKey].finished !== true
    ) {
        return false;
    }


    return (
        getCalories(dateKey) <=
        DAILY_CALORIE_TARGET
    );

}


// ==================================================
// הצלחת פעילות
// ==================================================

function isActivitySuccess(dateKey) {

    return (
        getActivityMinutes(dateKey) >=
        DAILY_ACTIVITY_TARGET
    );

}


// ==================================================
// הצלחת אתגר
// ==================================================

function isChallengeSuccess(dateKey) {

    return !!(
        dietData[dateKey] &&
        dietData[dateKey].challenge
    );

}


// ==================================================
// ציון
// ==================================================

function getScore(dateKey) {

    let score = 0;


    if (isFoodSuccess(dateKey)) {
        score++;
    }


    if (isActivitySuccess(dateKey)) {
        score++;
    }


    if (isChallengeSuccess(dateKey)) {
        score++;
    }


    return score;

}


// ==================================================
// יצירת שורת כותרת לתזונה
// ==================================================

function createFoodDetails(dateKey) {

    const foods =
        foodData[dateKey] || [];

    const totalCalories =
        getCalories(dateKey);


    // --------------------------------------------------
    // עטיפה
    // --------------------------------------------------

    const container =
        document.createElement("div");

    container.className =
        "modal-expand-container";


    // --------------------------------------------------
    // שורת הכותרת
    // --------------------------------------------------

    const header =
        document.createElement("div");

    header.className =
        "modal-task";


    header.innerHTML = `

        <span class="modal-expand-title">
            🍽️ תזונה
        </span>

        <span class="modal-task-status">
            ${
                isFoodSuccess(dateKey)
                    ? "✓"
                    : "○"
            }
        </span>

        <span
            class="modal-expand-arrow"
            role="button"
            tabindex="0"
            aria-label="פתח פירוט תזונה"
            aria-expanded="false">

            ▾

        </span>

    `;


    // --------------------------------------------------
    // פירוט
    // --------------------------------------------------

    const details =
        document.createElement("div");

    details.className =
        "modal-expandable-details";


    details.style.display =
        "none";


    // --------------------------------------------------
    // אין מאכלים
    // --------------------------------------------------

    if (foods.length === 0) {

        details.innerHTML = `

            <div class="modal-empty-detail">

                לא נאכלו מאכלים ביום הזה 🌸

            </div>

        `;

    }

    // --------------------------------------------------
    // יש מאכלים
    // --------------------------------------------------

    else {

        foods.forEach(food => {

            const row =
                document.createElement("div");

            row.className =
                "modal-food-row";


            row.innerHTML = `

                <div class="modal-food-name">

                    <span>
                        ${food.emoji || "🍽️"}
                    </span>

                    <span>
                        ${escapeHtml(food.name)}
                    </span>

                </div>


                <div class="modal-food-amount">

                    ${escapeHtml(food.amount || "")}

                </div>


                <div class="modal-food-calories">

                    ${Number(food.calories || 0)}
                    קלוריות

                </div>

            `;


            details.appendChild(row);

        });


        const total =
            document.createElement("div");

        total.className =
            "modal-food-total";


        total.innerHTML = `

            <strong>
                סה״כ: ${totalCalories} קלוריות
            </strong>

        `;


        details.appendChild(total);

    }


    // --------------------------------------------------
    // חץ
    // --------------------------------------------------

    const arrow =
        header.querySelector(
            ".modal-expand-arrow"
        );


    function toggleDetails() {

        const isOpen =
            details.style.display !== "none";


        if (isOpen) {

            details.style.display =
                "none";

            arrow.textContent =
                "▾";

            arrow.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        else {

            details.style.display =
                "block";

            arrow.textContent =
                "▴";

            arrow.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    arrow.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            toggleDetails();

        }
    );


    arrow.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleDetails();

            }

        }
    );


    container.appendChild(header);
    container.appendChild(details);


    return container;

}


// ==================================================
// יצירת שורת פעילות
// ==================================================

function createActivityDetails(dateKey) {

    const activities =
        activityData[dateKey] || [];

    const totalMinutes =
        getActivityMinutes(dateKey);


    // --------------------------------------------------
    // עטיפה
    // --------------------------------------------------

    const container =
        document.createElement("div");

    container.className =
        "modal-expand-container";


    // --------------------------------------------------
    // שורת הכותרת
    // --------------------------------------------------

    const header =
        document.createElement("div");

    header.className =
        "modal-task";


    header.innerHTML = `

        <span class="modal-expand-title">
            🏃 פעילות
        </span>

        <span class="modal-task-status">
            ${
                isActivitySuccess(dateKey)
                    ? "✓"
                    : "○"
            }
        </span>

        <span
            class="modal-expand-arrow"
            role="button"
            tabindex="0"
            aria-label="פתח פירוט פעילות"
            aria-expanded="false">

            ▾

        </span>

    `;


    // --------------------------------------------------
    // פירוט
    // --------------------------------------------------

    const details =
        document.createElement("div");

    details.className =
        "modal-expandable-details";


    details.style.display =
        "none";


    // --------------------------------------------------
    // אין פעילות
    // --------------------------------------------------

    if (activities.length === 0) {

        details.innerHTML = `

            <div class="modal-empty-detail">

                לא נרשמה פעילות ביום הזה 🌸

            </div>

        `;

    }

    // --------------------------------------------------
    // יש פעילות
    // --------------------------------------------------

    else {

        activities.forEach(activity => {

            const row =
                document.createElement("div");

            row.className =
                "modal-activity-row";


            row.innerHTML = `

                <div class="modal-activity-name">

                    <span>
                        ${activity.emoji || "🏃"}
                    </span>

                    <span>
                        ${escapeHtml(activity.name)}
                    </span>

                </div>


                <div class="modal-activity-minutes">

                    ${Number(activity.minutes || 0)}
                    דקות

                </div>

            `;


            details.appendChild(row);

        });


        const total =
            document.createElement("div");

        total.className =
            "modal-activity-total";


        total.innerHTML = `

            <strong>
                סה״כ: ${totalMinutes} דקות
            </strong>

        `;


        details.appendChild(total);

    }


    // --------------------------------------------------
    // חץ
    // --------------------------------------------------

    const arrow =
        header.querySelector(
            ".modal-expand-arrow"
        );


    function toggleDetails() {

        const isOpen =
            details.style.display !== "none";


        if (isOpen) {

            details.style.display =
                "none";

            arrow.textContent =
                "▾";

            arrow.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        else {

            details.style.display =
                "block";

            arrow.textContent =
                "▴";

            arrow.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    arrow.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            toggleDetails();

        }
    );


    arrow.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleDetails();

            }

        }
    );


    container.appendChild(header);
    container.appendChild(details);


    return container;

}


// ==================================================
// יצירת לוח השנה
// ==================================================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        displayedDate.getFullYear();

    const month =
        displayedDate.getMonth();


    monthTitle.textContent =
        `${monthNames[month]} ${year}`;


    const firstDay =
        new Date(year, month, 1);


    const lastDay =
        new Date(year, month + 1, 0);


    const startingDay =
        firstDay.getDay();


    // --------------------------------------------------
    // תאים ריקים
    // --------------------------------------------------

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );

        calendar.appendChild(emptyDay);

    }


    // --------------------------------------------------
    // היום
    // --------------------------------------------------

    const today =
        getSiteToday();


    // --------------------------------------------------
    // ימים
    // --------------------------------------------------

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
            document.createElement("div");


        dayElement.classList.add(
            "calendar-day",
            `score-${score}`
        );


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add("today");

        }


        dayElement.innerHTML = `

            <span class="date-number">
                ${day}
            </span>

            <span class="score">
                ${score}/3
            </span>

        `;


        dayElement.addEventListener(
            "click",
            function() {

                openDayModal(
                    dateKey,
                    day
                );

            }
        );


        calendar.appendChild(dayElement);

    }

}


// ==================================================
// פתיחת חלונית יום
// ==================================================

function openDayModal(dateKey, day) {

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


    const challengeSuccess =
        isChallengeSuccess(dateKey);


    const score =
        getScore(dateKey);


    modalTasks.innerHTML = "";


    // ==================================================
    // תזונה
    // ==================================================

    const foodWrapper =
        document.createElement("div");

    foodWrapper.className =
        "modal-task-wrapper";


    const foodExpand =
        createFoodDetails(dateKey);


    const foodCalories =
        document.createElement("div");

    foodCalories.className =
        "modal-detail";


    if (
        calories >
        DAILY_CALORIE_TARGET
    ) {

        foodCalories.innerHTML = `

            ${calories} /
            ${DAILY_CALORIE_TARGET}
            קלוריות

            <span class="modal-warning">

                ⚠️ חריגה של
                ${calories - DAILY_CALORIE_TARGET}
                קלוריות

            </span>

        `;

    }

    else {

        foodCalories.textContent =
            `${calories} / ${DAILY_CALORIE_TARGET} קלוריות`;

    }


    foodWrapper.appendChild(
        foodExpand
    );

    foodWrapper.appendChild(
        foodCalories
    );


    modalTasks.appendChild(
        foodWrapper
    );


    // ==================================================
    // פעילות
    // ==================================================

    const activityWrapper =
        document.createElement("div");

    activityWrapper.className =
        "modal-task-wrapper";


    const activityExpand =
        createActivityDetails(dateKey);


    const activityInfo =
        document.createElement("div");

    activityInfo.className =
        "modal-detail";


    activityInfo.textContent =
        `${activityMinutes} / ${DAILY_ACTIVITY_TARGET} דקות`;


    activityWrapper.appendChild(
        activityExpand
    );

    activityWrapper.appendChild(
        activityInfo
    );


    modalTasks.appendChild(
        activityWrapper
    );


    // ==================================================
    // אתגר
    // ==================================================

    const challengeElement =
        document.createElement("div");

    challengeElement.className =
        "modal-task";


    challengeElement.innerHTML = `

        <span>
            🎯 אתגר
        </span>

        <span class="modal-task-status">

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


    // ==================================================
    // ציון
    // ==================================================

    modalScore.textContent =
        `${score} / 3`;


    // ==================================================
    // הצגה
    // ==================================================

    dayModal.classList.add("show");

}


// ==================================================
// חודש קודם
// ==================================================

prevMonth.addEventListener(
    "click",
    function() {

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
    function() {

        displayedDate.setMonth(
            displayedDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// ==================================================
// סגירת החלונית
// ==================================================

closeModal.addEventListener(
    "click",
    function() {

        dayModal.classList.remove("show");

    }
);


// ==================================================
// סגירה בלחיצה על הרקע
// ==================================================

dayModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === dayModal
        ) {

            dayModal.classList.remove("show");

        }

    }
);


// ==================================================
// ESC
// ==================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            dayModal.classList.remove("show");

        }

    }
);


// ==================================================
// אבטחת טקסט
// ==================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==================================================
// הפעלה
// ==================================================

renderCalendar();