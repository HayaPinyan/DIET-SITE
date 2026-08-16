// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1500;
const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// אלמנטים בדף
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


// כרטיס תזונה

const foodCalories =
    document.getElementById("foodCalories");

const foodCard =
    document.getElementById("foodCard");

const foodProgressFill =
    document.getElementById("foodProgressFill");

const foodProgressPercent =
    document.getElementById("foodProgressPercent");


// כרטיס פעילות

const activityMinutes =
    document.getElementById("activityMinutes");

const activityProgressFill =
    document.getElementById("activityProgressFill");

const activityProgressPercent =
    document.getElementById("activityProgressPercent");


// כפתור סיום היום

const finishDayButton =
    document.getElementById("finishDayButton");

const finishDayMessage =
    document.getElementById("finishDayMessage");


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
        ).formatToParts(new Date());


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


const today =
    getIsraelToday();


// ==================================================
// מפתח תאריך
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
// יצירת נתוני היום
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
// חישוב קלוריות
// ==================================================

function getTodayCalories() {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (
            total,
            food
        ) => {

            return (
                total +
                Number(food.calories || 0)
            );

        },
        0
    );

}


// ==================================================
// חישוב פעילות
// ==================================================

function getTodayActivityMinutes() {

    const activities =
        activityData[dateKey] || [];


    return activities.reduce(
        (
            total,
            activity
        ) => {

            return (
                total +
                Number(activity.minutes || 0)
            );

        },
        0
    );

}


// ==================================================
// ציון יומי
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
// האם היום סומן כסיום
// ==================================================

function isDayFinished() {

    return (
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
// עדכון תזונה
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

        if (
            total >
            DAILY_CALORIE_TARGET
        ) {

            foodCard.classList.add(
                "calorie-over"
            );

        } else {

            foodCard.classList.remove(
                "calorie-over"
            );

        }

    }

}


// ==================================================
// עדכון פעילות
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
// ניקוי צבע כפתור סיום
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
// עדכון כפתור סיום היום
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


    if (finishDayMessage) {

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

}


// ==================================================
// מצב ציון קודם לצורך אנימציה
// ==================================================

let previousDailyScore =
    getTodayScore();


// ==================================================
// עדכון הציון
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


    // אם עברנו לראשונה ל־3/3

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


    taskButtons.forEach(
        button => {

            const taskName =
                button.dataset.task;


            if (
                savedData[dateKey] &&
                savedData[dateKey][taskName]
            ) {

                button.classList.add(
                    "completed"
                );

            } else {

                button.classList.remove(
                    "completed"
                );

            }

        }
    );


    updateFoodCalories();

    updateActivityMinutes();

    updateScore();

    updateFinishDayButton();

}


// ==================================================
// לחיצה על האתגר
// ==================================================

taskButtons.forEach(
    button => {

        const taskName =
            button.dataset.task;


        if (
            taskName !== "challenge"
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
// כפתור סיום היום
// ==================================================

if (finishDayButton) {

    finishDayButton.addEventListener(
        "click",
        () => {

            // ביטול סיום

            if (isDayFinished()) {

                const previousFood =
                    finishDayData[dateKey]
                        .previousFood;


                savedData[dateKey].food =
                    previousFood;


                finishDayData[dateKey].finished =
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


            // שמירת מצב התזונה הקודם

            const previousFood =
                savedData[dateKey].food;


            const calories =
                getTodayCalories();


            const withinLimit =
                calories <=
                DAILY_CALORIE_TARGET;


            // שמירת סיום

            finishDayData[dateKey] = {

                finished: true,

                previousFood:
                    previousFood

            };


            // תזונה תקינה

            savedData[dateKey].food =
                withinLimit;


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

        }
    );

}


// ==================================================
// ברכה לפי שעה
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
        israelHour >= 5 &&
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
            "אפשר לסיים את היום בגאווה ולהתחיל מחדש מחר 🌙";

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


// ==================================================
// עדכון האתגר בדף הבית
// ==================================================

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
            date.getFullYear() +
            "-" +
            String(
                date.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                date.getDate()
            ).padStart(2, "0");


        const day =
            document.createElement(
                "span"
            );


        day.className =
            "day";


        day.textContent =
            dayNames[i];


        if (
            savedData[challengeDateKey] &&
            savedData[challengeDateKey].challenge
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

        } else {

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
// שמירה ראשונית
// ==================================================

localStorage.setItem(
    "dietData",
    JSON.stringify(savedData)
);


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

    const now =
        new Date();


    const difference =
        countdownTarget -
        now;


    if (
        difference <= 0
    ) {

        if (countdownDays) {
            countdownDays.textContent = "0";
        }

        if (countdownHours) {
            countdownHours.textContent = "00";
        }

        if (countdownMinutes) {
            countdownMinutes.textContent = "00";
        }

        if (countdownSeconds) {
            countdownSeconds.textContent = "00";
        }

        return;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds /
            (24 * 60 * 60)
        );


    const hours =
        Math.floor(
            (
                totalSeconds %
                (24 * 60 * 60)
            ) /
            (60 * 60)
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                (60 * 60)
            ) /
            60
        );


    const seconds =
        totalSeconds % 60;


    if (countdownDays) {

        countdownDays.textContent =
            days;

    }


    if (countdownHours) {

        countdownHours.textContent =
            String(
                hours
            ).padStart(2, "0");

    }


    if (countdownMinutes) {

        countdownMinutes.textContent =
            String(
                minutes
            ).padStart(2, "0");

    }


    if (countdownSeconds) {

        countdownSeconds.textContent =
            String(
                seconds
            ).padStart(2, "0");

    }

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


// ==================================================
// הפעלה ראשונית
// ==================================================

loadToday();

updateHomeChallenge();
