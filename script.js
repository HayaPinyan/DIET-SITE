// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1500;
const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// EmailJS
// ==================================================

const EMAILJS_PUBLIC_KEY =
    "phMCkJwty8w7XBDoJ";

const EMAILJS_SERVICE_ID =
    "service_8s7fe3a";

const EMAILJS_TEMPLATE_ID =
    "template_tcts9d9";


// ==================================================
// פונקציות עזר למייל
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
// בניית HTML של המאכלים למייל
// ==================================================

function buildFoodEmailHtml(targetDateKey = dateKey) {

    const foods =
        foodData[targetDateKey] || [];


    if (!foods.length) {

        return `
            <div style="
                padding:15px;
                text-align:center;
                color:#988783;
            ">
                לא נרשמו מאכלים היום 🌸
            </div>
        `;

    }


    let html = `

        <table style="
            width:100%;
            border-collapse:collapse;
            direction:rtl;
        ">

            <tr>

                <th style="
                    background:#faf6f4;
                    color:#776764;
                    padding:10px;
                    text-align:right;
                    border-bottom:1px solid #e9dfda;
                ">
                    מאכל
                </th>

                <th style="
                    background:#faf6f4;
                    color:#776764;
                    padding:10px;
                    text-align:right;
                    border-bottom:1px solid #e9dfda;
                ">
                    כמות
                </th>

                <th style="
                    background:#faf6f4;
                    color:#776764;
                    padding:10px;
                    text-align:right;
                    border-bottom:1px solid #e9dfda;
                ">
                    קלוריות
                </th>

            </tr>

    `;


    foods.forEach(food => {

        html += `

            <tr>

                <td style="
                    padding:11px 8px;
                    border-bottom:1px solid #eee7e3;
                    text-align:right;
                ">
                    ${escapeEmailHtml(food.emoji || "🍽️")}
                    ${escapeEmailHtml(food.name || "")}
                </td>

                <td style="
                    padding:11px 8px;
                    border-bottom:1px solid #eee7e3;
                    text-align:right;
                ">
                    ${escapeEmailHtml(food.amount || "")}
                </td>

                <td style="
                    padding:11px 8px;
                    border-bottom:1px solid #eee7e3;
                    text-align:right;
                ">
                    ${Number(food.calories || 0)}
                </td>

            </tr>

        `;

    });


    html += `
        </table>
    `;


    return html;

}


// ==================================================
// בניית HTML של הפעילויות למייל
// ==================================================

function buildActivityEmailHtml(targetDateKey = dateKey) {

    const activities =
        activityData[targetDateKey] || [];


    if (!activities.length) {

        return `
            <div style="
                padding:15px;
                text-align:center;
                color:#988783;
            ">
                לא נרשמה פעילות היום 🌸
            </div>
        `;

    }


    let html = "";


    activities.forEach(activity => {

        html += `

            <div style="
                display:table;
                width:100%;
                padding:12px 0;
                border-bottom:1px solid #eee7e3;
                direction:rtl;
            ">

                <span style="
                    display:table-cell;
                    width:70%;
                    text-align:right;
                ">

                    ${escapeEmailHtml(
                        activity.emoji || "🏃"
                    )}

                    ${escapeEmailHtml(
                        activity.name || "פעילות"
                    )}

                </span>

                <strong style="
                    display:table-cell;
                    width:30%;
                    text-align:left;
                ">

                    ${Number(
                        activity.minutes || 0
                    )}

                    דקות

                </strong>

            </div>

        `;

    });


    return html;

}


// ==================================================
// בניית HTML של האתגר למייל
// ==================================================

function buildChallengeEmailHtml(
    challengeName,
    challengeCompleted
) {

    const safeName =
        escapeEmailHtml(
            challengeName || "האתגר השבועי"
        );


    if (challengeCompleted === true) {

        return `

            <div style="
                text-align:center;
                padding:20px;
                direction:rtl;
            ">

                <div style="
                    font-size:20px;
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#705f5a;
                ">
                    🎯 האתגר
                </div>

                <div style="
                    font-size:18px;
                    margin-bottom:15px;
                    color:#75615c;
                ">
                    ${safeName}
                </div>

                <div style="
                    display:inline-block;
                    padding:9px 20px;
                    border-radius:20px;
                    font-weight:bold;
                    background:#e8f2e8;
                    color:#527052;
                    font-size:18px;
                ">
                    ✓ האתגר הושלם
                </div>

            </div>

        `;

    }


    return `

        <div style="
            text-align:center;
            padding:20px;
            direction:rtl;
        ">

            <div style="
                font-size:20px;
                font-weight:bold;
                margin-bottom:10px;
                color:#705f5a;
            ">
                🎯 האתגר
            </div>

            <div style="
                font-size:18px;
                margin-bottom:15px;
                color:#75615c;
            ">
                ${safeName}
            </div>

            <div style="
                display:inline-block;
                padding:9px 20px;
                border-radius:20px;
                font-weight:bold;
                background:#f5e8e6;
                color:#8a5f59;
                font-size:18px;
            ">
                ○ האתגר לא הושלם
            </div>

        </div>

    `;

}


// ==================================================
// הודעה יומית
// ==================================================

function getDailyMessage(score) {

    if (score === 0) {

        return "חבל...";

    }


    if (score === 1) {

        return "💪 ממשיכים קדימה!";

    }


    if (score === 2) {

        return "🌟 כמעט מושלם!";

    }


    return "🎉 כל הכבוד! היום הושלם בהצלחה!";

}


// ==================================================
// שליחת סיכום יומי במייל
// ==================================================

async function sendDailySummaryEmail(targetDateKey = dateKey) {

    try {

        console.log(
            "מתחילה שליחת סיכום יומי במייל..."
        );


        const score =
            getTodayScore(targetDateKey);


        // ==========================================
        // מצב האתגר
        // ==========================================

        const challengeButton =
            document.querySelector(
                '.task-button[data-task="challenge"]'
            );


        const challengeCompleted =
            !!(
                (
                    savedData[targetDateKey] &&
                    savedData[targetDateKey].challenge === true
                )
                ||
                (
                    targetDateKey === dateKey &&
                    challengeButton &&
                    challengeButton.classList.contains(
                        "completed"
                    )
                )
            );


        console.log(
            "מצב האתגר בזמן שליחת המייל:",
            challengeCompleted
        );


        const challengeName =
            targetDateKey === dateKey &&
            typeof currentChallenge !== "undefined" &&
            currentChallenge &&
            currentChallenge.name
                ? currentChallenge.name
                : getChallengeNameForDate(targetDateKey);


        // ==========================================
        // HTML מוכן של האתגר
        // ==========================================

        const challengeHtml =
            buildChallengeEmailHtml(
                challengeName,
                challengeCompleted
            );


        console.log(
            "HTML האתגר שנשלח:",
            challengeHtml
        );


        // ==========================================
        // תאריך
        // ==========================================

        const dateParts =
            targetDateKey.split("-").map(Number);

        const targetDate =
            new Date(
                dateParts[0],
                dateParts[1] - 1,
                dateParts[2]
            );

        const dateText =
            `${daysOfWeek[targetDate.getDay()]}, ` +
            `${targetDate.getDate()} ` +
            `ב${months[targetDate.getMonth()]} ` +
            `${targetDate.getFullYear()}`;


        // ==========================================
        // נתוני המייל
        // ==========================================

        const templateParams = {

            date:
                dateText,

            score:
                score,

            food_html:
                buildFoodEmailHtml(targetDateKey),

            total_calories:
                getTodayCalories(targetDateKey),

            calorie_target:
                DAILY_CALORIE_TARGET,

            activity_html:
                buildActivityEmailHtml(targetDateKey),

            total_activity:
                getTodayActivityMinutes(targetDateKey),

            activity_target:
                DAILY_ACTIVITY_TARGET,

            challenge_name:
                challengeName,

            challenge_html:
                challengeHtml,

            daily_message:
                getDailyMessage(score)

        };


        console.log(
            "הנתונים שנשלחים ל-EmailJS:",
            templateParams
        );


        // ==========================================
        // שליחה
        // ==========================================

        const response =
            await fetch(
                "https://api.emailjs.com/api/v1.0/email/send",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            service_id:
                                EMAILJS_SERVICE_ID,

                            template_id:
                                EMAILJS_TEMPLATE_ID,

                            user_id:
                                EMAILJS_PUBLIC_KEY,

                            template_params:
                                templateParams

                        })

                }
            );


        const responseText =
            await response.text();


        console.log(
            "EmailJS response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            throw new Error(
                `EmailJS error ${response.status}: ${responseText}`
            );

        }


        console.log(
            "המייל נשלח בהצלחה!"
        );


        return true;

    }

    catch (error) {

        console.error(
            "שגיאה בשליחת סיכום היום במייל:",
            error
        );


        return false;

    }

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

const finishPastDayButton =
    document.getElementById("finishPastDayButton");

const finishPastDayDate =
    document.getElementById("finishPastDayDate");

const finishPastDayMessage =
    document.getElementById("finishPastDayMessage");


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
// מפתח התאריך
// ==================================================

const dateKey =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
        today.getDate()
    ).padStart(2, "0");


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
// קלוריות
// ==================================================

function getTodayCalories(targetDateKey = dateKey) {

    const foods =
        foodData[targetDateKey] || [];


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

function getTodayActivityMinutes(targetDateKey = dateKey) {

    const activities =
        activityData[targetDateKey] || [];


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

function getTodayScore(targetDateKey = dateKey) {

    let score = 0;


    if (
        savedData[targetDateKey] &&
        savedData[targetDateKey].food
    ) {

        score++;

    }


    if (
        savedData[targetDateKey] &&
        savedData[targetDateKey].activity
    ) {

        score++;

    }


    if (
        savedData[targetDateKey] &&
        savedData[targetDateKey].challenge
    ) {

        score++;

    }


    return score;

}


// ==================================================
// האם היום הסתיים
// ==================================================

function isDayFinished(targetDateKey = dateKey) {

    return !!(

        finishDayData[targetDateKey] &&
        finishDayData[targetDateKey].finished === true

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

taskButtons.forEach(button => {

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


            if (!savedData[dateKey]) {

                savedData[dateKey] = {

                    food: false,
                    activity: false,
                    challenge: false

                };

            }


            savedData[dateKey].challenge =
                isCompleted;


            localStorage.setItem(
                "dietData",
                JSON.stringify(savedData)
            );


            console.log(
                "מצב האתגר נשמר:",
                savedData[dateKey].challenge
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

});


// ==================================================
// סיום היום
// ==================================================

if (finishDayButton) {

    finishDayButton.addEventListener(
        "click",
        async () => {

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
                    JSON.stringify(finishDayData)
                );


                window.dispatchEvent(
                    new Event("xpDataChanged")
                );


                loadToday();

                return;

            }


            const previousFood =
                savedData[dateKey].food;


            const calories =
                getTodayCalories();


            finishDayData[dateKey] = {

                finished: true,

                previousFood:
                    previousFood,

                emailSent:
                    false

            };


            savedData[dateKey].food =
                calories <= DAILY_CALORIE_TARGET;


            localStorage.setItem(
                "dietData",
                JSON.stringify(savedData)
            );


            localStorage.setItem(
                "finishDayData",
                JSON.stringify(finishDayData)
            );


            window.dispatchEvent(
                new Event("xpDataChanged")
            );


            loadToday();


            // ==========================================
            // שליחת הסיכום למייל
            // ==========================================

            if (finishDayMessage) {

                finishDayMessage.textContent =
                    "שולחת את סיכום היום למייל... 📧";

            }


            const sent =
                await sendDailySummaryEmail();


            if (sent) {

                finishDayData[
                    dateKey
                ].emailSent =
                    true;


                localStorage.setItem(
                    "finishDayData",
                    JSON.stringify(finishDayData)
                );


                if (finishDayMessage) {

                    const score =
                        getTodayScore();


                    if (score === 3) {

                        finishDayMessage.textContent =
                            "🎉 כל הכבוד! היום הושלם בהצלחה! המייל נשלח 📧";

                    }

                    else if (score === 2) {

                        finishDayMessage.textContent =
                            "🌟 כמעט מושלם! המייל נשלח 📧";

                    }

                    else if (score === 1) {

                        finishDayMessage.textContent =
                            "💪 ממשיכים קדימה! המייל נשלח 📧";

                    }

                    else {

                        finishDayMessage.textContent =
                            "חבל... המייל נשלח 📧";

                    }

                }

            }

            else {

                if (finishDayMessage) {

                    finishDayMessage.textContent =
                        "היום נשמר, אבל המייל לא נשלח. בדקי את ה־Console.";

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
                        JSON.stringify(savedData)
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
// סיום יום שעבר - פעולות ממוקדות לתאריך שנבחר
// ==================================================

function getChallengeNameForDate(targetDateKey) {

    if (
        typeof challengeSchedule === "undefined" ||
        !Array.isArray(challengeSchedule) ||
        !challengeSchedule.length ||
        typeof startDate === "undefined"
    ) {
        return "האתגר השבועי";
    }

    const parts = targetDateKey.split("-").map(Number);

    const targetUtc = Date.UTC(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    const startUtc = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    const weekNumber = Math.max(
        1,
        Math.floor((targetUtc - startUtc) / (7 * 24 * 60 * 60 * 1000)) + 1
    );

    const scheduleIndex = (weekNumber - 1) % challengeSchedule.length;

    return (
        challengeSchedule[scheduleIndex] &&
        challengeSchedule[scheduleIndex].name
    ) || "האתגר השבועי";

}


function updatePastFinishButtonColor(targetDateKey) {

    if (!finishPastDayButton) {
        return;
    }

    finishPastDayButton.classList.remove(
        "finish-score-0",
        "finish-score-1",
        "finish-score-2",
        "finish-score-3"
    );

    if (!isDayFinished(targetDateKey)) {
        return;
    }

    finishPastDayButton.classList.add(
        `finish-score-${getTodayScore(targetDateKey)}`
    );

}


async function finishPastDay(targetDateKey) {

    if (!targetDateKey || targetDateKey >= dateKey) {
        if (finishPastDayMessage) {
            finishPastDayMessage.textContent =
                "אפשר לסיים רק יום שעבר, ולא את היום הנוכחי או יום עתידי.";
        }
        return;
    }

    if (!savedData[targetDateKey]) {
        savedData[targetDateKey] = {
            food: false,
            activity: false,
            challenge: false
        };
    }

    // לחיצה חוזרת מתנהגת כמו ביטול סיום היום בכפתור הרגיל.
    if (isDayFinished(targetDateKey)) {

        savedData[targetDateKey].food =
            finishDayData[targetDateKey].previousFood;

        finishDayData[targetDateKey].finished = false;

        localStorage.setItem(
            "dietData",
            JSON.stringify(savedData)
        );

        localStorage.setItem(
            "finishDayData",
            JSON.stringify(finishDayData)
        );

        window.dispatchEvent(
            new Event("xpDataChanged")
        );

        updatePastFinishButtonColor(targetDateKey);

        if (finishPastDayMessage) {
            finishPastDayMessage.textContent =
                `בוטל סיום היום של ${targetDateKey}. אפשר לבחור שוב את התאריך כדי לסיים אותו.`;
        }

        return;
    }

    const previousFood =
        savedData[targetDateKey].food;

    const calories =
        getTodayCalories(targetDateKey);

    // בדומה ל-loadToday() של היום הרגיל: עדכון דגל הפעילות לפי הפעילות שנרשמה.
    savedData[targetDateKey].activity =
        getTodayActivityMinutes(targetDateKey) >= DAILY_ACTIVITY_TARGET;

    finishDayData[targetDateKey] = {
        finished: true,
        previousFood: previousFood,
        emailSent: false
    };

    savedData[targetDateKey].food =
        calories <= DAILY_CALORIE_TARGET;

    localStorage.setItem(
        "dietData",
        JSON.stringify(savedData)
    );

    localStorage.setItem(
        "finishDayData",
        JSON.stringify(finishDayData)
    );

    window.dispatchEvent(
        new Event("xpDataChanged")
    );

    updatePastFinishButtonColor(targetDateKey);

    if (finishPastDayMessage) {
        finishPastDayMessage.textContent =
            `הנתונים של ${targetDateKey} נשמרו. שולחת את הסיכום למייל... 📧`;
    }

    const sent =
        await sendDailySummaryEmail(targetDateKey);

    if (sent) {

        finishDayData[targetDateKey].emailSent = true;

        localStorage.setItem(
            "finishDayData",
            JSON.stringify(finishDayData)
        );

        const score = getTodayScore(targetDateKey);
        let message;

        if (score === 3) {
            message = "🎉 כל הכבוד! היום הושלם בהצלחה! המייל נשלח 📧";
        } else if (score === 2) {
            message = "🌟 כמעט מושלם! המייל נשלח 📧";
        } else if (score === 1) {
            message = "💪 ממשיכים קדימה! המייל נשלח 📧";
        } else {
            message = "חבל... המייל נשלח 📧";
        }

        if (finishPastDayMessage) {
            finishPastDayMessage.textContent =
                `${targetDateKey}: ${message}`;
        }

    } else if (finishPastDayMessage) {

        finishPastDayMessage.textContent =
            `היום ${targetDateKey} נשמר, אבל המייל לא נשלח. בדקי את ה־Console.`;

    }

}


// הגדרת התאריך האחרון שמותר לבחור: היום הקודם לפי שעון האתר (06:00).
function getPreviousSiteDayKey() {

    const previousDate = new Date(today);

    previousDate.setDate(previousDate.getDate() - 1);

    return getDateKeyFromDate(previousDate);

}


if (finishPastDayDate) {
    finishPastDayDate.max = getPreviousSiteDayKey();
}


if (finishPastDayButton && finishPastDayDate) {

    finishPastDayButton.addEventListener("click", () => {

        finishPastDayDate.max = getPreviousSiteDayKey();
        finishPastDayDate.value = "";

        if (finishPastDayMessage) {
            finishPastDayMessage.textContent = "";
        }

        try {
            if (typeof finishPastDayDate.showPicker === "function") {
                finishPastDayDate.showPicker();
            } else {
                finishPastDayDate.click();
            }
        } catch (error) {
            finishPastDayDate.click();
        }

    });

    finishPastDayDate.addEventListener("change", async () => {

        const selectedDateKey = finishPastDayDate.value;

        if (!selectedDateKey) {
            return;
        }

        if (selectedDateKey >= dateKey) {

            if (finishPastDayMessage) {
                finishPastDayMessage.textContent =
                    "אפשר לבחור רק תאריך שעבר.";
            }

            finishPastDayDate.value = "";
            return;
        }

        await finishPastDay(selectedDateKey);
        finishPastDayDate.value = "";

    });

}


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
            String(hours).padStart(
                2,
                "0"
            );


    if (countdownMinutes)
        countdownMinutes.textContent =
            String(minutes).padStart(
                2,
                "0"
            );


    if (countdownSeconds)
        countdownSeconds.textContent =
            String(seconds).padStart(
                2,
                "0"
            );

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