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
// 06:00 = יום חדש
// לפני 06:00 = עדיין היום הקודם
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
// מפתח תאריך
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
// נתוני שליחת מיילים
// ==================================================

const emailSentData =
    JSON.parse(
        localStorage.getItem("emailSentData")
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
// קלוריות
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
// פעילות
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
// ציון
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
// פונקציות עזר למיילים
// ==================================================

function escapeEmailHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==================================================
// יצירת רשימת מאכלים למייל
// ==================================================

function createFoodEmailHtml(date) {

    const key =
        getDateKeyFromDate(date);

    const foods =
        foodData[key] || [];


    const totalCalories =
        foods.reduce(
            (total, food) =>
                total +
                Number(food.calories || 0),
            0
        );


    if (foods.length === 0) {

        return `
            <div style="
                padding:15px;
                border-radius:12px;
                background:#fff8fb;
                color:#777;
                text-align:center;
                margin-top:10px;
            ">
                לא נרשמו מאכלים ביום הזה 🌸
            </div>
        `;

    }


    let html = "";


    foods.forEach(
        food => {

            html += `
                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                    padding:12px 10px;
                    border-bottom:1px solid #eee;
                    direction:rtl;
                ">

                    <div style="flex:1;">
                        <strong>
                            ${escapeEmailHtml(
                                food.emoji || "🍽️"
                            )}
                            ${escapeEmailHtml(
                                food.name || "מאכל"
                            )}
                        </strong>
                    </div>

                    <div style="
                        color:#777;
                        font-size:14px;
                    ">
                        ${escapeEmailHtml(
                            food.amount || ""
                        )}
                    </div>

                    <div style="
                        font-weight:bold;
                        white-space:nowrap;
                    ">
                        ${Number(
                            food.calories || 0
                        )} קל׳
                    </div>

                </div>
            `;

        }
    );


    html += `
        <div style="
            padding:15px 10px;
            text-align:right;
            font-size:17px;
            font-weight:bold;
        ">
            סה״כ: ${totalCalories} קלוריות
        </div>
    `;


    return html;

}


// ==================================================
// יצירת רשימת פעילות למייל
// ==================================================

function createActivityEmailHtml(date) {

    const key =
        getDateKeyFromDate(date);

    const activities =
        activityData[key] || [];


    const totalMinutes =
        activities.reduce(
            (total, activity) =>
                total +
                Number(activity.minutes || 0),
            0
        );


    if (activities.length === 0) {

        return `
            <div style="
                padding:15px;
                border-radius:12px;
                background:#f8fbff;
                color:#777;
                text-align:center;
                margin-top:10px;
            ">
                לא נרשמה פעילות ביום הזה 🌸
            </div>
        `;

    }


    let html = "";


    activities.forEach(
        activity => {

            html += `
                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                    padding:12px 10px;
                    border-bottom:1px solid #eee;
                    direction:rtl;
                ">

                    <div style="flex:1;">
                        <strong>
                            ${escapeEmailHtml(
                                activity.emoji || "🏃"
                            )}
                            ${escapeEmailHtml(
                                activity.name || "פעילות"
                            )}
                        </strong>
                    </div>

                    <div style="
                        font-weight:bold;
                        white-space:nowrap;
                    ">
                        ${Number(
                            activity.minutes || 0
                        )} דקות
                    </div>

                </div>
            `;

        }
    );


    html += `
        <div style="
            padding:15px 10px;
            text-align:right;
            font-size:17px;
            font-weight:bold;
        ">
            סה״כ: ${totalMinutes} דקות פעילות
        </div>
    `;


    return html;

}


// ==================================================
// מידע על האתגר
// ==================================================

function getChallengeEmailHtml(date) {

    const key =
        getDateKeyFromDate(date);


    const completed =
        !!(
            savedData[key] &&
            savedData[key].challenge
        );


    let challengeName =
        "האתגר השבועי";


    let challengeDescription =
        "";


    let challengeIcon =
        "🎯";


    if (
        typeof currentChallenge !==
        "undefined" &&
        currentChallenge
    ) {

        challengeName =
            currentChallenge.name ||
            challengeName;

        challengeDescription =
            currentChallenge.description ||
            "";

        challengeIcon =
            currentChallenge.icon ||
            challengeIcon;

    }


    return `
        <div style="
            text-align:center;
            padding:20px;
            border-radius:16px;
            background:#fffaf0;
            border:1px solid #f0dfb0;
        ">

            <div style="
                font-size:34px;
                margin-bottom:8px;
            ">
                ${escapeEmailHtml(
                    challengeIcon
                )}
            </div>

            <div style="
                font-size:19px;
                font-weight:bold;
                margin-bottom:8px;
            ">
                ${escapeEmailHtml(
                    challengeName
                )}
            </div>

            ${
                challengeDescription
                    ? `
                        <div style="
                            color:#777;
                            margin-bottom:15px;
                        ">
                            ${escapeEmailHtml(
                                challengeDescription
                            )}
                        </div>
                    `
                    : ""
            }

            <div style="
                font-size:18px;
                font-weight:bold;
            ">
                ${
                    completed
                        ? "✓ האתגר הושלם"
                        : "○ האתגר לא הושלם"
                }
            </div>

        </div>
    `;

}


// ==================================================
// יצירת סיכום יומי
// ==================================================

function createDailyEmailContent(date) {

    const key =
        getDateKeyFromDate(date);


    const calories =
        getCaloriesForDate(key);


    const activity =
        getActivityForDate(key);


    const score =
        getScoreForDate(key);


    const foodSuccess =
        !!(
            savedData[key] &&
            savedData[key].food
        );


    const activitySuccess =
        activity >=
        DAILY_ACTIVITY_TARGET;


    const challengeSuccess =
        !!(
            savedData[key] &&
            savedData[key].challenge
        );


    const dateText =
        formatHebrewDate(date);


    return `
        <div style="
            direction:rtl;
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:auto;
            background:#ffffff;
            color:#444;
        ">

            <div style="
                text-align:center;
                padding:30px 20px;
                background:#fff5fa;
                border-radius:20px 20px 0 0;
            ">

                <div style="font-size:38px;">
                    🌸
                </div>

                <h1 style="
                    margin:8px 0;
                    color:#555;
                ">
                    סיכום היום שלי
                </h1>

                <div style="
                    color:#888;
                    font-size:16px;
                ">
                    ${dateText}
                </div>

            </div>


            <div style="padding:20px;">


                <!-- ציון -->

                <div style="
                    text-align:center;
                    padding:20px;
                    border-radius:16px;
                    background:#fafafa;
                    margin-bottom:20px;
                ">

                    <div style="
                        color:#888;
                        margin-bottom:5px;
                    ">
                        הציון היומי
                    </div>

                    <div style="
                        font-size:34px;
                        font-weight:bold;
                    ">
                        ${score} / 3
                    </div>

                </div>


                <!-- תזונה -->

                <h2 style="
                    border-bottom:1px solid #eee;
                    padding-bottom:10px;
                ">
                    🍽️ תזונה
                </h2>

                <div style="
                    padding:12px 0;
                ">

                    <strong>
                        סה״כ קלוריות:
                    </strong>

                    ${calories}

                    / ${DAILY_CALORIE_TARGET}

                </div>

                <div style="
                    padding:8px 0;
                    font-weight:bold;
                ">
                    ${
                        foodSuccess
                            ? "✓ עמדתי ביעד הקלורי"
                            : "○ לא עמדתי ביעד הקלורי"
                    }
                </div>

                ${createFoodEmailHtml(date)}


                <!-- פעילות -->

                <h2 style="
                    border-bottom:1px solid #eee;
                    padding-bottom:10px;
                    margin-top:30px;
                ">
                    🏃 פעילות
                </h2>

                <div style="
                    padding:12px 0;
                ">

                    <strong>
                        סה״כ פעילות:
                    </strong>

                    ${activity}

                    / ${DAILY_ACTIVITY_TARGET}

                    דקות

                </div>

                <div style="
                    padding:8px 0;
                    font-weight:bold;
                ">
                    ${
                        activitySuccess
                            ? "✓ עמדתי ביעד הפעילות"
                            : "○ לא עמדתי ביעד הפעילות"
                    }
                </div>

                ${createActivityEmailHtml(date)}


                <!-- אתגר -->

                <h2 style="
                    border-bottom:1px solid #eee;
                    padding-bottom:10px;
                    margin-top:30px;
                ">
                    🎯 אתגר
                </h2>

                ${createChallengeEmailHtml(date)}

            </div>


            <div style="
                text-align:center;
                padding:20px;
                color:#999;
                font-size:13px;
                border-top:1px solid #eee;
            ">
                המסע שלי 🌸
            </div>

        </div>
    `;

}


// ==================================================
// סיכום לתקופה
// ==================================================

function createPeriodEmailContent(
    startDate,
    endDate,
    title,
    icon
) {

    let totalCalories = 0;
    let totalActivity = 0;

    let totalScore = 0;

    let successfulFoodDays = 0;
    let successfulActivityDays = 0;
    let successfulChallengeDays = 0;

    let daysCount = 0;


    let dailyRows = "";


    const current =
        new Date(startDate);


    while (
        current <= endDate
    ) {

        const key =
            getDateKeyFromDate(current);


        const calories =
            getCaloriesForDate(key);


        const activity =
            getActivityForDate(key);


        const score =
            getScoreForDate(key);


        const foodSuccess =
            !!(
                savedData[key] &&
                savedData[key].food
            );


        const activitySuccess =
            activity >=
            DAILY_ACTIVITY_TARGET;


        const challengeSuccess =
            !!(
                savedData[key] &&
                savedData[key].challenge
            );


        totalCalories +=
            calories;

        totalActivity +=
            activity;

        totalScore +=
            score;

        daysCount++;


        if (foodSuccess)
            successfulFoodDays++;


        if (activitySuccess)
            successfulActivityDays++;


        if (challengeSuccess)
            successfulChallengeDays++;


        dailyRows += `
            <tr>

                <td style="
                    padding:10px;
                    border-bottom:1px solid #eee;
                ">
                    ${formatShortDate(current)}
                </td>

                <td style="
                    padding:10px;
                    text-align:center;
                    border-bottom:1px solid #eee;
                ">
                    ${calories}
                </td>

                <td style="
                    padding:10px;
                    text-align:center;
                    border-bottom:1px solid #eee;
                ">
                    ${activity}
                </td>

                <td style="
                    padding:10px;
                    text-align:center;
                    border-bottom:1px solid #eee;
                ">
                    ${score}/3
                </td>

            </tr>
        `;


        current.setDate(
            current.getDate() + 1
        );

    }


    const averageScore =
        daysCount > 0
            ? (
                totalScore /
                daysCount
            ).toFixed(1)
            : "0";


    const averageCalories =
        daysCount > 0
            ? Math.round(
                totalCalories /
                daysCount
            )
            : 0;


    const averageActivity =
        daysCount > 0
            ? Math.round(
                totalActivity /
                daysCount
            )
            : 0;


    return `
        <div style="
            direction:rtl;
            font-family:Arial,sans-serif;
            max-width:700px;
            margin:auto;
            background:#fff;
            color:#444;
        ">

            <div style="
                text-align:center;
                padding:30px 20px;
                background:#fff5fa;
                border-radius:20px 20px 0 0;
            ">

                <div style="font-size:40px;">
                    ${icon}
                </div>

                <h1 style="
                    margin:8px 0;
                ">
                    ${title}
                </h1>

                <div style="
                    color:#888;
                ">
                    ${formatShortDate(startDate)}
                    –
                    ${formatShortDate(endDate)}
                </div>

            </div>


            <div style="padding:20px;">


                <!-- נתוני על -->

                <div style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:10px;
                    justify-content:center;
                    margin-bottom:25px;
                ">

                    <div style="
                        flex:1;
                        min-width:130px;
                        padding:18px;
                        background:#fff8fb;
                        border-radius:15px;
                        text-align:center;
                    ">

                        <div style="font-size:13px;color:#888;">
                            ציון ממוצע
                        </div>

                        <strong style="font-size:25px;">
                            ${averageScore} / 3
                        </strong>

                    </div>


                    <div style="
                        flex:1;
                        min-width:130px;
                        padding:18px;
                        background:#fff8fb;
                        border-radius:15px;
                        text-align:center;
                    ">

                        <div style="font-size:13px;color:#888;">
                            ממוצע קלוריות
                        </div>

                        <strong style="font-size:25px;">
                            ${averageCalories}
                        </strong>

                    </div>


                    <div style="
                        flex:1;
                        min-width:130px;
                        padding:18px;
                        background:#fff8fb;
                        border-radius:15px;
                        text-align:center;
                    ">

                        <div style="font-size:13px;color:#888;">
                            ממוצע פעילות
                        </div>

                        <strong style="font-size:25px;">
                            ${averageActivity}
                        </strong>

                    </div>

                </div>


                <h2>
                    📊 סיכום התקופה
                </h2>


                <div style="
                    line-height:2;
                ">

                    <div>
                        🍽️ סה״כ קלוריות:
                        <strong>
                            ${totalCalories}
                        </strong>
                    </div>

                    <div>
                        🏃 סה״כ דקות פעילות:
                        <strong>
                            ${totalActivity}
                        </strong>
                    </div>

                    <div>
                        🎯 ימים שבהם האתגר הושלם:
                        <strong>
                            ${successfulChallengeDays}
                        </strong>
                    </div>

                    <div>
                        🍽️ ימים שבהם עמדת ביעד התזונה:
                        <strong>
                            ${successfulFoodDays}
                        </strong>
                    </div>

                    <div>
                        🏃 ימים שבהם עמדת ביעד הפעילות:
                        <strong>
                            ${successfulActivityDays}
                        </strong>
                    </div>

                </div>


                <h2 style="
                    margin-top:30px;
                ">
                    📅 פירוט יומי
                </h2>


                <div style="
                    overflow-x:auto;
                ">

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                        direction:rtl;
                    ">

                        <thead>

                            <tr style="
                                background:#fafafa;
                            ">

                                <th style="padding:10px;">
                                    יום
                                </th>

                                <th style="padding:10px;">
                                    קלוריות
                                </th>

                                <th style="padding:10px;">
                                    פעילות
                                </th>

                                <th style="padding:10px;">
                                    ציון
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${dailyRows}

                        </tbody>

                    </table>

                </div>

            </div>


            <div style="
                text-align:center;
                padding:20px;
                color:#999;
                border-top:1px solid #eee;
                font-size:13px;
            ">
                המסע שלי 🌸
            </div>

        </div>
    `;

}


// ==================================================
// נתונים לפי תאריך
// ==================================================

function getCaloriesForDate(key) {

    const foods =
        foodData[key] || [];


    return foods.reduce(
        (total, food) =>
            total +
            Number(
                food.calories || 0
            ),
        0
    );

}


function getActivityForDate(key) {

    const activities =
        activityData[key] || [];


    return activities.reduce(
        (total, activity) =>
            total +
            Number(
                activity.minutes || 0
            ),
        0
    );

}


function getScoreForDate(key) {

    let score = 0;


    if (
        savedData[key] &&
        savedData[key].food
    ) {

        score++;

    }


    if (
        savedData[key] &&
        savedData[key].activity
    ) {

        score++;

    }


    if (
        savedData[key] &&
        savedData[key].challenge
    ) {

        score++;

    }


    return score;

}


// ==================================================
// תאריך עברי להצגה
// ==================================================

function formatHebrewDate(date) {

    return `
        יום ${daysOfWeek[date.getDay()]},
        ${date.getDate()} ב${months[date.getMonth()]}
        ${date.getFullYear()}
    `;

}


function formatShortDate(date) {

    return `
        ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}
    `;

}


// ==================================================
// שליחת מייל
// ==================================================

async function sendEmail(
    subject,
    content,
    uniqueKey
) {

    if (
        emailSentData[uniqueKey]
    ) {

        console.log(
            "המייל כבר נשלח:",
            uniqueKey
        );

        return false;

    }


    if (
        typeof emailjs ===
        "undefined"
    ) {

        console.error(
            "EmailJS לא נטען."
        );

        return false;

    }


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {

                date:
                    subject,

                email_content:
                    content

            }
        );


        emailSentData[uniqueKey] =
            true;


        localStorage.setItem(
            "emailSentData",
            JSON.stringify(
                emailSentData
            )
        );


        console.log(
            "המייל נשלח בהצלחה:",
            subject
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
// סיכום יומי
// ==================================================

async function sendDailyEmail() {

    const subject =
        `🌸 סיכום היום – ${formatShortDate(today)}`;


    const content =
        createDailyEmailContent(today);


    return await sendEmail(
        subject,
        content,
        `daily-${dateKey}`
    );

}


// ==================================================
// תחילת שבוע
// ==================================================

function getWeekStart(date) {

    const result =
        new Date(date);


    result.setDate(
        result.getDate() -
        result.getDay()
    );


    return result;

}


// ==================================================
// סוף שבוע
// ==================================================

function getWeekEnd(date) {

    const result =
        getWeekStart(date);


    result.setDate(
        result.getDate() + 6
    );


    return result;

}


// ==================================================
// שליחת סיכום שבועי
// נשלח רק בשבת
// ==================================================

async function sendWeeklyEmail() {

    if (
        today.getDay() !== 6
    ) {

        return false;

    }


    const weekStart =
        getWeekStart(today);


    const weekEnd =
        getWeekEnd(today);


    const weekKey =
        getDateKeyFromDate(weekStart);


    const subject =
        `📅 סיכום שבועי – ${formatShortDate(weekStart)} עד ${formatShortDate(weekEnd)}`;


    const content =
        createPeriodEmailContent(
            weekStart,
            weekEnd,
            "הסיכום השבועי שלי",
            "📅"
        );


    return await sendEmail(
        subject,
        content,
        `weekly-${weekKey}`
    );

}


// ==================================================
// האם היום הוא היום האחרון בחודש
// ==================================================

function isLastDayOfMonth(date) {

    const tomorrow =
        new Date(date);


    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    return (
        tomorrow.getMonth() !==
        date.getMonth()
    );

}


// ==================================================
// תחילת חודש
// ==================================================

function getMonthStart(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

}


// ==================================================
// סוף חודש
// ==================================================

function getMonthEnd(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    );

}


// ==================================================
// שליחת סיכום חודשי
// ==================================================

async function sendMonthlyEmail() {

    if (
        !isLastDayOfMonth(today)
    ) {

        return false;

    }


    const monthStart =
        getMonthStart(today);


    const monthEnd =
        getMonthEnd(today);


    const monthKey =
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`;


    const subject =
        `🗓️ סיכום חודשי – ${months[today.getMonth()]} ${today.getFullYear()}`;


    const content =
        createPeriodEmailContent(
            monthStart,
            monthEnd,
            `הסיכום החודשי שלי – ${months[today.getMonth()]}`,
            "🗓️"
        );


    return await sendEmail(
        subject,
        content,
        `monthly-${monthKey}`
    );

}


// ==================================================
// האם היום האחרון בשנה
// ==================================================

function isLastDayOfYear(date) {

    return (
        date.getMonth() === 11 &&
        date.getDate() === 31
    );

}


// ==================================================
// תחילת שנה
// ==================================================

function getYearStart(date) {

    return new Date(
        date.getFullYear(),
        0,
        1
    );

}


// ==================================================
// סוף שנה
// ==================================================

function getYearEnd(date) {

    return new Date(
        date.getFullYear(),
        11,
        31
    );

}


// ==================================================
// שליחת סיכום שנתי
// ==================================================

async function sendYearlyEmail() {

    if (
        !isLastDayOfYear(today)
    ) {

        return false;

    }


    const yearStart =
        getYearStart(today);


    const yearEnd =
        getYearEnd(today);


    const yearKey =
        String(
            today.getFullYear()
        );


    const subject =
        `🎉 סיכום שנתי – ${today.getFullYear()}`;


    const content =
        createPeriodEmailContent(
            yearStart,
            yearEnd,
            `הסיכום השנתי שלי – ${today.getFullYear()}`,
            "🎉"
        );


    return await sendEmail(
        subject,
        content,
        `yearly-${yearKey}`
    );

}


// ==================================================
// שליחת כל הסיכומים הרלוונטיים
// ==================================================

async function sendAllRelevantEmails() {

    // סיכום יומי
    await sendDailyEmail();


    // שבת → סיכום שבועי
    if (
        today.getDay() === 6
    ) {

        await sendWeeklyEmail();

    }


    // סוף חודש → סיכום חודשי
    if (
        isLastDayOfMonth(today)
    ) {

        await sendMonthlyEmail();

    }


    // סוף שנה → סיכום שנתי
    if (
        isLastDayOfYear(today)
    ) {

        await sendYearlyEmail();

    }

}


// ==================================================
// אתגר – כפתור סיום היום
// ==================================================

if (finishDayButton) {

    finishDayButton.addEventListener(
        "click",
        async () => {

            // ------------------------------------------
            // אם היום כבר הסתיים → ביטול
            // ------------------------------------------

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
                    new Event("xpDataChanged")
                );


                loadToday();

                return;

            }


            // ------------------------------------------
            // שמירת מצב קודם
            // ------------------------------------------

            const previousFood =
                savedData[dateKey].food;


            const calories =
                getTodayCalories();


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
                new Event("xpDataChanged")
            );


            loadToday();


            // ------------------------------------------
            // שליחת המיילים
            // ------------------------------------------

            finishDayButton.disabled =
                true;


            const originalText =
                finishDayButton.textContent;


            finishDayButton.textContent =
                "✓ היום נשמר — שולחת סיכום...";


            await sendAllRelevantEmails();


            finishDayButton.disabled =
                false;


            finishDayButton.textContent =
                originalText;


            // ------------------------------------------
            // הודעה
            // ------------------------------------------

            if (finishDayMessage) {

                const score =
                    getTodayScore();


                if (score === 3) {

                    finishDayMessage.textContent =
                        "🎉 היום הושלם והמייל נשלח בהצלחה!";

                }
                else {

                    finishDayMessage.textContent =
                        "🌸 היום נשמר והמייל נשלח בהצלחה!";

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
            getDateKeyFromDate(date);


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
                        new Event("xpDataChanged")
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
            countdownDays.textContent = "0";


        if (countdownHours)
            countdownHours.textContent = "00";


        if (countdownMinutes)
            countdownMinutes.textContent = "00";


        if (countdownSeconds)
            countdownSeconds.textContent = "00";


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
            String(hours).padStart(2, "0");


    if (countdownMinutes)
        countdownMinutes.textContent =
            String(minutes).padStart(2, "0");


    if (countdownSeconds)
        countdownSeconds.textContent =
            String(seconds).padStart(2, "0");

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
