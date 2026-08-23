// ==================================================
// הגדרות
// ==================================================

const NOTIFIER_CALORIE_TARGET = 1800;
const NOTIFIER_ACTIVITY_TARGET = 20;


// ==================================================
// תור הישגים
// ==================================================

let achievementQueue = [];


// ==================================================
// טעינת נתונים
// ==================================================

function loadNotifierData() {

    return {

        dietData:
            JSON.parse(
                localStorage.getItem(
                    "dietData"
                )
            ) || {},

        foodData:
            JSON.parse(
                localStorage.getItem(
                    "foodData"
                )
            ) || {},

        activityData:
            JSON.parse(
                localStorage.getItem(
                    "activityData"
                )
            ) || {},

        finishDayData:
            JSON.parse(
                localStorage.getItem(
                    "finishDayData"
                )
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
            Number(food.calories || 0),
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
            Number(activity.minutes || 0),
        0
    );

}


// ==================================================
// יום האתר
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


function notifierDateKey(
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
    // רצף
    // ----------------------------------------------

    let checkDate =
        getSiteToday();


    let currentStreak = 0;


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


    document.getElementById(
        "globalAchievementClose"
    ).addEventListener(
        "click",
        handleAchievementClose
    );


    document.getElementById(
        "globalAchievementButton"
    ).addEventListener(
        "click",
        handleAchievementClose
    );


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
// האם חלונית פתוחה
// ==================================================

function isAchievementPopupOpen() {

    const popup =
        document.getElementById(
            "globalAchievementPopup"
        );


    return !!(
        popup &&
        popup.classList.contains(
            "show"
        )
    );

}


// ==================================================
// הבא
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
            achievement.icon || "🏆";

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
// סגירה
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


    setTimeout(
        () => {

            showNextAchievement();

        },
        250
    );

}


// ==================================================
// בדיקה
// ==================================================

const ACHIEVEMENT_SNAPSHOT_KEY =
    "achievementSnapshotV6";


function getAchievementSnapshot() {

    return (
        JSON.parse(
            localStorage.getItem(
                ACHIEVEMENT_SNAPSHOT_KEY
            )
        ) || {}
    );

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
// כרטיסי הישגים
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
                (
                    typeof achievementCatalog !==
                    "undefined"
                )
                    ? achievementCatalog.find(
                        item =>
                            item.name ===
                            title.textContent.trim()
                    )
                    : null;


            if (!achievement) {
                return;
            }


            const unlocked =
                unlockedAchievements.some(
                    item =>
                        item.id ===
                        achievement.id
                );


            card.classList.toggle(
                "locked",
                !unlocked
            );

            card.classList.toggle(
                "unlocked",
                unlocked
            );


            const icon =
                card.querySelector(
                    ".achievement-icon"
                );


            if (icon) {

                icon.textContent =
                    unlocked
                        ? achievement.icon
                        : "🔒";

            }


            const status =
                card.querySelector(
                    ".achievement-status"
                );


            if (status) {

                status.textContent =
                    unlocked
                        ? "✓ הושג"
                        : "עוד לא הושג";

            }

        }
    );

}


// ==================================================
// בדיקת הישגים
// ==================================================

function checkForNewAchievements() {

    if (
        typeof achievementCatalog ===
        "undefined"
    ) {

        return;

    }


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


    achievementCatalog.forEach(
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


    updateAchievementCards(
        currentlyUnlocked
    );


    saveAchievementSnapshot(
        currentSnapshot
    );


    if (
        newlyUnlocked.length > 0
    ) {

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


        showNextAchievement();

    }

}


// ==================================================
// אתחול
// ==================================================

if (
    typeof achievementCatalog !==
    "undefined"
) {

    const existingSnapshot =
        localStorage.getItem(
            ACHIEVEMENT_SNAPSHOT_KEY
        );


    if (!existingSnapshot) {

        const stats =
            calculateNotifierStats();


        const initialSnapshot =
            {};


        achievementCatalog.forEach(
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

}


// ==================================================
// בדיקה רציפה
// ==================================================

setInterval(
    checkForNewAchievements,
    300
);