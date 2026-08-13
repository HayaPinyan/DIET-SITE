// ==================================================
// אלמנטים
// ==================================================

const achievementsGrid =
    document.getElementById("achievementsGrid");


// ==================================================
// הגדרות
// ==================================================

const CALORIE_TARGET = 1800;
const ACTIVITY_TARGET = 20;


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
        (total, food) => {

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

function getActivityMinutes(dateKey) {

    const activities =
        activityData[dateKey] || [];

    return activities.reduce(
        (total, activity) => {

            return (
                total +
                Number(activity.minutes || 0)
            );

        },
        0
    );

}


// ==================================================
// תאריך ישראל
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


    const year =
        Number(
            parts.find(
                item => item.type === "year"
            ).value
        );


    const month =
        Number(
            parts.find(
                item => item.type === "month"
            ).value
        ) - 1;


    const day =
        Number(
            parts.find(
                item => item.type === "day"
            ).value
        );


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
// בדיקת יום מושלם
// ==================================================

function isPerfectDay(dateKey) {

    const day =
        dietData[dateKey] || {};


    const calories =
        getCalories(dateKey);


    const activityMinutes =
        getActivityMinutes(dateKey);


    const foodSuccess =
        !!(
            finishDayData[dateKey] &&
            finishDayData[dateKey].finished === true &&
            calories <= CALORIE_TARGET
        );


    const activitySuccess =
        activityMinutes >=
        ACTIVITY_TARGET;


    const challengeSuccess =
        day.challenge === true;


    return (
        foodSuccess &&
        activitySuccess &&
        challengeSuccess
    );

}


// ==================================================
// חישוב סטטיסטיקות
// ==================================================

function calculateStats() {

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
                getCalories(dateKey);


            const activityMinutes =
                getActivityMinutes(dateKey);


            const foodSuccess =
                !!(
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= CALORIE_TARGET
                );


            const activitySuccess =
                activityMinutes >=
                ACTIVITY_TARGET;


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

    const today =
        getIsraelToday();


    let currentStreak = 0;


    const checkDate =
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
// רשימת הישגים
// ==================================================
//
// הרשימה נמצאת כאן בכוונה, כדי שהדף
// לא יהיה תלוי בטעינה של achievement-data.js.
//

const achievements = [

    // ------------------------------------------------
    // התחלה
    // ------------------------------------------------

    {
        icon: "🌱",
        name: "הצעד הראשון",
        description: "היית פעילה ביום הראשון",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 1
    },

    {
        icon: "🎯",
        name: "סיימתי יום",
        description: "סימנת את היום הראשון כסיום",
        xp: 50,
        unlocked: data =>
            data.finishedDays >= 1
    },

    {
        icon: "🥳",
        name: "התחלה טובה",
        description: "השלמת 3 ימים פעילים",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 3
    },

    {
        icon: "🌼",
        name: "נכנסת לקצב",
        description: "השלמת 5 ימים פעילים",
        xp: 75,
        unlocked: data =>
            data.activeDays >= 5
    },

    {
        icon: "📅",
        name: "10 ימים",
        description: "השלמת 10 ימים פעילים",
        xp: 100,
        unlocked: data =>
            data.activeDays >= 10
    },

    {
        icon: "🌸",
        name: "30 ימים",
        description: "השלמת 30 ימים פעילים",
        xp: 200,
        unlocked: data =>
            data.activeDays >= 30
    },

    {
        icon: "💮",
        name: "60 ימים",
        description: "השלמת 60 ימים פעילים",
        xp: 300,
        unlocked: data =>
            data.activeDays >= 60
    },

    {
        icon: "👑",
        name: "100 ימים פעילים",
        description: "השלמת 100 ימים פעילים",
        xp: 500,
        unlocked: data =>
            data.activeDays >= 100
    },


    // ------------------------------------------------
    // סיום ימים
    // ------------------------------------------------

    {
        icon: "✅",
        name: "3 ימים שהושלמו",
        description: "סיימת 3 ימים",
        xp: 75,
        unlocked: data =>
            data.finishedDays >= 3
    },

    {
        icon: "🌟",
        name: "שבוע של סיום",
        description: "סיימת 7 ימים",
        xp: 100,
        unlocked: data =>
            data.finishedDays >= 7
    },

    {
        icon: "💪",
        name: "שבועיים של התמדה",
        description: "סיימת 14 ימים",
        xp: 150,
        unlocked: data =>
            data.finishedDays >= 14
    },

    {
        icon: "🏆",
        name: "30 ימים שהושלמו",
        description: "סיימת 30 ימים",
        xp: 250,
        unlocked: data =>
            data.finishedDays >= 30
    },

    {
        icon: "💎",
        name: "50 ימים שהושלמו",
        description: "סיימת 50 ימים",
        xp: 350,
        unlocked: data =>
            data.finishedDays >= 50
    },

    {
        icon: "👑",
        name: "100 ימים שהושלמו",
        description: "סיימת 100 ימים",
        xp: 600,
        unlocked: data =>
            data.finishedDays >= 100
    },


    // ------------------------------------------------
    // ימים מושלמים
    // ------------------------------------------------

    {
        icon: "⭐",
        name: "היום המושלם הראשון",
        description: "השלמת יום מושלם",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 1
    },

    {
        icon: "✨",
        name: "3 ימים מושלמים",
        description: "השלמת 3 ימים מושלמים",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 3
    },

    {
        icon: "🌟",
        name: "5 ימים מושלמים",
        description: "השלמת 5 ימים מושלמים",
        xp: 125,
        unlocked: data =>
            data.perfectDays >= 5
    },

    {
        icon: "🥇",
        name: "10 ימים מושלמים",
        description: "השלמת 10 ימים מושלמים",
        xp: 200,
        unlocked: data =>
            data.perfectDays >= 10
    },

    {
        icon: "🏅",
        name: "20 ימים מושלמים",
        description: "השלמת 20 ימים מושלמים",
        xp: 250,
        unlocked: data =>
            data.perfectDays >= 20
    },

    {
        icon: "🏆",
        name: "30 ימים מושלמים",
        description: "השלמת 30 ימים מושלמים",
        xp: 350,
        unlocked: data =>
            data.perfectDays >= 30
    },

    {
        icon: "💎",
        name: "50 ימים מושלמים",
        description: "השלמת 50 ימים מושלמים",
        xp: 500,
        unlocked: data =>
            data.perfectDays >= 50
    },

    {
        icon: "👑",
        name: "100 ימים מושלמים",
        description: "השלמת 100 ימים מושלמים",
        xp: 1000,
        unlocked: data =>
            data.perfectDays >= 100
    },


    // ------------------------------------------------
    // רצפים
    // ------------------------------------------------

    {
        icon: "🔥",
        name: "מתחילים להתחמם",
        description: "3 ימים מושלמים ברצף",
        xp: 100,
        unlocked: data =>
            data.currentStreak >= 3
    },

    {
        icon: "🔥",
        name: "שבוע של אש",
        description: "7 ימים מושלמים ברצף",
        xp: 200,
        unlocked: data =>
            data.currentStreak >= 7
    },

    {
        icon: "💪",
        name: "שבועיים ברצף",
        description: "14 ימים מושלמים ברצף",
        xp: 300,
        unlocked: data =>
            data.currentStreak >= 14
    },

    {
        icon: "🏆",
        name: "חודש רצוף",
        description: "30 ימים מושלמים ברצף",
        xp: 500,
        unlocked: data =>
            data.currentStreak >= 30
    },

    {
        icon: "💎",
        name: "60 ימים ברצף",
        description: "60 ימים מושלמים ברצף",
        xp: 750,
        unlocked: data =>
            data.currentStreak >= 60
    },


    // ------------------------------------------------
    // תזונה
    // ------------------------------------------------

    {
        icon: "🍎",
        name: "בשליטה",
        description: "עמדת ביעד הקלורי ביום אחד",
        xp: 50,
        unlocked: data =>
            data.calorieSuccessDays >= 1
    },

    {
        icon: "🥗",
        name: "5 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־5 ימים",
        xp: 75,
        unlocked: data =>
            data.calorieSuccessDays >= 5
    },

    {
        icon: "🍏",
        name: "10 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־10 ימים",
        xp: 100,
        unlocked: data =>
            data.calorieSuccessDays >= 10
    },

    {
        icon: "🥑",
        name: "20 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־20 ימים",
        xp: 200,
        unlocked: data =>
            data.calorieSuccessDays >= 20
    },

    {
        icon: "🥦",
        name: "30 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־30 ימים",
        xp: 250,
        unlocked: data =>
            data.calorieSuccessDays >= 30
    },

    {
        icon: "🌿",
        name: "50 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־50 ימים",
        xp: 400,
        unlocked: data =>
            data.calorieSuccessDays >= 50
    },


    // ------------------------------------------------
    // פעילות
    // ------------------------------------------------

    {
        icon: "🏃",
        name: "מתחילים לזוז",
        description: "השלמת את יעד 20 הדקות הראשון",
        xp: 50,
        unlocked: data =>
            data.activitySuccessDays >= 1
    },

    {
        icon: "👟",
        name: "5 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־5 ימים",
        xp: 75,
        unlocked: data =>
            data.activitySuccessDays >= 5
    },

    {
        icon: "⚡",
        name: "10 אימונים מוצלחים",
        description: "הגעת ליעד הפעילות ב־10 ימים",
        xp: 100,
        unlocked: data =>
            data.activitySuccessDays >= 10
    },

    {
        icon: "🏃‍♀️",
        name: "20 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־20 ימים",
        xp: 200,
        unlocked: data =>
            data.activitySuccessDays >= 20
    },

    {
        icon: "🔥",
        name: "30 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־30 ימים",
        xp: 250,
        unlocked: data =>
            data.activitySuccessDays >= 30
    },

    {
        icon: "🏅",
        name: "50 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־50 ימים",
        xp: 400,
        unlocked: data =>
            data.activitySuccessDays >= 50
    },


    // ------------------------------------------------
    // דקות
    // ------------------------------------------------

    {
        icon: "⏱️",
        name: "100 דקות",
        description: "צברת 100 דקות פעילות",
        xp: 50,
        unlocked: data =>
            data.totalActivityMinutes >= 100
    },

    {
        icon: "⌚",
        name: "250 דקות",
        description: "צברת 250 דקות פעילות",
        xp: 75,
        unlocked: data =>
            data.totalActivityMinutes >= 250
    },

    {
        icon: "🚀",
        name: "500 דקות",
        description: "צברת 500 דקות פעילות",
        xp: 100,
        unlocked: data =>
            data.totalActivityMinutes >= 500
    },

    {
        icon: "🌈",
        name: "1000 דקות",
        description: "צברת 1000 דקות פעילות",
        xp: 200,
        unlocked: data =>
            data.totalActivityMinutes >= 1000
    },

    {
        icon: "💫",
        name: "2000 דקות",
        description: "צברת 2000 דקות פעילות",
        xp: 300,
        unlocked: data =>
            data.totalActivityMinutes >= 2000
    },

    {
        icon: "👑",
        name: "5000 דקות",
        description: "צברת 5000 דקות פעילות",
        xp: 750,
        unlocked: data =>
            data.totalActivityMinutes >= 5000
    },


    // ------------------------------------------------
    // אתגרים
    // ------------------------------------------------

    {
        icon: "🎯",
        name: "אתגר ראשון",
        description: "השלמת אתגר ביום אחד",
        xp: 50,
        unlocked: data =>
            data.challengeDays >= 1
    },

    {
        icon: "🎯",
        name: "3 ימי אתגר",
        description: "השלמת אתגר ב־3 ימים",
        xp: 75,
        unlocked: data =>
            data.challengeDays >= 3
    },

    {
        icon: "🏆",
        name: "שבוע של אתגרים",
        description: "השלמת אתגר ב־7 ימים",
        xp: 100,
        unlocked: data =>
            data.challengeDays >= 7
    },

    {
        icon: "🔥",
        name: "14 ימי אתגר",
        description: "השלמת אתגר ב־14 ימים",
        xp: 150,
        unlocked: data =>
            data.challengeDays >= 14
    },

    {
        icon: "💎",
        name: "30 ימי אתגר",
        description: "השלמת אתגר ב־30 ימים",
        xp: 250,
        unlocked: data =>
            data.challengeDays >= 30
    },

    {
        icon: "👑",
        name: "50 ימי אתגר",
        description: "השלמת אתגר ב־50 ימים",
        xp: 400,
        unlocked: data =>
            data.challengeDays >= 50
    }

];


// ==================================================
// הצגת ההישגים
// ==================================================

function renderAchievements() {

    if (!achievementsGrid) {

        console.error(
            "לא נמצא achievementsGrid"
        );

        return;

    }


    const stats =
        calculateStats();


    achievementsGrid.innerHTML =
        "";


    achievements.forEach(
        achievement => {

            const unlocked =
                achievement.unlocked(
                    stats
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                unlocked
                    ? "achievement-card unlocked"
                    : "achievement-card locked";


            card.innerHTML = `

                <div class="achievement-icon">

                    ${
                        unlocked
                            ? achievement.icon
                            : "🔒"
                    }

                </div>


                <div class="achievement-info">

                    <h3>
                        ${achievement.name}
                    </h3>


                    <p>
                        ${achievement.description}
                    </p>


                    <div class="achievement-xp">
                        +${achievement.xp} XP
                    </div>


                    <div class="achievement-status">

                        ${
                            unlocked
                                ? "✓ הושג"
                                : "עוד לא הושג"
                        }

                    </div>

                </div>

            `;


            achievementsGrid.appendChild(
                card
            );

        }
    );

}


// ==================================================
// הפעלה
// ==================================================

renderAchievements();