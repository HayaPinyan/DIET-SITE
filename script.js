// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1500;
const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// EMAILJS
// ==================================================

const EMAILJS_SERVICE_ID = "service_8s7fe3a";
const EMAILJS_TEMPLATE_ID = "template_tcts9d9";
const EMAILJS_PUBLIC_KEY = "phMCkJwty8w7XBDoJ";


// אתחול EmailJS
if (typeof emailjs !== "undefined") {

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });

}


// ==================================================
// אלמנטים
// ==================================================

const taskButtons =
    document.querySelectorAll(".task-button");

const todayScore =
    document.getElementById("todayScore");

const todayScoreBottom =
    document.getElementById("todayScoreBottom");

const todayDay =
    document.getElementById("todayDay");

const todayDate =
    document.getElementById("todayDate");

const todayProgressFill =
    document.getElementById("todayProgressFill");

const foodCalories =
    document.getElementById("foodCalories");

const foodCard =
    document.getElementById("foodCard");

const foodProgressFill =
    document.getElementById("foodProgressFill");

const foodProgressPercent =
    document.getElementById("foodProgressPercent");

const activityMinutes =
    document.getElementById("activityMinutes");

const activityProgressFill =
    document.getElementById("activityProgressFill");

const activityProgressPercent =
    document.getElementById("activityProgressPercent");

const finishDayButton =
    document.getElementById("finishDayButton");

const finishDayMessage =
    document.getElementById("finishDayMessage");


// ==================================================
// היום של האתר
// 06:00 -> יום חדש
// לפני 06:00 -> עדיין היום הקודם
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
            parts.find(
                x => x.type === "year"
            ).value
        );


    let month =
        Number(
            parts.find(
                x => x.type === "month"
            ).value
        ) - 1;


    let day =
        Number(
            parts.find(
                x => x.type === "day"
            ).value
        );


    const hour =
        Number(
            parts.find(
                x => x.type === "hour"
            ).value
        );


    if (hour < 6) {

        const previousDay =
            new Date(
                year,
                month,
                day
            );


        previousDay.setDate(
            previousDay.getDate() - 1
        );


        year =
            previousDay.getFullYear();

        month =
            previousDay.getMonth();

        day =
            previousDay.getDate();

    }


    return new Date(
        year,
        month,
        day
    );

}


const today =
    getSiteToday();


// ==================================================
// יצירת מפתח תאריך
// ==================================================

function getDateKeyFromDate(date) {

    return (

        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")

    );

}


const dateKey =
    getDateKeyFromDate(today);


// ==================================================
// נתונים
// ==================================================

const savedData =
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
// נתוני היום
// ==================================================

if (!savedData[dateKey]) {

    savedData[dateKey] = {

        food: false,
        activity: false,
        challenge: false

    };

}


// ==================================================
// שמות ימים וחודשים
// ==================================================

const daysOfWeek = [

    "ראשון",
    "שני",
    "שלישי",
    "רביעי",
    "חמישי",
    "שישי",
    "שבת"

];


const months = [

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
// הצגת תאריך
// ==================================================

if (todayDay) {

    todayDay.textContent =
        `יום ${daysOfWeek[today.getDay()]}`;

}


if (todayDate) {

    todayDate.textContent =
        `${today.getDate()} ב${months[today.getMonth()]}`;

}


// ==================================================
// קלוריות היום
// ==================================================

function getTodayCalories() {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (
            total,
            food
        ) =>
            total +
            Number(
                food.calories || 0
            ),
        0
    );

}


// ==================================================
// פעילות היום
// ==================================================

function getTodayActivityMinutes() {

    const activities =
        activityData[dateKey] || [];


    return activities.reduce(
        (
            total,
            activity
        ) =>
            total +
            Number(
                activity.minutes || 0
            ),
        0
    );

}


// ==================================================
// ציון היום
// ==================================================

function getTodayScore() {

    let score = 0;


    if (
        savedData[dateKey] &&
        savedData[dateKey].food
    ) {

        score++;

    }


    if (
        savedData[dateKey] &&
        savedData[dateKey].activity
    ) {

        score++;

    }


    if (
        savedData[dateKey] &&
        savedData[dateKey].challenge
    ) {

        score++;

    }


    return score;

}


// ==================================================
// האם היום הסתיים
// ==================================================

function isDayFinished() {

    return !!(
        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true
    );

}


// ==================================================
// אנימציית יום מושלם
// ==================================================

function celebratePerfectDay() {

    const todaySection =
        document.querySelector(".today");


    if (!todaySection) {
        return;
    }


    todaySection.classList.remove(
        "perfect-day-animation"
    );


    void todaySection.offsetWidth;


    todaySection.classList.add(
        "perfect-day-animation"
    );

}


// ==================================================
// תזונה
// ==================================================

function updateFoodCalories() {

    const total =
        getTodayCalories();


    if (foodCalories) {

        foodCalories.textContent =
            `${total} / ${DAILY_CALORIE_TARGET}`;

    }


    const percentage =
        Math.min(
            100,
            Math.round(
                (
                    total /
                    DAILY_CALORIE_TARGET
                ) * 100
            )
        );


    if (foodProgressFill) {

        foodProgressFill.style.width =
            `${percentage}%`;

    }


    if (foodProgressPercent) {

        foodProgressPercent.textContent =
            `${percentage}%`;

    }


    if (foodCard) {

        foodCard.classList.toggle(
            "calorie-over",
            total > DAILY_CALORIE_TARGET
        );

    }

}


// ==================================================
// פעילות
// ==================================================

function updateActivityMinutes() {

    const total =
        getTodayActivityMinutes();


    if (activityMinutes) {

        activityMinutes.textContent =
            `${total} / ${DAILY_ACTIVITY_TARGET}`;

    }


    const percentage =
        Math.min(
            100,
            Math.round(
                (
                    total /
                    DAILY_ACTIVITY_TARGET
                ) * 100
            )
        );


    if (activityProgressFill) {

        activityProgressFill.style.width =
            `${percentage}%`;

    }


    if (activityProgressPercent) {

        activityProgressPercent.textContent =
            `${percentage}%`;

    }

}


// ==================================================
// סנכרון פעילות
// ==================================================

function syncActivityTask() {

    const total =
        getTodayActivityMinutes();


    savedData[dateKey].activity =
        total >= DAILY_ACTIVITY_TARGET;


    localStorage.setItem(
        "dietData",
        JSON.stringify(savedData)
    );

}


// ==================================================
// צבע כפתור סיום
// ==================================================

function clearFinishButtonColor() {

    if (!finishDayButton) {
        return;
    }


    finishDayButton.classList.remove(

        "finish-score-0",
        "finish-score-1",
        "finish-score-2",
        "finish-score-3"

    );

}


// ==================================================
// כפתור סיום
// ==================================================

function updateFinishDayButton() {

    if (!finishDayButton) {
        return;
    }


    clearFinishButtonColor();


    finishDayButton.textContent =
        "✓ סיימתי את היום";


    if (!isDayFinished()) {

        if (finishDayMessage) {

            finishDayMessage.textContent =
                "";

        }

        return;

    }


    const score =
        getTodayScore();


    finishDayButton.classList.add(
        `finish-score-${score}`
    );


    if (!finishDayMessage) {
        return;
    }


    if (score === 0) {

        finishDayMessage.textContent =
            "חבל...";

    }
    else if (score === 1) {

        finishDayMessage.textContent =
            "💪 ממשיכים קדימה!";

    }
    else if (score === 2) {

        finishDayMessage.textContent =
            "🌟 כמעט מושלם!";

    }
    else {

        finishDayMessage.textContent =
            "🎉 כל הכבוד! היום הושלם בהצלחה!";

    }

}


// ==================================================
// ציון קודם
// ==================================================

let previousDailyScore =
    getTodayScore();


// ==================================================
// עדכון ציון
// ==================================================

function updateScore() {

    const completed =
        getTodayScore();


    if (todayScore) {

        todayScore.textContent =
            `${completed} / 3`;

    }


    if (todayScoreBottom) {

        todayScoreBottom.textContent =
            `${completed} / 3`;

    }


    if (todayProgressFill) {

        todayProgressFill.style.width =
            `${(completed / 3) * 100}%`;

    }


    if (
        completed === 3 &&
        previousDailyScore < 3
    ) {

        celebratePerfectDay();

    }


    previousDailyScore =
        completed;

}


// ==================================================
// טעינת היום
// ==================================================

function loadToday() {

    syncActivityTask();

    updateFoodCalories();

    updateActivityMinutes();


    taskButtons.forEach(
        button => {

            const taskName =
                button.dataset.task;


            button.classList.toggle(
                "completed",
                !!(
                    savedData[dateKey] &&
                    savedData[dateKey][taskName]
                )
            );

        }
    );


    updateScore();

    updateFinishDayButton();

}


// ==================================================
// אתגר
// ==================================================

taskButtons.forEach(
    button => {

        if (
            button.dataset.task !==
            "challenge"
        ) {

            return;

        }


        button.addEventListener(
            "click",
            () => {

                const isCompleted =
                    button.classList.toggle(
                        "completed"
                    );


                savedData[dateKey].challenge =
                    isCompleted;


                localStorage.setItem(
                    "dietData",
                    JSON.stringify(savedData)
                );


                window.dispatchEvent(
                    new Event("xpDataChanged")
                );


                updateScore();

                updateFinishDayButton();


                if (
                    typeof updateHomeChallenge ===
                    "function"
                ) {

                    updateHomeChallenge();

                }

            }
        );

    }
);


// ==================================================
// עזר - HTML בטוח
// ==================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==================================================
// יצירת רשימת מאכלים למייל
// ==================================================

function createFoodEmailText(
    targetDateKey
) {

    const foods =
        foodData[targetDateKey] || [];


    if (foods.length === 0) {

        return "לא נרשמו מאכלים.";

    }


    return foods.map(
        food => {

            const emoji =
                food.emoji || "🍽️";

            const name =
                escapeHtml(food.name || "מאכל");

            const amount =
                escapeHtml(food.amount || "");

            const calories =
                Number(
                    food.calories || 0
                );


            return (
                `${emoji} ${name}` +
                (amount
                    ? ` | כמות: ${amount}`
                    : "") +
                ` | ${calories} קלוריות`
            );

        }
    ).join("\n");

}


// ==================================================
// יצירת רשימת פעילות למייל
// ==================================================

function createActivityEmailText(
    targetDateKey
) {

    const activities =
        activityData[targetDateKey] || [];


    if (activities.length === 0) {

        return "לא נרשמה פעילות.";

    }


    return activities.map(
        activity => {

            const emoji =
                activity.emoji || "🏃";

            const name =
                escapeHtml(
                    activity.name || "פעילות"
                );

            const minutes =
                Number(
                    activity.minutes || 0
                );


            return (
                `${emoji} ${name}` +
                ` | ${minutes} דקות`
            );

        }
    ).join("\n");

}


// ==================================================
// שליחת מייל יומי
// ==================================================

async function sendDailyEmail() {

    if (
        typeof emailjs ===
        "undefined"
    ) {

        console.error(
            "EmailJS לא נטען."
        );

        return false;

    }


    const calories =
        getTodayCalories();


    const minutes =
        getTodayActivityMinutes();


    const score =
        getTodayScore();


    const challengeCompleted =
        !!(
            savedData[dateKey] &&
            savedData[dateKey].challenge
        );


    const foodsText =
        createFoodEmailText(
            dateKey
        );


    const activitiesText =
        createActivityEmailText(
            dateKey
        );


    const caloriesStatus =
        calories <=
        DAILY_CALORIE_TARGET
            ? "✓ עמדתי ביעד"
            : `⚠️ חריגה של ${
                calories -
                DAILY_CALORIE_TARGET
            } קלוריות`;


    const activityStatus =
        minutes >=
        DAILY_ACTIVITY_TARGET
            ? "✓ עמדתי ביעד"
            : `נותרו ${
                DAILY_ACTIVITY_TARGET -
                minutes
            } דקות`;


    const challengeStatus =
        challengeCompleted
            ? "✓ הושלם"
            : "○ לא הושלם";


    const templateParams = {

        report_type:
            "סיכום יומי",

        report_title:
            "🌸 סיכום היום שלי",

        report_date:
            `${today.getDate()} ב${months[today.getMonth()]} ${today.getFullYear()}`,

        day_name:
            `יום ${daysOfWeek[today.getDay()]}`,

        calories:
            calories,

        calorie_target:
            DAILY_CALORIE_TARGET,

        calories_status:
            caloriesStatus,

        foods:
            foodsText,

        activity_minutes:
            minutes,

        activity_target:
            DAILY_ACTIVITY_TARGET,

        activity_status:
            activityStatus,

        activities:
            activitiesText,

        challenge:
            challengeStatus,

        challenge_completed:
            challengeCompleted
                ? "כן"
                : "לא",

        score:
            `${score} / 3`

    };


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );


        console.log(
            "המייל היומי נשלח בהצלחה"
        );


        return true;

    }
    catch (error) {

        console.error(
            "שגיאה בשליחת המייל:",
            error
        );


        return false;

    }

}


// ==================================================
// קבלת רשימת תאריכים בטווח
// ==================================================

function getDatesBetween(
    startDate,
    endDate
) {

    const dates = [];

    const current =
        new Date(startDate);


    while (
        current <= endDate
    ) {

        dates.push(
            getDateKeyFromDate(
                current
            )
        );


        current.setDate(
            current.getDate() + 1
        );

    }


    return dates;

}


// ==================================================
// סיכום נתונים לטווח
// ==================================================

function createPeriodSummary(
    startDate,
    endDate
) {

    const dateKeys =
        getDatesBetween(
            startDate,
            endDate
        );


    let totalCalories = 0;
    let totalActivity = 0;

    let successfulFoodDays = 0;
    let successfulActivityDays = 0;
    let successfulChallengeDays = 0;


    const foodLines = [];
    const activityLines = [];
    const challengeLines = [];


    dateKeys.forEach(
        key => {

            const foods =
                foodData[key] || [];


            const activities =
                activityData[key] || [];


            const dayCalories =
                foods.reduce(
                    (
                        total,
                        food
                    ) =>
                        total +
                        Number(
                            food.calories || 0
                        ),
                    0
                );


            const dayActivity =
                activities.reduce(
                    (
                        total,
                        activity
                    ) =>
                        total +
                        Number(
                            activity.minutes || 0
                        ),
                    0
                );


            const challengeCompleted =
                !!(
                    savedData[key] &&
                    savedData[key].challenge
                );


            totalCalories +=
                dayCalories;


            totalActivity +=
                dayActivity;


            const dayFoodSuccess =
                !!(
                    finishDayData[key] &&
                    finishDayData[key].finished === true &&
                    dayCalories <=
                    DAILY_CALORIE_TARGET
                );


            const dayActivitySuccess =
                dayActivity >=
                DAILY_ACTIVITY_TARGET;


            if (dayFoodSuccess) {

                successfulFoodDays++;

            }


            if (dayActivitySuccess) {

                successfulActivityDays++;

            }


            if (challengeCompleted) {

                successfulChallengeDays++;

            }


            if (
                foods.length > 0
            ) {

                foods.forEach(
                    food => {

                        foodLines.push(
                            `${key} | ${
                                food.emoji || "🍽️"
                            } ${
                                food.name || "מאכל"
                            } | ${
                                food.amount || ""
                            } | ${
                                Number(
                                    food.calories || 0
                                )
                            } קלוריות`
                        );

                    }
                );

            }


            if (
                activities.length > 0
            ) {

                activities.forEach(
                    activity => {

                        activityLines.push(
                            `${key} | ${
                                activity.emoji || "🏃"
                            } ${
                                activity.name || "פעילות"
                            } | ${
                                Number(
                                    activity.minutes || 0
                                )
                            } דקות`
                        );

                    }
                );

            }


            challengeLines.push(
                `${key} | ${
                    challengeCompleted
                        ? "✓ הושלם"
                        : "○ לא הושלם"
                }`
            );

        }
    );


    return {

        totalDays:
            dateKeys.length,

        totalCalories,

        totalActivity,

        successfulFoodDays,

        successfulActivityDays,

        successfulChallengeDays,

        foodLines:
            foodLines.length > 0
                ? foodLines.join("\n")
                : "לא נרשמו מאכלים.",

        activityLines:
            activityLines.length > 0
                ? activityLines.join("\n")
                : "לא נרשמה פעילות.",

        challengeLines:
            challengeLines.join("\n")

    };

}


// ==================================================
// האם היום שבת?
// ==================================================

function isSaturday() {

    return today.getDay() === 6;

}


// ==================================================
// האם היום האחרון בחודש?
// ==================================================

function isLastDayOfMonth() {

    const tomorrow =
        new Date(today);


    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    return (
        tomorrow.getMonth() !==
        today.getMonth()
    );

}


// ==================================================
// האם היום האחרון בשנה?
// ==================================================

function isLastDayOfYear() {

    return (
        today.getMonth() === 11 &&
        today.getDate() === 31
    );

}


// ==================================================
// תאריך תחילת שבוע
// ראשון עד שבת
// ==================================================

function getStartOfWeek(
    date
) {

    const result =
        new Date(date);


    result.setDate(
        result.getDate() -
        result.getDay()
    );


    return result;

}


// ==================================================
// שליחת סיכום תקופתי
// ==================================================

async function sendPeriodEmail(
    type,
    startDate,
    endDate
) {

    if (
        typeof emailjs ===
        "undefined"
    ) {

        console.error(
            "EmailJS לא נטען."
        );

        return false;

    }


    const summary =
        createPeriodSummary(
            startDate,
            endDate
        );


    let title = "";


    if (type === "שבועי") {

        title =
            "📅 סיכום שבועי";

    }
    else if (type === "חודשי") {

        title =
            "🗓️ סיכום חודשי";

    }
    else {

        title =
            "🏆 סיכום שנתי";

    }


    const templateParams = {

        report_type:
            `סיכום ${type}`,

        report_title:
            title,

        report_date:
            `${getDateKeyFromDate(startDate)} עד ${getDateKeyFromDate(endDate)}`,

        day_name:
            "",

        calories:
            summary.totalCalories,

        calorie_target:
            DAILY_CALORIE_TARGET,

        calories_status:
            "",

        foods:
            summary.foodLines,

        activity_minutes:
            summary.totalActivity,

        activity_target:
            DAILY_ACTIVITY_TARGET,

        activity_status:
            "",

        activities:
            summary.activityLines,

        challenge:
            "",

        challenge_completed:
            `${summary.successfulChallengeDays} ימים`,

        score:
            "",

        total_days:
            summary.totalDays,

        successful_food_days:
            summary.successfulFoodDays,

        successful_activity_days:
            summary.successfulActivityDays,

        successful_challenge_days:
            summary.successfulChallengeDays

    };


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );


        console.log(
            `המייל ה${type} נשלח בהצלחה`
        );


        return true;

    }
    catch (error) {

        console.error(
            `שגיאה בשליחת המייל ה${type}:`,
            error
        );


        return false;

    }

}


// ==================================================
// שליחת מיילים בסיום היום
// ==================================================

async function sendRelevantEmails() {

    // ------------------------------------------------
    // מייל יומי
    // ------------------------------------------------

    await sendDailyEmail();


    // ------------------------------------------------
    // מייל שבועי בסוף שבת
    // ------------------------------------------------

    if (isSaturday()) {

        const weekStart =
            getStartOfWeek(
                today
            );


        const weekEnd =
            new Date(today);


        await sendPeriodEmail(
            "שבועי",
            weekStart,
            weekEnd
        );

    }


    // ------------------------------------------------
    // מייל חודשי
    // ------------------------------------------------

    if (
        isLastDayOfMonth()
    ) {

        const monthStart =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        const monthEnd =
            new Date(today);


        await sendPeriodEmail(
            "חודשי",
            monthStart,
            monthEnd
        );

    }


    // ------------------------------------------------
    // מייל שנתי
    // ------------------------------------------------

    if (
        isLastDayOfYear()
    ) {

        const yearStart =
            new Date(
                today.getFullYear(),
                0,
                1
            );


        const yearEnd =
            new Date(today);


        await sendPeriodEmail(
            "שנתי",
            yearStart,
            yearEnd
        );

    }

}


// ==================================================
// מניעת שליחה כפולה
// ==================================================

function getEmailSentKey(
    type
) {

    return (
        "emailSent_" +
        type +
        "_" +
        dateKey
    );

}


function wasEmailSent(
    type
) {

    return (
        localStorage.getItem(
            getEmailSentKey(type)
        ) === "true"
    );

}


function markEmailSent(
    type
) {

    localStorage.setItem(
        getEmailSentKey(type),
        "true"
    );

}


// ==================================================
// שליחת המיילים בצורה בטוחה
// ==================================================

async function sendEmailsOnce() {

    // ----------------------------------------------
    // מייל יומי
    // ----------------------------------------------

    if (
        !wasEmailSent("daily")
    ) {

        const success =
            await sendDailyEmail();


        if (success) {

            markEmailSent(
                "daily"
            );

        }

    }


    // ----------------------------------------------
    // מייל שבועי
    // ----------------------------------------------

    if (
        isSaturday() &&
        !wasEmailSent("weekly")
    ) {

        const weekStart =
            getStartOfWeek(
                today
            );


        const success =
            await sendPeriodEmail(
                "שבועי",
                weekStart,
                today
            );


        if (success) {

            markEmailSent(
                "weekly"
            );

        }

    }


    // ----------------------------------------------
    // מייל חודשי
    // ----------------------------------------------

    if (
        isLastDayOfMonth() &&
        !wasEmailSent("monthly")
    ) {

        const monthStart =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        const success =
            await sendPeriodEmail(
                "חודשי",
                monthStart,
                today
            );


        if (success) {

            markEmailSent(
                "monthly"
            );

        }

    }


    // ----------------------------------------------
    // מייל שנתי
    // ----------------------------------------------

    if (
        isLastDayOfYear() &&
        !wasEmailSent("yearly")
    ) {

        const yearStart =
            new Date(
                today.getFullYear(),
                0,
                1
            );


        const success =
            await sendPeriodEmail(
                "שנתי",
                yearStart,
                today
            );


        if (success) {

            markEmailSent(
                "yearly"
            );

        }

    }

}


// ==================================================
// כפתור סיום היום
// ==================================================

if (finishDayButton) {

    finishDayButton.addEventListener(
        "click",
        async () => {

            // ----------------------------------------
            // אם היום כבר הסתיים — ביטול הסיום
            // ----------------------------------------

            if (isDayFinished()) {

                savedData[dateKey].food =
                    finishDayData[
                        dateKey
                    ].previousFood;


                finishDayData[
                    dateKey
                ].finished =
                    false;


                localStorage.setItem(
                    "dietData",
                    JSON.stringify(savedData)
                );


                localStorage.setItem(
                    "finishDayData",
                    JSON.stringify(
                        finishDayData
                    )
                );


                window.dispatchEvent(
                    new Event(
                        "xpDataChanged"
                    )
                );


                loadToday();

                return;

            }


            // ----------------------------------------
            // שמירת המצב הקודם
            // ----------------------------------------

            const previousFood =
                savedData[dateKey].food;


            // ----------------------------------------
            // קלוריות
            // ----------------------------------------

            const calories =
                getTodayCalories();


            // ----------------------------------------
            // שמירת סיום היום
            // ----------------------------------------

            finishDayData[dateKey] = {

                finished: true,

                previousFood:
                    previousFood

            };


            savedData[dateKey].food =
                calories <=
                DAILY_CALORIE_TARGET;


            localStorage.setItem(
                "dietData",
                JSON.stringify(savedData)
            );


            localStorage.setItem(
                "finishDayData",
                JSON.stringify(
                    finishDayData
                )
            );


            window.dispatchEvent(
                new Event(
                    "xpDataChanged"
                )
            );


            loadToday();


            // ----------------------------------------
            // שליחת מיילים
            // ----------------------------------------

            if (finishDayMessage) {

                finishDayMessage.textContent =
                    "📧 שולחת את סיכום היום...";

            }


            await sendEmailsOnce();


            // ----------------------------------------
            // הודעה למשתמשת
            // ----------------------------------------

            if (finishDayMessage) {

                if (
                    isLastDayOfYear()
                ) {

                    finishDayMessage.textContent =
                        "🎉 היום הסתיים! נשלחו הסיכומים היומי, השבועי, החודשי והשנתי.";

                }
                else if (
                    isLastDayOfMonth()
                ) {

                    finishDayMessage.textContent =
                        "🌸 היום הסתיים! נשלחו הסיכומים היומי, השבועי והחודשי.";

                }
                else if (
                    isSaturday()
                ) {

                    finishDayMessage.textContent =
                        "🌸 היום הסתיים! נשלחו הסיכום היומי והשבועי.";

                }
                else {

                    finishDayMessage.textContent =
                        "📧 היום הסתיים והסיכום נשלח במייל.";

                }

            }

        }
    );

}


// ==================================================
// ברכה
// ==================================================

const greeting =
    document.getElementById(
        "greeting"
    );


const timeMessage =
    document.getElementById(
        "timeMessage"
    );


const israelHour =
    Number(
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: "Asia/Jerusalem",
                hour: "numeric",
                hour12: false
            }
        ).format(new Date())
    );


if (
    greeting &&
    timeMessage
) {

    if (
        israelHour >= 6 &&
        israelHour < 12
    ) {

        greeting.textContent =
            "בוקר טוב! 🌷";

        timeMessage.textContent =
            "יום חדש, הזדמנות חדשה להתקדם 🌸";

    }
    else if (
        israelHour >= 12 &&
        israelHour < 17
    ) {

        greeting.textContent =
            "צהריים טובים! ☀️";

        timeMessage.textContent =
            "גם היום אפשר לבחור לעשות משהו טוב בשביל עצמך 💛";

    }
    else if (
        israelHour >= 17 &&
        israelHour < 21
    ) {

        greeting.textContent =
            "ערב טוב! 🌙";

        timeMessage.textContent =
            "עוד יום עבר — בואי נראה כמה התקדמת היום ✨";

    }
    else {

        greeting.textContent =
            "לילה טוב! 🌙";

        timeMessage.textContent =
            "היום באתר עדיין נמשך עד 06:00 🌙";

    }

}


// ==================================================
// האתגר השבועי בדף הבית
// ==================================================

const homeChallengeName =
    document.getElementById(
        "homeChallengeName"
    );


const homeChallengeDescription =
    document.getElementById(
        "homeChallengeDescription"
    );


const homeChallengeIcon =
    document.getElementById(
        "homeChallengeIcon"
    );


const homeWeekNumber =
    document.getElementById(
        "homeWeekNumber"
    );


const homeChallengeProgress =
    document.getElementById(
        "homeChallengeProgress"
    );


const homeChallengeScore =
    document.getElementById(
        "homeChallengeScore"
    );


const homeChallengeDays =
    document.getElementById(
        "homeChallengeDays"
    );


function updateHomeChallenge() {

    if (
        !homeChallengeName ||
        typeof currentChallenge ===
        "undefined"
    ) {

        return;

    }


    homeChallengeName.textContent =
        currentChallenge.name;


    homeChallengeDescription.textContent =
        currentChallenge.description;


    homeChallengeIcon.textContent =
        currentChallenge.icon;


    homeWeekNumber.textContent =
        `שבוע ${currentWeek}`;


    const weekStart =
        new Date(startDate);


    weekStart.setDate(
        weekStart.getDate() -
        weekStart.getDay()
    );


    weekStart.setDate(
        weekStart.getDate() +
        (currentWeek - 1) * 7
    );


    const dayNames = [

        "א׳",
        "ב׳",
        "ג׳",
        "ד׳",
        "ה׳",
        "ו׳",
        "ש׳"

    ];


    homeChallengeDays.innerHTML =
        "";


    let completed = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(weekStart);


        date.setDate(
            weekStart.getDate() + i
        );


        const challengeDateKey =
            getDateKeyFromDate(
                date
            );


        const day =
            document.createElement(
                "span"
            );


        day.className =
            "day";


        day.textContent =
            dayNames[i];


        if (
            savedData[
                challengeDateKey
            ] &&
            savedData[
                challengeDateKey
            ].challenge
        ) {

            day.classList.add(
                "success"
            );

            completed++;

        }


        const isFuture =
            date > today;


        if (!isFuture) {

            day.style.cursor =
                "pointer";


            day.addEventListener(
                "click",
                () => {

                    if (
                        !savedData[
                            challengeDateKey
                        ]
                    ) {

                        savedData[
                            challengeDateKey
                        ] = {

                            food: false,
                            activity: false,
                            challenge: false

                        };

                    }


                    savedData[
                        challengeDateKey
                    ].challenge =
                        !savedData[
                            challengeDateKey
                        ].challenge;


                    localStorage.setItem(
                        "dietData",
                        JSON.stringify(
                            savedData
                        )
                    );


                    window.dispatchEvent(
                        new Event(
                            "xpDataChanged"
                        )
                    );


                    updateHomeChallenge();


                    if (
                        challengeDateKey ===
                        dateKey
                    ) {

                        loadToday();

                    }

                }
            );

        }
        else {

            day.style.opacity =
                "0.5";

            day.style.cursor =
                "default";

        }


        homeChallengeDays.appendChild(
            day
        );

    }


    homeChallengeScore.textContent =
        `${completed} מתוך 7 ימים`;


    homeChallengeProgress.style.width =
        `${(completed / 7) * 100}%`;

}


// ==================================================
// טיימר
// ==================================================

const countdownDays =
    document.getElementById(
        "countdownDays"
    );


const countdownHours =
    document.getElementById(
        "countdownHours"
    );


const countdownMinutes =
    document.getElementById(
        "countdownMinutes"
    );


const countdownSeconds =
    document.getElementById(
        "countdownSeconds"
    );


const countdownTarget =
    new Date(
        "2029-08-16T00:00:00+03:00"
    );


function updateCountdown() {

    const difference =
        countdownTarget -
        new Date();


    if (
        difference <= 0
    ) {

        if (countdownDays)
            countdownDays.textContent =
                "0";


        if (countdownHours)
            countdownHours.textContent =
                "00";


        if (countdownMinutes)
            countdownMinutes.textContent =
                "00";


        if (countdownSeconds)
            countdownSeconds.textContent =
                "00";


        return;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds /
            86400
        );


    const hours =
        Math.floor(
            (
                totalSeconds % 86400
            ) / 3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );


    const seconds =
        totalSeconds % 60;


    if (countdownDays)
        countdownDays.textContent =
            days;


    if (countdownHours)
        countdownHours.textContent =
            String(hours)
                .padStart(2, "0");


    if (countdownMinutes)
        countdownMinutes.textContent =
            String(minutes)
                .padStart(2, "0");


    if (countdownSeconds)
        countdownSeconds.textContent =
            String(seconds)
                .padStart(2, "0");

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


// ==================================================
// שמירה והפעלה
// ==================================================

localStorage.setItem(
    "dietData",
    JSON.stringify(savedData)
);


loadToday();


updateHomeChallenge();
