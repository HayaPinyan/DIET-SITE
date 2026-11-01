
// ==================================================
// אלמנטים
// ==================================================

const achievementsGrid =
    document.getElementById("achievementsGrid");


// ==================================================
// הגדרות
// ==================================================

const CALORIE_TARGET =
    typeof DAILY_CALORIE_TARGET !== "undefined"
        ? DAILY_CALORIE_TARGET
        : 1400;


// ==================================================
// נתונים
// ==================================================

function loadAchievementData() {

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

function getCalories(
    foodData,
    dateKey
) {

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
// בדיקת יום מושלם
// ==================================================

function isPerfectDay(
    dateKey,
    foodData,
    finishDayData
) {

    const calories =
        getCalories(
            foodData,
            dateKey
        );

    const dayFinished =
        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true;


    return (
        dayFinished &&
        calories <= CALORIE_TARGET
    );

}


// ==================================================
// סטטיסטיקות
// ==================================================

function calculateStats() {

    const data =
        loadAchievementData();

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
            getCalories(
                foodData,
                dateKey
            );


        const dayFinished =
            finishDayData[dateKey] &&
            finishDayData[dateKey].finished === true;


        const foodSuccess =
            isPerfectDay(
                dateKey,
                foodData,
                finishDayData
            );


        // יום שבו הוזנו נתוני תזונה

        if (calories > 0) {

            activeDays++;

        }


        // יום שהושלם

        if (dayFinished) {

            finishedDays++;

        }


        // עמידה ביעד הקלורי

        if (foodSuccess) {

            calorieSuccessDays++;
            perfectDays++;

        }

    });


    // ==================================================
    // חישוב רצף ימים מושלמים
    // ==================================================

    let currentStreak = 0;

    let checkDate =
        getSiteToday();


    while (
        isPerfectDay(
            getDateKey(checkDate),
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
// ציור ההישגים
// ==================================================

function renderAchievements() {

    if (!achievementsGrid) {

        console.error(
            "לא נמצא achievementsGrid"
        );

        return;

    }


    // ממתינים לטעינת achievement-data.js

    if (
        typeof achievementCatalog === "undefined"
    ) {

        console.warn(
            "achievement-data.js עדיין לא נטען. מנסה שוב..."
        );

        setTimeout(
            renderAchievements,
            100
        );

        return;

    }


    const stats =
        calculateStats();


    achievementsGrid.innerHTML = "";


    achievementCatalog.forEach(achievement => {

        const unlocked =
            achievement.unlocked(stats);


        const card =
            document.createElement("div");


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
                    ${escapeHtml(
                        achievement.name
                    )}
                </h3>


                <p>
                    ${escapeHtml(
                        achievement.description
                    )}
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


        achievementsGrid.appendChild(card);

    });

}


// ==================================================
// אבטחה
// ==================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==================================================
// הפעלה אחרי שהעמוד נטען
// ==================================================

window.addEventListener(
    "load",
    () => {

        renderAchievements();

    }
);
