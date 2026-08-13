
// ==================================================
// הגדרות
// ==================================================

const DAILY_CALORIE_TARGET = 1800;
const DAILY_ACTIVITY_TARGET = 20;


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

const activityData =
    JSON.parse(
        localStorage.getItem("activityData")
    ) || {};


// ==================================================
// חישוב קלוריות
// ==================================================

function getCalories(dateKey) {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (
            total,
            food
        ) =>
            total +
            Number(food.calories),
        0
    );

}


// ==================================================
// חישוב פעילות
// ==================================================

function getActivityMinutes(dateKey) {

    const activities =
        activityData[dateKey] || [];


    return activities.reduce(
        (
            total,
            activity
        ) =>
            total +
            Number(activity.minutes),
        0
    );

}


// ==================================================
// איסוף כל התאריכים שיש עליהם מידע
// ==================================================

const allDateKeys =
    new Set([

        ...Object.keys(dietData),
        ...Object.keys(foodData),
        ...Object.keys(activityData)

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

let totalActivity = 0;
let activityDays = 0;

let challengeDays = 0;


// ==================================================
// מעבר על כל הימים
// ==================================================

allDateKeys.forEach(
    dateKey => {

        const day =
            dietData[dateKey] || {};


        const calories =
            getCalories(dateKey);


        const activityMinutes =
            getActivityMinutes(dateKey);


        // ------------------------------------------
        // הצלחת תזונה
        // ------------------------------------------

        const foodSuccess =
            day.food === true;


        // ------------------------------------------
        // הצלחת פעילות
        // ------------------------------------------

        const activitySuccess =
            activityMinutes >=
            DAILY_ACTIVITY_TARGET;


        // ------------------------------------------
        // אתגר
        // ------------------------------------------

        const challengeSuccess =
            day.challenge === true;


        // ------------------------------------------
        // ספירת קלוריות
        // ------------------------------------------

        if (
            Object.prototype.hasOwnProperty.call(
                foodData,
                dateKey
            )
        ) {

            totalCalories +=
                calories;

            calorieDays++;

        }


        // ------------------------------------------
        // ספירת פעילות
        // ------------------------------------------

        if (
            Object.prototype.hasOwnProperty.call(
                activityData,
                dateKey
            )
        ) {

            totalActivity +=
                activityMinutes;

            activityDays++;

        }


        // ------------------------------------------
        // ספירת אתגרים
        // ------------------------------------------

        if (challengeSuccess) {

            challengeDays++;

        }


        // ------------------------------------------
        // ציון היום
        // ------------------------------------------

        let score = 0;


        if (foodSuccess) {
            score++;
        }


        if (activitySuccess) {
            score++;
        }


        if (challengeSuccess) {
            score++;
        }


        // ------------------------------------------
        // יום פעיל
        // ------------------------------------------

        if (
            score > 0 ||
            calories > 0 ||
            activityMinutes > 0
        ) {

            activeDays++;

        }


        // ------------------------------------------
        // יום מושלם
        // ------------------------------------------

        if (score === 3) {

            completedDays++;

        }


        // ------------------------------------------
        // יום חלקי
        // ------------------------------------------

        if (
            score > 0 &&
            score < 3
        ) {

            partialDays++;

        }


        // ------------------------------------------
        // סך המשימות
        // ------------------------------------------

        totalTasks += 3;

        completedTasks += score;

    }
);


// ==================================================
// ממוצעים
// ==================================================

let averageCalories = 0;

let averageActivity = 0;


if (calorieDays > 0) {

    averageCalories =
        Math.round(
            totalCalories /
            calorieDays
        );

}


if (activityDays > 0) {

    averageActivity =
        Math.round(
            totalActivity /
            activityDays
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
    getIsraelToday();


let currentStreak = 0;

let checkDate =
    new Date(today);


while (true) {

    const dateKey =
        getDateKey(checkDate);


    const day =
        dietData[dateKey] || {};


    const foodSuccess =
        day.food === true;


    const activitySuccess =
        getActivityMinutes(
            dateKey
        ) >=
        DAILY_ACTIVITY_TARGET;


    const challengeSuccess =
        day.challenge === true;


    if (
        foodSuccess &&
        activitySuccess &&
        challengeSuccess
    ) {

        currentStreak++;


        checkDate.setDate(
            checkDate.getDate() - 1
        );

    } else {

        break;

    }

}


// ==================================================
// אלמנטים בדף
// ==================================================

const currentStreakElement =
    document.getElementById(
        "currentStreak"
    );

const perfectDaysElement =
    document.getElementById(
        "perfectDays"
    );

const activeDaysElement =
    document.getElementById(
        "activeDays"
    );

const completedDaysElement =
    document.getElementById(
        "completedDays"
    );

const partialDaysElement =
    document.getElementById(
        "partialDays"
    );

const emptyDaysElement =
    document.getElementById(
        "emptyDays"
    );

const averageCaloriesElement =
    document.getElementById(
        "averageCalories"
    );

const averageActivityElement =
    document.getElementById(
        "averageActivity"
    );

const challengeDaysElement =
    document.getElementById(
        "challengeDays"
    );

const overallPercentageElement =
    document.getElementById(
        "overallPercentage"
    );

const overallProgressFill =
    document.getElementById(
        "overallProgressFill"
    );

const progressMessage =
    document.getElementById(
        "progressMessage"
    );


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


if (averageActivityElement) {

    averageActivityElement.textContent =
        `${averageActivity} דקות`;

}


if (challengeDaysElement) {

    challengeDaysElement.textContent =
        challengeDays;

}


// ==================================================
// אחוז משימות שהושלמו
// ==================================================

let percentage = 0;


if (totalTasks > 0) {

    percentage =
        Math.round(
            (
                completedTasks /
                totalTasks
            ) * 100
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
