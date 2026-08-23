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
        ) =>
            total +
            Number(
                activity.minutes || 0
            ),
        0
    );

}


// ==================================================
// סטטיסטיקות
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
                !!(
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= 1800
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


            if (foodSuccess)
                calorieSuccessDays++;

            if (activitySuccess)
                activitySuccessDays++;

            if (challengeSuccess)
                challengeDays++;

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
    // רצף לפי יום האתר
    // ----------------------------------------------

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


    let checkDate =
        new Date(
            year,
            month,
            day
        );


    function getDateKey(
        date
    ) {

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


    function isPerfectDay(
        key
    ) {

        const dayData =
            dietData[key] || {};


        const calories =
            getXPCalories(
                foodData,
                key
            );


        const activityMinutes =
            getXPActivity(
                activityData,
                key
            );


        return !!(
            finishDayData[key] &&
            finishDayData[key].finished === true &&
            calories <= 1800 &&
            activityMinutes >= 20 &&
            dayData.challenge === true
        );

    }


    let currentStreak = 0;


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
                !!(
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= 1800
                );


            const activitySuccess =
                activityMinutes >= 20;


            const challengeSuccess =
                day.challenge === true;


            let tasks = 0;


            if (foodSuccess) {

                totalXP +=
                    XP_CALORIE_SUCCESS;

                tasks++;

            }


            if (activitySuccess) {

                totalXP +=
                    XP_ACTIVITY_SUCCESS;

                tasks++;

            }


            if (challengeSuccess) {

                totalXP +=
                    XP_CHALLENGE_SUCCESS;

                tasks++;

            }


            if (tasks === 3) {

                totalXP +=
                    XP_PERFECT_DAY_BONUS;

            }

        }
    );


    return totalXP;

}


// ==================================================
// XP הישגים
// ==================================================

function calculateCurrentAchievementXP() {

    if (
        typeof achievementCatalog ===
        "undefined"
    ) {

        return 0;

    }


    const stats =
        calculateXPStats();


    return achievementCatalog.reduce(
        (
            total,
            achievement
        ) => {

            return (
                total +
                (
                    achievement.unlocked(stats)
                        ? Number(
                            achievement.xp || 0
                        )
                        : 0
                )
            );

        },
        0
    );

}


// ==================================================
// סך הכול
// ==================================================

function calculateTotalXP() {

    return (
        calculateTaskXP() +
        calculateCurrentAchievementXP()
    );

}


// ==================================================
// רמות
// ==================================================

function getLevelInfo(
    xp
) {

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

        }
        else {

            break;

        }

    }


    const current =
        levels[currentIndex];


    const next =
        levels[
            currentIndex + 1
        ];


    return {

        level:
            currentIndex + 1,

        levelName:
            current.name,

        previousThreshold:
            current.threshold,

        nextThreshold:
            next
                ? next.threshold
                : current.threshold + 5000

    };

}


// ==================================================
// תצוגה
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


window.addEventListener(
    "xpDataChanged",
    refreshXP
);


setInterval(
    refreshXP,
    300
);