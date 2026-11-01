// ==================================================
// הגדרות
// ==================================================

function getNotifierCalorieTarget() {

    return typeof DAILY_CALORIE_TARGET !== "undefined"
        ? DAILY_CALORIE_TARGET
        : 1400;

}


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
                localStorage.getItem("dietData")
            ) || {},

        foodData:
            JSON.parse(
                localStorage.getItem("foodData")
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

function notifierGetCalories(foodData, dateKey) {

    const foods =
        foodData[dateKey] || [];


    return foods.reduce(
        (total, food) =>
            total + Number(food.calories || 0),
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
            parts.find(x => x.type === "year").value
        );

    let month =
        Number(
            parts.find(x => x.type === "month").value
        ) - 1;

    let day =
        Number(
            parts.find(x => x.type === "day").value
        );


    const hour =
        Number(
            parts.find(x => x.type === "hour").value
        );


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


    return new Date(year, month, day);

}


function notifierDateKey(date) {

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );

}


// ==================================================
// יום מושלם
// ==================================================

function notifierIsPerfectDay(
    dateKey,
    dietData,
    foodData,
    finishDayData
) {

    const calories =
        notifierGetCalories(
            foodData,
            dateKey
        );


    const finished =
        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true;


    return (
        finished &&
        calories <= getNotifierCalorieTarget()
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

    const finishDayData =
        data.finishDayData;


    const allDateKeys =
        new Set([

            ...Object.keys(dietData),
            ...Object.keys(foodData),
            ...Object.keys(finishDayData)

        ]);


    let activeDays = 0;
    let perfectDays = 0;
    let calorieSuccessDays = 0;
    let finishedDays = 0;


    allDateKeys.forEach(dateKey => {

        const calories =
            notifierGetCalories(
                foodData,
                dateKey
            );


        const finished =
            finishDayData[dateKey] &&
            finishDayData[dateKey].finished === true;


        const foodSuccess =
            !!(
                finished &&
                calories <= getNotifierCalorieTarget()
            );


        if (calories > 0) {

            activeDays++;

        }


        if (foodSuccess) {

            calorieSuccessDays++;
            perfectDays++;

        }


        if (finished) {

            finishedDays++;

        }

    });


    // ----------------------------------------------
    // רצף ימים מושלמים
    // ----------------------------------------------

    let checkDate =
        getSiteToday();


    let currentStreak = 0;


    while (
        notifierIsPerfectDay(
            notifierDateKey(checkDate),
            dietData,
            foodData,
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
        finishedDays,
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
        document.createElement("div");


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


    document.body.appendChild(popup);


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

            if (event.target === popup) {

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
        popup.classList.contains("show")
    );

}


// ==================================================
// הצגת ההישג הבא
// ==================================================

function showNextAchievement() {

    if (achievementQueue.length === 0) {
        return;
    }


    if (isAchievementPopupOpen()) {
        return;
    }


    const achievement =
        achievementQueue.shift();


    showGlobalAchievement(achievement);

}


// ==================================================
// הצגת הישג
// ==================================================

function showGlobalAchievement(achievement) {

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


    popup.classList.add("show");

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


    popup.classList.remove("show");


    setTimeout(
        () => {

            showNextAchievement();

        },
        250
    );

}


// ==================================================
// בדיקת הישגים
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


function saveAchievementSnapshot(snapshot) {

    localStorage.setItem(
        ACHIEVEMENT_SNAPSHOT_KEY,
        JSON.stringify(snapshot)
    );

}


// ==================================================
// כרטיסי הישגים
// ==================================================

function updateAchievementCards(unlockedAchievements) {

    const cards =
        document.querySelectorAll(
            ".achievement-card"
        );


    cards.forEach(card => {

        const title =
            card.querySelector(
                ".achievement-info h3"
            );


        if (!title) {
            return;
        }


        const achievement =
            (
                typeof achievementCatalog !== "undefined"
            )
                ? achievementCatalog.find(
                    item =>
                        item.name === title.textContent.trim()
                )
                : null;


        if (!achievement) {
            return;
        }


        const unlocked =
            unlockedAchievements.some(
                item => item.id === achievement.id
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

    });

}


// ==================================================
// בדיקת הישגים חדשים
// ==================================================

function checkForNewAchievements() {

    if (
        typeof achievementCatalog === "undefined"
    ) {

        return;

    }


    const stats =
        calculateNotifierStats();


    const previousSnapshot =
        getAchievementSnapshot();


    const currentSnapshot = {};

    const currentlyUnlocked = [];

    const newlyUnlocked = [];


    achievementCatalog.forEach(achievement => {

        const unlocked =
            achievement.unlocked(stats);


        currentSnapshot[achievement.id] =
            unlocked;


        if (unlocked) {

            currentlyUnlocked.push(achievement);

        }


        const wasUnlocked =
            previousSnapshot[achievement.id] === true;


        if (unlocked && !wasUnlocked) {

            newlyUnlocked.push(achievement);

        }

    });


    updateAchievementCards(
        currentlyUnlocked
    );


    saveAchievementSnapshot(
        currentSnapshot
    );


    if (newlyUnlocked.length > 0) {

        newlyUnlocked.forEach(achievement => {

            const alreadyQueued =
                achievementQueue.some(
                    item => item.id === achievement.id
                );


            if (!alreadyQueued) {

                achievementQueue.push(achievement);

            }

        });


        showNextAchievement();

    }

}


// ==================================================
// אתחול
// ==================================================

if (
    typeof achievementCatalog !== "undefined"
) {

    const existingSnapshot =
        localStorage.getItem(
            ACHIEVEMENT_SNAPSHOT_KEY
        );


    if (!existingSnapshot) {

        const stats =
            calculateNotifierStats();


        const initialSnapshot = {};


        achievementCatalog.forEach(achievement => {

            initialSnapshot[achievement.id] =
                achievement.unlocked(stats);

        });


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