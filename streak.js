// ==================================================
// הגדרות
// ==================================================

const STREAK_GIFT_INTERVAL = 10;
const STREAK_TOTAL_GIFTS = 10;

const STREAK_STORAGE_KEY =
    "streakGiftData";


// ==================================================
// שמות המתנות
// ==================================================

const STREAK_GIFT_NAMES = [

    { emoji: "🥤", name: "קולה זירו" },
    { emoji: "🌿", name: "משקה אלוורה" },
    { emoji: "🫓", name: "טורטית" },
    { emoji: "🍬", name: "סוכריות ללא סוכר" },
    { emoji: "🧊", name: "אייס קפה" },
    { emoji: "🍫", name: "קוקילידה" },
    { emoji: "🍓", name: "מארז לה פרוטה" },
    { emoji: "🍕", name: "פיצה אישית" },
    { emoji: "🍦", name: "טילון אקסטרים" },
    { emoji: "🥗", name: "סלט מגרג" }

];


// ==================================================
// אלמנטים
// ==================================================

const currentStreakElement =
    document.getElementById(
        "currentStreak"
    );

const bestStreakElement =
    document.getElementById(
        "bestStreak"
    );

const giftCountElement =
    document.getElementById(
        "giftCount"
    );

const streakProgress =
    document.getElementById(
        "streakProgress"
    );

const streakGhost =
    document.getElementById(
        "streakGhost"
    );

const streakCenterNumber =
    document.getElementById(
        "streakCenterNumber"
    );

const nextGiftMessage =
    document.getElementById(
        "nextGiftMessage"
    );

const bestStreakMessage =
    document.getElementById(
        "bestStreakMessage"
    );

const streakFire =
    document.getElementById(
        "streakFire"
    );

const giftContainer =
    document.getElementById(
        "giftContainer"
    );

const giftPopup =
    document.getElementById(
        "giftPopup"
    );

const giftPopupImage =
    document.getElementById(
        "giftPopupImage"
    );

const giftPopupText =
    document.getElementById(
        "giftPopupText"
    );

const giftPopupXP =
    document.getElementById(
        "giftPopupXP"
    );

const giftPopupButton =
    document.getElementById(
        "giftPopupButton"
    );


// ==================================================
// נתונים
// ==================================================

const dietData =
    JSON.parse(
        localStorage.getItem(
            "dietData"
        )
    ) || {};


// נתוני סיום יום
const finishDayData =
    JSON.parse(
        localStorage.getItem(
            "finishDayData"
        )
    ) || {};


// ==================================================
// היום של האתר
// 06:00 = התחלת יום חדש
// ==================================================

function getSiteToday() {

    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Jerusalem",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                hour12:
                    false
            }
        ).formatToParts(
            new Date()
        );


    let year =
        Number(
            parts.find(
                x =>
                    x.type ===
                    "year"
            ).value
        );


    let month =
        Number(
            parts.find(
                x =>
                    x.type ===
                    "month"
            ).value
        ) - 1;


    let day =
        Number(
            parts.find(
                x =>
                    x.type ===
                    "day"
            ).value
        );


    const hour =
        Number(
            parts.find(
                x =>
                    x.type ===
                    "hour"
            ).value
        );


    if (
        hour < 6
    ) {

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


// ==================================================
// מפתח תאריך
// ==================================================

function getDateKey(
    date
) {

    return (

        date.getFullYear() +
        "-" +

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


// ==================================================
// האם יום מושלם
// ==================================================
//
// שלוש המשימות:
//
// food
// activity
// challenge
//
// חייבות להיות true
// ==================================================

function isPerfectDay(
    dateKey
) {

    const day =
        dietData[
            dateKey
        ] || {};


    return (

        day.food === true &&
        day.activity === true &&
        day.challenge === true

    );

}


// ==================================================
// האם היום הסתיים
// ==================================================

function isDayFinished(
    dateKey
) {

    return (

        finishDayData[dateKey] &&
        finishDayData[dateKey].finished === true

    );

}


// ==================================================
// חישוב רצף נוכחי
// ==================================================
//
// אם היום עדיין לא הסתיים:
//
// לא סופרים את היום הנוכחי
// ומתחילים לבדוק מאתמול.
//
// אם היום הסתיים:
//
// היום הנוכחי כן נכלל ברצף.
// ==================================================

function calculateCurrentStreak() {

    let date =
        getSiteToday();


    const todayKey =
        getDateKey(date);


    // ----------------------------------------------
    // האם היום כבר הסתיים?
    // ----------------------------------------------

    const todayFinished =
        isDayFinished(
            todayKey
        );


    // ----------------------------------------------
    // אם היום עדיין לא הסתיים
    // לא כוללים אותו ברצף
    // ----------------------------------------------

    if (
        !todayFinished
    ) {

        date.setDate(
            date.getDate() - 1
        );

    }


    // ----------------------------------------------
    // חישוב הרצף
    // ----------------------------------------------

    let streak = 0;


    while (
        isPerfectDay(
            getDateKey(date)
        )
    ) {

        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


// ==================================================
// חישוב השיא ההיסטורי
// ==================================================

function calculateBestStreak() {

    const dates =
        Object.keys(
            dietData
        ).sort();


    let best = 0;

    let current = 0;

    let previousDate =
        null;


    dates.forEach(
        dateKey => {

            if (
                !isPerfectDay(
                    dateKey
                )
            ) {

                current = 0;

                previousDate =
                    null;

                return;

            }


            const currentDate =
                new Date(
                    dateKey +
                    "T12:00:00"
                );


            if (
                previousDate
            ) {

                const difference =
                    currentDate -
                    previousDate;


                const differenceDays =
                    Math.round(
                        difference /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                if (
                    differenceDays !== 1
                ) {

                    current = 0;

                }

            }


            current++;


            best =
                Math.max(
                    best,
                    current
                );


            previousDate =
                currentDate;

        }
    );


    return best;

}


// ==================================================
// נתוני מתנות
// ==================================================

function loadGiftData() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                STREAK_STORAGE_KEY
            )
        );


    if (
        saved &&
        Array.isArray(
            saved.earnedGifts
        )
    ) {

        return saved;

    }


    return {

        earnedGifts: [],

        bestStreak: 0

    };

}


function saveGiftData(
    data
) {

    localStorage.setItem(
        STREAK_STORAGE_KEY,
        JSON.stringify(
            data
        )
    );

}


// ==================================================
// עדכון מתנות שהגיעו להן
// ==================================================

function checkForNewGifts(
    currentStreak
) {

    const giftData =
        loadGiftData();


    const newlyEarned = [];


    for (
        let giftNumber = 1;
        giftNumber <= STREAK_TOTAL_GIFTS;
        giftNumber++
    ) {

        const requiredDays =
            giftNumber *
            STREAK_GIFT_INTERVAL;


        if (
            currentStreak >=
            requiredDays
        ) {

            if (
                !giftData.earnedGifts.includes(
                    giftNumber
                )
            ) {

                giftData.earnedGifts.push(
                    giftNumber
                );


                newlyEarned.push(
                    giftNumber
                );

            }

        }

    }


    giftData.earnedGifts.sort(
        (
            a,
            b
        ) =>
            a - b
    );


    saveGiftData(
        giftData
    );


    return newlyEarned;

}


// ==================================================
// יצירת המתנות סביב המעגל
// ==================================================

function renderGifts(
    earnedGifts
) {

    giftContainer.innerHTML =
        "";


    const center =
        300;


    const radius =
        220;


    for (
        let giftNumber = 1;
        giftNumber <= STREAK_TOTAL_GIFTS;
        giftNumber++
    ) {

        const angle =
            (
                giftNumber *
                36
            ) - 90;


        const radians =
            angle *
            Math.PI /
            180;


        const x =
            center +
            radius *
            Math.cos(
                radians
            );


        const y =
            center +
            radius *
            Math.sin(
                radians
            );


        const gift =
            document.createElement(
                "div"
            );


        gift.className =
            "streak-gift";


        gift.style.left =
            `${(
                x / 600
            ) * 100}%`;


        gift.style.top =
            `${(
                y / 600
            ) * 100}%`;


        const earned =
            earnedGifts.includes(
                giftNumber
            );


        if (
            earned
        ) {

            gift.classList.add(
                "earned"
            );

        }


        // ------------------------------------------
        // המתנה הבאה
        // ------------------------------------------

        const nextGiftNumber =
            earnedGifts.length + 1;


        if (
            giftNumber ===
            nextGiftNumber
        ) {

            gift.classList.add(
                "next-gift"
            );

        }


        gift.innerHTML = `

            <div class="streak-gift-number">

                ${giftNumber}

            </div>


            <img
                src="images/${giftNumber}.PNG"
                alt="מתנה ${giftNumber}"
                class="streak-gift-image"
                draggable="false">


            <div class="streak-gift-days">

                ${giftNumber * 10}

            </div>


            <div class="streak-gift-name">

                ${STREAK_GIFT_NAMES[giftNumber - 1].emoji}
                ${STREAK_GIFT_NAMES[giftNumber - 1].name}

            </div>

        `;


        giftContainer.appendChild(
            gift
        );

    }

}


// ==================================================
// חישוב היקף המעגל
// ==================================================

const CIRCLE_RADIUS = 220;

const CIRCLE_CIRCUMFERENCE =
    2 *
    Math.PI *
    CIRCLE_RADIUS;


// ==================================================
// עדכון הקו
// ==================================================

function updateCircle(
    currentStreak,
    bestStreak
) {

    // ----------------------------------------------
    // הרצף הנוכחי
    // ----------------------------------------------

    const currentRatio =
        Math.min(
            1,
            currentStreak /
            (
                STREAK_GIFT_INTERVAL *
                STREAK_TOTAL_GIFTS
            )
        );


    const currentLength =
        currentRatio *
        CIRCLE_CIRCUMFERENCE;


    streakProgress.style.strokeDasharray =
        CIRCLE_CIRCUMFERENCE;


    streakProgress.style.strokeDashoffset =
        CIRCLE_CIRCUMFERENCE -
        currentLength;


    // ----------------------------------------------
    // מסכת הברק
    // ----------------------------------------------

    const progressMaskCircle =
        document.getElementById(
            "progressMaskCircle"
        );


    if (
        progressMaskCircle
    ) {

        progressMaskCircle.style.strokeDasharray =
            CIRCLE_CIRCUMFERENCE;


        progressMaskCircle.style.strokeDashoffset =
            CIRCLE_CIRCUMFERENCE -
            currentLength;

    }


    // ----------------------------------------------
    // השיא ההיסטורי
    // ----------------------------------------------

    const bestRatio =
        Math.min(
            1,
            bestStreak /
            (
                STREAK_GIFT_INTERVAL *
                STREAK_TOTAL_GIFTS
            )
        );


    const bestLength =
        bestRatio *
        CIRCLE_CIRCUMFERENCE;


    streakGhost.style.strokeDasharray =
        CIRCLE_CIRCUMFERENCE;


    streakGhost.style.strokeDashoffset =
        CIRCLE_CIRCUMFERENCE -
        bestLength;

}


// ==================================================
// ניצוץ בקצה ההתקדמות
// ==================================================

function updateProgressSpark(
    currentStreak
) {

    const container =
        document.getElementById(
            "streakProgressContainer"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    const totalDays =
        STREAK_GIFT_INTERVAL *
        STREAK_TOTAL_GIFTS;


    if (
        currentStreak <= 0
    ) {

        return;

    }


    const progress =
        Math.min(
            1,
            currentStreak /
            totalDays
        );


    const angle =
        (
            progress *
            360
        ) - 90;


    const radians =
        angle *
        Math.PI /
        180;


    const radius =
        220;


    const x =
        300 +
        radius *
        Math.cos(
            radians
        );


    const y =
        300 +
        radius *
        Math.sin(
            radians
        );


    const spark =
        document.createElement(
            "div"
        );


    spark.className =
        "streak-progress-spark";


    spark.style.left =
        `${(
            x / 600
        ) * 100}%`;


    spark.style.top =
        `${(
            y / 600
        ) * 100}%`;


    container.appendChild(
        spark
    );


    // ----------------------------------------------
    // אבק כוכבים קטן סביב הקצה
    // ----------------------------------------------

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "streak-particle";


        particle.style.left =
            `${(
                x / 600
            ) * 100}%`;


        particle.style.top =
            `${(
                y / 600
            ) * 100}%`;


        const randomX =
            (
                Math.random() *
                35
            ) - 17;


        const randomY =
            (
                Math.random() *
                35
            ) - 17;


        particle.style.setProperty(
            "--spark-x",
            `${randomX}px`
        );


        particle.style.setProperty(
            "--spark-y",
            `${randomY}px`
        );


        particle.style.animationDelay =
            `${i * 0.11}s`;


        container.appendChild(
            particle
        );

    }

}


// ==================================================
// טקסט מרכזי
// ==================================================

function updateCenter(
    currentStreak,
    earnedGifts
) {

    streakCenterNumber.textContent =
        currentStreak;


    currentStreakElement.textContent =
        currentStreak;


    bestStreakElement.textContent =
        calculateBestStreak();


    giftCountElement.textContent =
        `${earnedGifts.length} / ${STREAK_TOTAL_GIFTS}`;


    // ----------------------------------------------
    // כל המתנות
    // ----------------------------------------------

    if (
        earnedGifts.length ===
        STREAK_TOTAL_GIFTS
    ) {

        nextGiftMessage.textContent =
            "🎉 כל המתנות שלך!";

        return;

    }


    // ----------------------------------------------
    // המתנה הבאה
    // ----------------------------------------------

    let nextGift =
        1;


    while (
        earnedGifts.includes(
            nextGift
        ) &&
        nextGift <=
        STREAK_TOTAL_GIFTS
    ) {

        nextGift++;

    }


    const nextGiftDay =
        nextGift *
        STREAK_GIFT_INTERVAL;


    const remaining =
        Math.max(
            0,
            nextGiftDay -
            currentStreak
        );


    if (
        currentStreak === 0
    ) {

        nextGiftMessage.textContent =
            `המתנה ${nextGift} מחכה לך 🎁`;

    }
    else if (
        remaining === 0
    ) {

        nextGiftMessage.textContent =
            `🎁 מתנה ${nextGift} נפתחה!`;

    }
    else {

        nextGiftMessage.textContent =
            `עוד ${remaining} ימים למתנה ${nextGift} 🎁`;

    }

}


// ==================================================
// הודעת שיא
// ==================================================

function updateBestMessage(
    currentStreak,
    bestStreak
) {

    if (
        bestStreak === 0
    ) {

        bestStreakMessage.textContent =
            "🌱 היום מתחילים לבנות את הרצף הראשון שלך.";

        return;

    }


    if (
        currentStreak > 0 &&
        currentStreak === bestStreak
    ) {

        bestStreakMessage.textContent =
            `🔥 זה השיא שלך כרגע — ${bestStreak} ימים!`;

        return;

    }


    if (
        currentStreak === 0 &&
        bestStreak > 0
    ) {

        bestStreakMessage.textContent =
            `💭 השיא שלך הוא ${bestStreak} ימים. הרצף הבא יכול להיות אפילו ארוך יותר.`;

        return;

    }


    bestStreakMessage.textContent =
        `🏆 השיא שלך: ${bestStreak} ימים`;

}


// ==================================================
// אנימציית אש
// ==================================================

function updateFireAnimation(
    currentStreak
) {

    if (
        currentStreak >= 10
    ) {

        streakFire.classList.add(
            "big-fire"
        );

    }
    else {

        streakFire.classList.remove(
            "big-fire"
        );

    }

}


// ==================================================
// חלונית מתנה
// ==================================================

function showGiftPopup(
    giftNumber
) {

    giftPopupImage.src =
        `images/${giftNumber}.PNG`;


    giftPopupText.innerHTML = `

        כל הכבוד! 🎉

        <br>

        הגעת ל־
        <strong>
            ${giftNumber * 10}
        </strong>
        ימים מושלמים ברצף!

        <br>

        <strong>
            מתנה ${giftNumber}
        </strong>
        נפתחה! 🎁

    `;


    giftPopupXP.textContent =
        "איזו התמדה! זה לגמרי מגיע לך ✨";


    giftPopup.classList.add(
        "show"
    );


    giftPopup.classList.remove(
        "gift-celebration"
    );


    void giftPopup.offsetWidth;


    giftPopup.classList.add(
        "gift-celebration"
    );

}


// ==================================================
// סגירת מתנה
// ==================================================

function closeGiftPopup() {

    giftPopup.classList.remove(
        "show"
    );

}


// ==================================================
// תור מתנות
// ==================================================

let giftQueue = [];


function showGiftQueue(
    gifts
) {

    giftQueue.push(
        ...gifts
    );


    showNextGift();

}


function showNextGift() {

    if (
        giftPopup.classList.contains(
            "show"
        )
    ) {

        return;

    }


    if (
        giftQueue.length === 0
    ) {

        return;

    }


    const giftNumber =
        giftQueue.shift();


    showGiftPopup(
        giftNumber
    );

}


// ==================================================
// סגירה והמשך למתנה הבאה
// ==================================================

function closeAndContinue() {

    closeGiftPopup();


    setTimeout(
        () => {

            showNextGift();

        },
        250
    );

}


if (
    giftPopupButton
) {

    giftPopupButton.onclick =
        closeAndContinue;

}


if (
    giftPopup
) {

    giftPopup.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                giftPopup
            ) {

                closeAndContinue();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAndContinue();

        }

    }
);


// ==================================================
// הפעלה
// ==================================================

function initializeStreak() {

    const currentStreak =
        calculateCurrentStreak();


    const calculatedBest =
        calculateBestStreak();


    const giftData =
        loadGiftData();


    // ----------------------------------------------
    // השיא לא יורד לעולם
    // ----------------------------------------------

    const bestStreak =
        Math.max(
            calculatedBest,
            giftData.bestStreak || 0
        );


    giftData.bestStreak =
        bestStreak;


    saveGiftData(
        giftData
    );


    // ----------------------------------------------
    // בדיקת מתנות חדשות
    // ----------------------------------------------

    const newlyEarned =
        checkForNewGifts(
            currentStreak
        );


    const updatedGiftData =
        loadGiftData();


    // ----------------------------------------------
    // ציור המתנות
    // ----------------------------------------------

    renderGifts(
        updatedGiftData.earnedGifts
    );


    // ----------------------------------------------
    // ציור המעגל
    // ----------------------------------------------

    updateCircle(
        currentStreak,
        bestStreak
    );


    // ----------------------------------------------
    // ניצוץ בקצה הקו
    // ----------------------------------------------

    updateProgressSpark(
        currentStreak
    );


    // ----------------------------------------------
    // טקסטים
    // ----------------------------------------------

    updateCenter(
        currentStreak,
        updatedGiftData.earnedGifts
    );


    updateBestMessage(
        currentStreak,
        bestStreak
    );


    // ----------------------------------------------
    // אש
    // ----------------------------------------------

    updateFireAnimation(
        currentStreak
    );


    // ----------------------------------------------
    // אם נפתחו כמה מתנות
    // מציגים אותן אחת אחרי השנייה
    // ----------------------------------------------

    if (
        newlyEarned.length > 0
    ) {

        showGiftQueue(
            newlyEarned
        );

    }

}


// ==================================================
// רענון במקרה שהנתונים השתנו
// ==================================================

window.addEventListener(
    "xpDataChanged",
    () => {

        initializeStreak();

    }
);


// ==================================================
// הפעלה ראשונית
// ==================================================

initializeStreak();


// ==================================================
// בדיקה מחזורית
// כדי שהעמוד יתעדכן אם היום התחלף
// ==================================================

setInterval(
    initializeStreak,
    1000
);