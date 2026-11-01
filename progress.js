
// ==================================================
// הגדרות
// ==================================================

const PROGRESS_CALORIE_TARGET = 1400;


// ==================================================
// טעינת נתונים
// ==================================================

const dietData =
    JSON.parse(
        localStorage.getItem("dietData")
    ) || {};

const foodData =
    JSON.parse(
        localStorage.getItem("foodData")
    ) || {};

const finishDayData =
    JSON.parse(
        localStorage.getItem("finishDayData")
    ) || {};


// ==================================================
// חישוב קלוריות
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
// בדיקת יום מושלם
// ==================================================

function isPerfectDay(dateKey) {

    const calories =
        getCalories(dateKey);

    const dayFinished =
        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true;

    return (
        dayFinished &&
        calories <= PROGRESS_CALORIE_TARGET
    );

}


// ==================================================
// איסוף כל התאריכים שיש עליהם מידע
// ==================================================

const allDateKeys =
    new Set([

        ...Object.keys(foodData),
        ...Object.keys(finishDayData)

    ]);


// ==================================================
// סטטיסטיקות
// ==================================================

let completedDays = 0;
let partialDays = 0;
let activeDays = 0;

let totalTasks = 0;
let completedTasks = 0;

let totalCalories = 0;
let calorieDays = 0;


// ==================================================
// מעבר על כל הימים
// ==================================================

allDateKeys.forEach(dateKey => {

    const calories =
        getCalories(dateKey);

    const hasFoodData =
        Object.prototype.hasOwnProperty.call(
            foodData,
            dateKey
        );

    const dayFinished =
        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true;


    // ------------------------------------------
    // ספירת קלוריות
    // ------------------------------------------

    if (hasFoodData) {

        totalCalories += calories;

        calorieDays++;

    }


    // ------------------------------------------
    // יום פעיל
    // ------------------------------------------

    if (calories > 0) {

        activeDays++;

    }


    // ------------------------------------------
    // יום מושלם
    // ------------------------------------------

    const perfect =
        isPerfectDay(dateKey);


    if (perfect) {

        completedDays++;

    }


    // ------------------------------------------
    // יום חלקי
    // ------------------------------------------

    else if (
        calories > 0 ||
        dayFinished
    ) {

        partialDays++;

    }


    // ------------------------------------------
    // סך ימי המעקב
    // ------------------------------------------

    totalTasks++;


    if (perfect) {

        completedTasks++;

    }

});


// ==================================================
// ממוצע קלוריות
// ==================================================

let averageCalories = 0;

if (calorieDays > 0) {

    averageCalories =
        Math.round(
            totalCalories / calorieDays
        );

}


// ==================================================
// תאריך היום באתר
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


    // יום האתר מתחלף בשעה 06:00

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


    return new Date(
        year,
        month,
        day
    );

}


// ==================================================
// מפתח תאריך
// ==================================================

function getDateKey(date) {

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
// רצף ימים מושלמים
// ==================================================

const today =
    getSiteToday();

let currentStreak = 0;

let checkDate =
    new Date(today);


while (
    isPerfectDay(
        getDateKey(checkDate)
    )
) {

    currentStreak++;

    checkDate.setDate(
        checkDate.getDate() - 1
    );

}


// ==================================================
// אלמנטים בדף
// ==================================================

const currentStreakElement =
    document.getElementById("currentStreak");

const perfectDaysElement =
    document.getElementById("perfectDays");

const activeDaysElement =
    document.getElementById("activeDays");

const completedDaysElement =
    document.getElementById("completedDays");

const partialDaysElement =
    document.getElementById("partialDays");

const emptyDaysElement =
    document.getElementById("emptyDays");

const averageCaloriesElement =
    document.getElementById("averageCalories");

const overallPercentageElement =
    document.getElementById("overallPercentage");

const overallProgressFill =
    document.getElementById("overallProgressFill");

const progressMessage =
    document.getElementById("progressMessage");


// ==================================================
// הצגת הנתונים
// ==================================================

if (currentStreakElement) {

    currentStreakElement.textContent =
        currentStreak;

}


if (perfectDaysElement) {

    perfectDaysElement.textContent =
        completedDays;

}


if (activeDaysElement) {

    activeDaysElement.textContent =
        activeDays;

}


if (completedDaysElement) {

    completedDaysElement.textContent =
        completedDays;

}


if (partialDaysElement) {

    partialDaysElement.textContent =
        partialDays;

}


if (emptyDaysElement) {

    emptyDaysElement.textContent =
        "0";

}


if (averageCaloriesElement) {

    averageCaloriesElement.textContent =
        averageCalories;

}


// ==================================================
// אחוז ימים מושלמים
// ==================================================

let percentage = 0;

if (totalTasks > 0) {

    percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );

}


if (overallPercentageElement) {

    overallPercentageElement.textContent =
        `${percentage}%`;

}


if (overallProgressFill) {

    overallProgressFill.style.width =
        `${percentage}%`;

}


// ==================================================
// הודעה
// ==================================================

if (progressMessage) {

    if (currentStreak >= 7) {

        progressMessage.textContent =
            "🔥 שבוע שלם! את פשוט תותחית!";

    }

    else if (currentStreak >= 3) {

        progressMessage.textContent =
            "🌟 שלושה ימים ברצף! ממשיכים!";

    }

    else if (completedDays >= 1) {

        progressMessage.textContent =
            "💪 התחלת את המסע — כל יום נחשב!";

    }

    else {

        progressMessage.textContent =
            "🌸 זה היום הראשון שלך — מתחילים!";

    }

}
