// ==================================================
// הגדרות
// ==================================================

const NOTIFIER_CALORIE_TARGET = 1800;
const NOTIFIER_ACTIVITY_TARGET = 20;


// ==================================================
// רשימת ההישגים
// ==================================================

const notifierAchievements = [

    {
        id: "first_active_day",
        icon: "🌱",
        name: "הצעד הראשון",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 1
    },

    {
        id: "first_finished_day",
        icon: "🎯",
        name: "סיימתי יום",
        xp: 50,
        unlocked: data =>
            data.finishedDays >= 1
    },

    {
        id: "three_active_days",
        icon: "🥳",
        name: "התחלה טובה",
        xp: 50,
        unlocked: data =>
            data.activeDays >= 3
    },

    {
        id: "three_perfect_streak",
        icon: "🔥",
        name: "מתחילים להתחמם",
        xp: 100,
        unlocked: data =>
            data.currentStreak >= 3
    },

    {
        id: "seven_perfect_streak",
        icon: "🌟",
        name: "שבוע שלם",
        xp: 200,
        unlocked: data =>
            data.currentStreak >= 7
    },

    {
        id: "fourteen_perfect_streak",
        icon: "💪",
        name: "שבועיים ברצף",
        xp: 200,
        unlocked: data =>
            data.currentStreak >= 14
    },

    {
        id: "thirty_perfect_streak",
        icon: "🏆",
        name: "חודש חזק",
        xp: 500,
        unlocked: data =>
            data.currentStreak >= 30
    },

    {
        id: "five_perfect_days",
        icon: "⭐",
        name: "5 ימים מושלמים",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 5
    },

    {
        id: "ten_perfect_days",
        icon: "🌟",
        name: "10 ימים מושלמים",
        xp: 100,
        unlocked: data =>
            data.perfectDays >= 10
    },

    {
        id: "twenty_perfect_days",
        icon: "🏅",
        name: "20 ימים מושלמים",
        xp: 200,
        unlocked: data =>
            data.perfectDays >= 20
    },

    {
        id: "thirty_perfect_days",
        icon: "🥇",
        name: "30 ימים מושלמים",
        xp: 200,
        unlocked: data =>
            data.perfectDays >= 30
    },

    {
        id: "fifty_perfect_days",
        icon: "💎",
        name: "50 ימים מושלמים",
        xp: 500,
        unlocked: data =>
            data.perfectDays >= 50
    },

    {
        id: "one_hundred_perfect_days",
        icon: "👑",
        name: "100 ימים מושלמים",
        xp: 500,
        unlocked: data =>
            data.perfectDays >= 100
    },

    {
        id: "first_activity_day",
        icon: "🏃",
        name: "מתחילים לזוז",
        xp: 50,
        unlocked: data =>
            data.activitySuccessDays >= 1
    },

    {
        id: "ten_activity_days",
        icon: "⚡",
        name: "10 אימונים מוצלחים",
        xp: 100,
        unlocked: data =>
            data.activitySuccessDays >= 10
    },

    {
        id: "twenty_five_activity_days",
        icon: "🏃‍♀️",
        name: "25 ימי תנועה",
        xp: 200,
        unlocked: data =>
            data.activitySuccessDays >= 25
    },

    {
        id: "first_calorie_success",
        icon: "🍎",
        name: "בשליטה",
        xp: 50,
        unlocked: data =>
            data.calorieSuccessDays >= 1
    },

    {
        id: "ten_calorie_success",
        icon: "🥗",
        name: "10 ימים בשליטה",
        xp: 100,
        unlocked: data =>
            data.calorieSuccessDays >= 10
    },

    {
        id: "twenty_five_calorie_success",
        icon: "🌿",
        name: "25 ימים בשליטה",
        xp: 200,
        unlocked: data =>
            data.calorieSuccessDays >= 25
    },

    {
        id: "first_challenge_day",
        icon: "🎯",
        name: "אתגר ראשון",
        xp: 50,
        unlocked: data =>
            data.challengeDays >= 1
    },

    {
        id: "ten_challenge_days",
        icon: "🔥",
        name: "10 ימי אתגר",
        xp: 100,
        unlocked: data =>
            data.challengeDays >= 10
    },

    {
        id: "twenty_five_challenge_days",
        icon: "🏆",
        name: "25 ימי אתגר",
        xp: 200,
        unlocked: data =>
            data.challengeDays >= 25
    },

    {
        id: "one_hundred_activity_minutes",
        icon: "⏱️",
        name: "100 דקות",
        xp: 50,
        unlocked: data =>
            data.totalActivityMinutes >= 100
    },

    {
        id: "five_hundred_activity_minutes",
        icon: "🚀",
        name: "500 דקות",
        xp: 100,
        unlocked: data =>
            data.totalActivityMinutes >= 500
    },

    {
        id: "one_thousand_activity_minutes",
        icon: "🌈",
        name: "1000 דקות",
        xp: 200,
        unlocked: data =>
            data.totalActivityMinutes >= 1000
    },

    {
        id: "ten_active_days",
        icon: "📅",
        name: "10 ימים פעילים",
        xp: 100,
        unlocked: data =>
            data.activeDays >= 10
    },

    {
        id: "thirty_active_days",
        icon: "📅",
        name: "30 ימים פעילים",
        xp: 200,
        unlocked: data =>
            data.activeDays >= 30
    },

    {
        id: "fifty_active_days",
        icon: "🌸",
        name: "50 ימים פעילים",
        xp: 200,
        unlocked: data =>
            data.activeDays >= 50
    },

    {
        id: "one_hundred_active_days",
        icon: "👑",
        name: "100 ימים פעילים",
        xp: 500,
        unlocked: data =>
            data.activeDays >= 100
    }

];


// ==================================================
// טעינת נתונים
// ==================================================

function loadNotifierData() {

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

function notifierGetCalories(
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
            Number(food.calories),
        0
    );

}


// ==================================================
// פעילות
// ==================================================

function notifierGetActivity(
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
            Number(activity.minutes),
        0
    );

}


// ==================================================
// תאריך ישראל
// ==================================================

function notifierToday() {

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


function notifierDateKey(date) {

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
// יום מושלם
// ==================================================

function notifierIsPerfectDay(
    dateKey,
    dietData,
    foodData,
    activityData,
    finishDayData
) {

    const day =
        dietData[dateKey] || {};

    const calories =
        notifierGetCalories(
            foodData,
            dateKey
        );

    const activityMinutes =
        notifierGetActivity(
            activityData,
            dateKey
        );

    const foodSuccess =
        !!(
            finishDayData[dateKey] &&
            finishDayData[dateKey].finished === true &&
            calories <= NOTIFIER_CALORIE_TARGET
        );

    const activitySuccess =
        activityMinutes >=
        NOTIFIER_ACTIVITY_TARGET;

    const challengeSuccess =
        day.challenge === true;


    return (
        foodSuccess &&
        activitySuccess &&
        challengeSuccess
    );

}


// ==================================================
// סטטיסטיקות
// ==================================================

function calculateNotifierStats() {

    const data =
        loadNotifierData();

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
                notifierGetCalories(
                    foodData,
                    dateKey
                );

            const activityMinutes =
                notifierGetActivity(
                    activityData,
                    dateKey
                );

            const foodSuccess =
                !!(
                    finishDayData[dateKey] &&
                    finishDayData[dateKey].finished === true &&
                    calories <= NOTIFIER_CALORIE_TARGET
                );

            const activitySuccess =
                activityMinutes >=
                NOTIFIER_ACTIVITY_TARGET;

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
        notifierToday();


    let currentStreak = 0;


    let checkDate =
        new Date(today);


    while (
        notifierIsPerfectDay(
            notifierDateKey(checkDate),
            dietData,
            foodData,
            activityData,
            finishDayData
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
// יצירת חלונית
// ==================================================

function createAchievementPopup() {

    let popup =
        document.getElementById(
            "globalAchievementPopup"
        );


    if (popup) {

        return popup;

    }


    popup =
        document.createElement(
            "div"
        );


    popup.id =
        "globalAchievementPopup";

    popup.className =
        "achievement-popup";


    popup.innerHTML = `

        <div class="achievement-popup-content">

            <button
                id="globalAchievementClose"
                class="achievement-popup-close"
                type="button">

                ×

            </button>


            <div
                id="globalAchievementIcon"
                class="achievement-popup-icon">
            </div>


            <div class="achievement-popup-title">

                הישג חדש! 🎉

            </div>


            <div
                id="globalAchievementName"
                class="achievement-popup-name">
            </div>


            <div
                id="globalAchievementText"
                class="achievement-popup-text">
            </div>


            <button
                id="globalAchievementButton"
                class="achievement-popup-button"
                type="button">

                איזה כיף! 🎉

            </button>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    // כפתור X

    document.getElementById(
        "globalAchievementClose"
    ).addEventListener(
        "click",
        handleAchievementClose
    );


    // כפתור אישור

    document.getElementById(
        "globalAchievementButton"
    ).addEventListener(
        "click",
        handleAchievementClose
    );


    // לחיצה על הרקע

    popup.addEventListener(
        "click",
        event => {

            if (
                event.target === popup
            ) {

                handleAchievementClose();

            }

        }
    );


    return popup;

}


// ==================================================
// תור הישגים
// ==================================================

let achievementQueue = [];


// ==================================================
// האם חלונית פתוחה
// ==================================================

function isAchievementPopupOpen() {

    const popup =
        document.getElementById(
            "globalAchievementPopup"
        );


    return !!(
        popup &&
        popup.classList.contains("show")
    );

}


// ==================================================
// הצגת הישג מהתור
// ==================================================

function showNextAchievement() {

    if (
        achievementQueue.length === 0
    ) {

        return;

    }


    if (
        isAchievementPopupOpen()
    ) {

        return;

    }


    const achievement =
        achievementQueue.shift();


    showGlobalAchievement(
        achievement
    );

}


// ==================================================
// הצגת הישג
// ==================================================

function showGlobalAchievement(
    achievement
) {

    const popup =
        createAchievementPopup();


    const icon =
        document.getElementById(
            "globalAchievementIcon"
        );

    const name =
        document.getElementById(
            "globalAchievementName"
        );

    const text =
        document.getElementById(
            "globalAchievementText"
        );


    if (icon) {

        icon.textContent =
            achievement.icon;

    }


    if (name) {

        name.textContent =
            achievement.name;

    }


    if (text) {

        text.innerHTML = `

            כל הכבוד! כל צעד קטן מביא אותך קדימה 🌸

            <br>

            <strong>
                +${achievement.xp} XP
            </strong>

        `;

    }


    popup.classList.add(
        "show"
    );

}


// ==================================================
// סגירת חלונית
// ==================================================

function handleAchievementClose() {

    const popup =
        document.getElementById(
            "globalAchievementPopup"
        );


    if (!popup) {

        return;

    }


    popup.classList.remove(
        "show"
    );


    // מחכים שהחלונית תיעלם
    // ואז פותחים את ההישג הבא

    setTimeout(
        () => {

            showNextAchievement();

        },
        250
    );

}


// ==================================================
// עדכון כרטיסי ההישגים
// ==================================================

function updateAchievementCards(
    unlockedAchievements
) {

    const cards =
        document.querySelectorAll(
            ".achievement-card"
        );


    cards.forEach(
        card => {

            const title =
                card.querySelector(
                    ".achievement-info h3"
                );


            if (!title) {

                return;

            }


            const achievement =
                notifierAchievements.find(
                    item =>
                        item.name ===
                        title.textContent.trim()
                );


            if (!achievement) {

                return;

            }


            const unlocked =
                unlockedAchievements.some(
                    item =>
                        item.id ===
                        achievement.id
                );


            if (!unlocked) {

                return;

            }


            card.classList.remove(
                "locked"
            );


            card.classList.add(
                "unlocked"
            );


            const icon =
                card.querySelector(
                    ".achievement-icon"
                );


            if (icon) {

                icon.textContent =
                    achievement.icon;

            }


            const status =
                card.querySelector(
                    ".achievement-status"
                );


            if (status) {

                status.textContent =
                    "✓ הושג";

            }

        }
    );

}


// ==================================================
// צילום מצב
// ==================================================

const ACHIEVEMENT_SNAPSHOT_KEY =
    "achievementSnapshotV5";


function getAchievementSnapshot() {

    return JSON.parse(
        localStorage.getItem(
            ACHIEVEMENT_SNAPSHOT_KEY
        )
    ) || {};

}


function saveAchievementSnapshot(
    snapshot
) {

    localStorage.setItem(
        ACHIEVEMENT_SNAPSHOT_KEY,
        JSON.stringify(
            snapshot
        )
    );

}


// ==================================================
// בדיקת הישגים
// ==================================================

function checkForNewAchievements() {

    const stats =
        calculateNotifierStats();


    const previousSnapshot =
        getAchievementSnapshot();


    const currentSnapshot =
        {};


    const currentlyUnlocked =
        [];


    const newlyUnlocked =
        [];


    notifierAchievements.forEach(
        achievement => {

            const unlocked =
                achievement.unlocked(
                    stats
                );


            currentSnapshot[
                achievement.id
            ] =
                unlocked;


            if (unlocked) {

                currentlyUnlocked.push(
                    achievement
                );

            }


            const wasUnlocked =
                previousSnapshot[
                    achievement.id
                ] === true;


            if (
                unlocked &&
                !wasUnlocked
            ) {

                newlyUnlocked.push(
                    achievement
                );

            }

        }
    );


    // מעדכנים את הכרטיסים

    updateAchievementCards(
        currentlyUnlocked
    );


    // שומרים צילום מצב

    saveAchievementSnapshot(
        currentSnapshot
    );


    // ----------------------------------------------
    // הוספת הישגים חדשים לתור
    // ----------------------------------------------

    if (
        newlyUnlocked.length > 0
    ) {

        // לא להוסיף הישג שכבר נמצא בתור

        newlyUnlocked.forEach(
            achievement => {

                const alreadyQueued =
                    achievementQueue.some(
                        item =>
                            item.id ===
                            achievement.id
                    );


                if (
                    !alreadyQueued
                ) {

                    achievementQueue.push(
                        achievement
                    );

                }

            }
        );


        // אם אין כרגע חלונית
        // מציגים מיד את הראשון

        showNextAchievement();

    }

}


// ==================================================
// אתחול
// ==================================================

const existingSnapshot =
    localStorage.getItem(
        ACHIEVEMENT_SNAPSHOT_KEY
    );


if (!existingSnapshot) {

    const stats =
        calculateNotifierStats();


    const initialSnapshot =
        {};


    notifierAchievements.forEach(
        achievement => {

            initialSnapshot[
                achievement.id
            ] =
                achievement.unlocked(
                    stats
                );

        }
    );


    saveAchievementSnapshot(
        initialSnapshot
    );

}
else {

    checkForNewAchievements();

}


// ==================================================
// בדיקה רציפה
// ==================================================

setInterval(
    checkForNewAchievements,
    300
);