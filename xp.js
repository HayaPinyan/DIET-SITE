// ==================================================
// הגדרות XP
// ==================================================

const XP_CALORIE_SUCCESS = 20;
const XP_ACTIVITY_SUCCESS = 20;
const XP_CHALLENGE_SUCCESS = 30;
const XP_PERFECT_DAY_BONUS = 50;


// ==================================================
// אלמנטים
// ==================================================

const xpTotalElement =
    document.getElementById("xpTotal");

const xpLevelElement =
    document.getElementById("xpLevel");

const xpLevelNameElement =
    document.getElementById("xpLevelName");

const xpProgressFill =
    document.getElementById("xpProgressFill");

const xpProgressText =
    document.getElementById("xpProgressText");


// ==================================================
// טעינת נתונים
// ==================================================

function loadXPData() {

    return {

        dietData:
            JSON.parse(
                localStorage.getItem("dietData")
            ) || {},

        foodData:
            JSON.parse(
                localStorage.getItem("foodData")
            ) || {},

        activityData:
            JSON.parse(
                localStorage.getItem("activityData")
            ) || {},

        finishDayData:
            JSON.parse(
                localStorage.getItem("finishDayData")
            ) || {}

    };

}


// ==================================================
// קלוריות
// ==================================================

function getXPCalories(
    foodData,
    dateKey
) {

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
// פעילות
// ==================================================

function getXPActivity(
    activityData,
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
// הישגים
// ==================================================

const xpAchievements = [

    {
        id: "first_active_day",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 1
    },

    {
        id: "first_finished_day",
        xp: 50,
        unlocked: data =>
            data.finishedDays >= 1
    },

    {
        id: "three_active_days",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 3
    },

    {
        id: "three_perfect_streak",
        xp: 100,
        unlocked: data =>
            data.currentStreak >= 3
    },

    {
        id: "seven_perfect_streak",
        xp: 200,
        unlocked: data =>
            data.currentStreak >= 7
    },

    {
        id: "fourteen_perfect_streak",
        xp: 200,
        unlocked: data =>
            data.currentStreak >= 14
    },

    {
        id: "thirty_perfect_streak",
        xp: 500,
        unlocked: data =>
            data.currentStreak >= 30
    },

    {
        id: "five_perfect_days",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 5
    },

    {
        id: "ten_perfect_days",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 10
    },

    {
        id: "twenty_perfect_days",
        xp: 200,
        unlocked: data =>
            data.perfectDays >= 20
    },

    {
        id: "thirty_perfect_days",
        xp: 200,
        unlocked: data =>
            data.perfectDays >= 30
    },

    {
        id: "fifty_perfect_days",
        xp: 500,
        unlocked: data =>
            data.perfectDays >= 50
    },

    {
        id: "one_hundred_perfect_days",
        xp: 500,
        unlocked: data =>
            data.perfectDays >= 100
    },

    {
        id: "first_activity_day",
        xp: 50,
        unlocked: data =>
            data.activitySuccessDays >= 1
    },

    {
        id: "ten_activity_days",
        xp: 100,
        unlocked: data =>
            data.activitySuccessDays >= 10
    },

    {
        id: "twenty_five_activity_days",
        xp: 200,
        unlocked: data =>
            data.activitySuccessDays >= 25
    },

    {
        id: "first_calorie_success",
        xp: 50,
        unlocked: data =>
            data.calorieSuccessDays >= 1
    },

    {
        id: "ten_calorie_success",
        xp: 100,
        unlocked: data =>
            data.calorieSuccessDays >= 10
    },

    {
        id: "twenty_five_calorie_success",
        xp: 200,
        unlocked: data =>
            data.calorieSuccessDays >= 25
    },

    {
        id: "first_challenge_day",
        xp: 50,
        unlocked: data =>
            data.challengeDays >= 1
    },

    {
        id: "ten_challenge_days",
        xp: 100,
        unlocked: data =>
            data.challengeDays >= 10
    },

    {
        id: "twenty_five_challenge_days",
        xp: 200,
        unlocked: data =>
            data.challengeDays >= 25
    },

    {
        id: "one_hundred_activity_minutes",
        xp: 50,
        unlocked: data =>
            data.totalActivityMinutes >= 100
    },

    {
        id: "five_hundred_activity_minutes",
        xp: 100,
        unlocked: data =>
            data.totalActivityMinutes >= 500
    },

    {
        id: "one_thousand_activity_minutes",
        xp: 200,
        unlocked: data =>
            data.totalActivityMinutes >= 1000
    },

    {
        id: "ten_active_days",
        xp: 100,
        unlocked: data =>
            data.activeDays >= 10
    },

    {
        id: "thirty_active_days",
        xp: 200,
        unlocked: data =>
            data.activeDays >= 30
    },

    {
        id: "fifty_active_days",
        xp: 200,
        unlocked: data =>
            data.activeDays >= 50
    },

    {
        id: "one_hundred_active_days",
        xp: 500,
        unlocked: data =>
            data.activeDays >= 100
    }

];


// ==================================================
// חישוב סטטיסטיקות
// ==================================================

function calculateXPStats() {

    const data =
        loadXPData();


    const dietData =
        data.dietData;

    const foodData =
        data.foodData;

    const activityData =
        data.activityData;

    const finishDayData =
        data.finishDayData;


    const allDateKeys =
        new Set([

            ...Object.keys(dietData),
            ...Object.keys(foodData),
            ...Object.keys(activityData),
            ...Object.keys(finishDayData)

        ]);


    let activeDays = 0;
    let perfectDays = 0;
    let calorieSuccessDays = 0;
    let activitySuccessDays = 0;
    let challengeDays = 0;
    let finishedDays = 0;
    let totalActivityMinutes = 0;


    allDateKeys.forEach(
        dateKey => {

            const day =
                dietData[dateKey] || {};


            const calories =
                getXPCalories(
                    foodData,
                    dateKey
                );


            const activityMinutes =
                getXPActivity(
                    activityData,
                    dateKey
                );


            const foodSuccess =
                (
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= 1500
                );


            const activitySuccess =
                activityMinutes >= 20;


            const challengeSuccess =
                day.challenge === true;


            if (
                calories > 0 ||
                activityMinutes > 0 ||
                challengeSuccess
            ) {

                activeDays++;

            }


            if (foodSuccess) {

                calorieSuccessDays++;

            }


            if (activitySuccess) {

                activitySuccessDays++;

            }


            if (challengeSuccess) {

                challengeDays++;

            }


            if (
                finishDayData[dateKey] &&
                finishDayData[dateKey].finished === true
            ) {

                finishedDays++;

            }


            if (
                foodSuccess &&
                activitySuccess &&
                challengeSuccess
            ) {

                perfectDays++;

            }


            totalActivityMinutes +=
                activityMinutes;

        }
    );


    // ----------------------------------------------
    // רצף
    // ----------------------------------------------

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


    const today =
        new Date(

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


    function isPerfectDay(dateKey) {

        const day =
            dietData[dateKey] || {};


        const calories =
            getXPCalories(
                foodData,
                dateKey
            );


        const activityMinutes =
            getXPActivity(
                activityData,
                dateKey
            );


        return (

            finishDayData[dateKey] &&
            finishDayData[dateKey].finished === true &&
            calories <= 1500 &&
            activityMinutes >= 20 &&
            day.challenge === true

        );

    }


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


    return {

        activeDays,
        perfectDays,
        calorieSuccessDays,
        activitySuccessDays,
        challengeDays,
        finishedDays,
        totalActivityMinutes,
        currentStreak

    };

}


// ==================================================
// XP ממשימות
// ==================================================

function calculateTaskXP() {

    const data =
        loadXPData();


    const dietData =
        data.dietData;

    const foodData =
        data.foodData;

    const activityData =
        data.activityData;

    const finishDayData =
        data.finishDayData;


    const allDateKeys =
        new Set([

            ...Object.keys(dietData),
            ...Object.keys(foodData),
            ...Object.keys(activityData),
            ...Object.keys(finishDayData)

        ]);


    let totalXP = 0;


    allDateKeys.forEach(
        dateKey => {

            const day =
                dietData[dateKey] || {};


            const calories =
                getXPCalories(
                    foodData,
                    dateKey
                );


            const activityMinutes =
                getXPActivity(
                    activityData,
                    dateKey
                );


            const foodSuccess =
                (
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= 1500
                );


            const activitySuccess =
                activityMinutes >= 20;


            const challengeSuccess =
                day.challenge === true;


            let completedTasks = 0;


            if (foodSuccess) {

                totalXP +=
                    XP_CALORIE_SUCCESS;

                completedTasks++;

            }


            if (activitySuccess) {

                totalXP +=
                    XP_ACTIVITY_SUCCESS;

                completedTasks++;

            }


            if (challengeSuccess) {

                totalXP +=
                    XP_CHALLENGE_SUCCESS;

                completedTasks++;

            }


            if (
                completedTasks === 3
            ) {

                totalXP +=
                    XP_PERFECT_DAY_BONUS;

            }

        }
    );


    return totalXP;

}


// ==================================================
// XP של הישגים שהושגו כרגע
// ==================================================

function calculateCurrentAchievementXP() {

    const stats =
        calculateXPStats();


    let totalXP = 0;


    xpAchievements.forEach(
        achievement => {

            if (
                achievement.unlocked(
                    stats
                )
            ) {

                totalXP +=
                    achievement.xp;

            }

        }
    );


    return totalXP;

}


// ==================================================
// סך XP
// ==================================================

function calculateTotalXP() {

    const taskXP =
        calculateTaskXP();


    const achievementXP =
        calculateCurrentAchievementXP();


    return (
        taskXP +
        achievementXP
    );

}


// ==================================================
// רמות
// ==================================================

function getLevelInfo(xp) {

    const levels = [

        {
            threshold: 0,
            name: "מתחילה 🌱"
        },

        {
            threshold: 300,
            name: "בדרך 🌿"
        },

        {
            threshold: 700,
            name: "בתנועה 🌸"
        },

        {
            threshold: 1200,
            name: "מתקדמת ⭐"
        },

        {
            threshold: 1800,
            name: "מתחזקת 💪"
        },

        {
            threshold: 2500,
            name: "בתנופה 🔥"
        },

        {
            threshold: 3300,
            name: "נחושה 🌟"
        },

        {
            threshold: 4200,
            name: "מתמידה 🏃"
        },

        {
            threshold: 5200,
            name: "מצטיינת 🏅"
        },

        {
            threshold: 6300,
            name: "אלופה 🥇"
        },

        {
            threshold: 7500,
            name: "חזקה 💎"
        },

        {
            threshold: 8800,
            name: "פורצת קדימה 🚀"
        },

        {
            threshold: 10200,
            name: "מובילה 👑"
        },

        {
            threshold: 11700,
            name: "מעוררת השראה 🌈"
        },

        {
            threshold: 13300,
            name: "אלופה אמיתית 🏆"
        },

        {
            threshold: 15000,
            name: "בלתי ניתנת לעצירה 🔥"
        },

        {
            threshold: 17000,
            name: "אגדה 💫"
        },

        {
            threshold: 19500,
            name: "אגדית 👑"
        },

        {
            threshold: 22500,
            name: "עילית 💎"
        },

        {
            threshold: 26000,
            name: "המטרה בידיים שלך 🌟"
        }

    ];


    let currentIndex = 0;


    for (
        let i = 0;
        i < levels.length;
        i++
    ) {

        if (
            xp >= levels[i].threshold
        ) {

            currentIndex =
                i;

        } else {

            break;

        }

    }


    const currentLevel =
        levels[currentIndex];


    const nextLevel =
        levels[
            currentIndex + 1
        ];


    const previousThreshold =
        currentLevel.threshold;


    const nextThreshold =
        nextLevel
            ? nextLevel.threshold
            : previousThreshold + 5000;


    return {

        level:
            currentIndex + 1,

        levelName:
            currentLevel.name,

        previousThreshold,

        nextThreshold

    };

}


// ==================================================
// עדכון התצוגה
// ==================================================

function updateXPDisplay() {

    const totalXP =
        calculateTotalXP();


    const levelInfo =
        getLevelInfo(
            totalXP
        );


    if (xpTotalElement) {

        xpTotalElement.textContent =
            `${totalXP} XP`;

    }


    if (xpLevelElement) {

        xpLevelElement.textContent =
            `רמה ${levelInfo.level}`;

    }


    if (xpLevelNameElement) {

        xpLevelNameElement.textContent =
            levelInfo.levelName;

    }


    const xpIntoLevel =
        totalXP -
        levelInfo.previousThreshold;


    const levelRange =
        levelInfo.nextThreshold -
        levelInfo.previousThreshold;


    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    (
                        xpIntoLevel /
                        levelRange
                    ) * 100
                )
            )
        );


    if (xpProgressFill) {

        xpProgressFill.style.width =
            `${percentage}%`;

    }


    if (xpProgressText) {

        xpProgressText.textContent =
            `${xpIntoLevel} / ${levelRange} XP`;

    }


    localStorage.setItem(
        "totalXP",
        String(totalXP)
    );

}


// ==================================================
// רענון
// ==================================================

function refreshXP() {

    updateXPDisplay();

}


// ==================================================
// הפעלה
// ==================================================

updateXPDisplay();


// ==================================================
// אירוע שינוי
// ==================================================

window.addEventListener(
    "xpDataChanged",
    refreshXP
);


// ==================================================
// בדיקה אוטומטית
// ==================================================

setInterval(
    refreshXP,
    300
);
