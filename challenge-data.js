// ==================================================
// רשימת האתגרים
// ==================================================
//
// יש כאן רק את האתגרים שהגדרת.
// אין כאן אתגרים שהומצאו מעבר לרשימה שלך.
//
// 33 שבועות = אתגרים שחוזרים לפי הסדר
// 19 שבועות = "יום ללא אתגר!"
// סה"כ = 52 שבועות
// ==================================================

const challenges = [

    {
        name: "16 : 8 - אוכלים רק 8 שעות",
        description:
            "השבוע מקפידים לאכול רק במהלך חלון של 8 שעות.",
        icon: "⏰"
    },

    {
        name: "התעמלות חצי שעה במקום 20 דקות",
        description:
            "השבוע מגדילים את זמן ההתעמלות לחצי שעה ביום.",
        icon: "🏃‍♀️"
    },

    {
        name: "לא לאכול לחם",
        description:
            "השבוע מוותרים על אכילת לחם.",
        icon: "🍞"
    },

    {
        name: "לאכול כל יום לפחות 4 ירקות",
        description:
            "השבוע מקפידים לאכול לפחות ארבעה ירקות בכל יום.",
        icon: "🥕"
    },

    {
        name: "לאכול כל יום סלט חסה",
        description:
            "השבוע מקפידים לאכול סלט חסה בכל יום.",
        icon: "🥗"
    },

    {
        name: "לא לאכול סוכר (חוץ מבקפה)",
        description:
            "השבוע נמנעים מסוכר, למעט הסוכר שמוסיפים לקפה.",
        icon: "🍬"
    },

    {
        name: "לא לאכול קמח לבן",
        description:
            "השבוע מוותרים על מאכלים העשויים מקמח לבן.",
        icon: "🌾"
    },

    {
        name: "להתחיל לאכול ב-12:00",
        description:
            "השבוע מתחילים את האכילה היומית בשעה 12:00.",
        icon: "🕛"
    },

    {
        name: "לאכול רק בישיבה",
        description:
            "השבוע מקפידים לאכול רק בישיבה.",
        icon: "🪑"
    },

    {
        name: "ירקות זמינים",
        description:
            "מכינים בכל בוקר קופסת ירקות זמינה לאכילה במהלך היום.",
        icon: "🥒"
    },

    {
        name: "שבוע בלי שוקולד",
        description:
            "השבוע מוותרים על אכילת שוקולד.",
        icon: "🍫"
    },

    {
        name: "שבוע בלי מאפים",
        description:
            "השבוע מוותרים על מאפים.",
        icon: "🥐"
    },

    {
        name: "שבוע בלי אוכל מטוגן",
        description:
            "השבוע נמנעים מאוכל מטוגן.",
        icon: "🍟"
    },

    {
        name: "סלט בכל ארוחה",
        description:
            "השבוע מקפידים להוסיף סלט לכל ארוחה.",
        icon: "🥗"
    },

    {
        name: "שעות אכילה קבועות",
        description:
            "השבוע מקפידים על שעות אכילה קבועות ומסודרות.",
        icon: "⏱️"
    },

    {
        name: "שבוע בלי אכילה מול המחשב",
        description:
            "השבוע אוכלים בלי לשבת מול המחשב.",
        icon: "💻"
    }

];


// ==================================================
// שבוע ללא אתגר
// ==================================================

const noChallenge = {

    name: "יום ללא אתגר!",
    
    description:
        "השבוע אין אתגר. אפשר לקחת נשימה, לנוח ולהמשיך במסע. 🌸",

    icon: "🌸",

    isNoChallenge: true

};


// ==================================================
// תחילת הדיאטה
// ==================================================

// 10 באוגוסט 2026
const startDate =
    new Date(2026, 7, 10);


// ==================================================
// קבלת התאריך של היום בישראל
// ==================================================

function getIsraelToday() {

    const israelDate =
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
            israelDate.find(
                x => x.type === "year"
            ).value
        ),

        Number(
            israelDate.find(
                x => x.type === "month"
            ).value
        ) - 1,

        Number(
            israelDate.find(
                x => x.type === "day"
            ).value
        )

    );

}


// ==================================================
// מספר השבוע
// ==================================================

function getWeekNumber() {

    const today =
        getIsraelToday();


    const start =
        new Date(
            startDate
        );


    // איפוס השעות כדי למנוע בעיות של שעון קיץ
    today.setHours(
        0,
        0,
        0,
        0
    );

    start.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        today - start;


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    return (
        Math.floor(
            days / 7
        ) + 1
    );

}


// ==================================================
// השבוע הנוכחי
// ==================================================

const currentWeek =
    Math.max(
        1,
        getWeekNumber()
    );


// ==================================================
// בניית לוח 52 השבועות
// ==================================================
//
// 52 שבועות:
// 33 שבועות עם האתגרים שלך
// 19 שבועות ללא אתגר
//
// ה-No Challenge מפוזר באופן שווה ככל האפשר.
// ==================================================

function buildChallengeSchedule() {

    const schedule = [];

    const totalWeeks = 52;
    const noChallengeCount = 19;
    const challengeWeekCount =
        totalWeeks - noChallengeCount;


    let challengeIndex = 0;


    // מיקום שבועות "ללא אתגר".
    //
    // הנוסחה מפזרת אותם לאורך כל השנה
    // כך שהמרווחים ביניהם יהיו שווים ככל האפשר.

    const noChallengeWeeks =
        new Set();


    for (
        let i = 0;
        i < noChallengeCount;
        i++
    ) {

        const week =
            Math.floor(
                (
                    i * totalWeeks +
                    Math.floor(
                        totalWeeks / 2
                    )
                ) /
                noChallengeCount
            ) + 1;


        noChallengeWeeks.add(
            week
        );

    }


    // במקרה של כפילות, משלימים את המקומות
    // החסרים מההתחלה.

    let weekNumber = 1;


    while (
        noChallengeWeeks.size <
        noChallengeCount
    ) {

        if (
            !noChallengeWeeks.has(
                weekNumber
            )
        ) {

            noChallengeWeeks.add(
                weekNumber
            );

        }


        weekNumber++;

    }


    // ----------------------------------------------
    // יצירת 52 השבועות
    // ----------------------------------------------

    for (
        let week = 1;
        week <= totalWeeks;
        week++
    ) {

        if (
            noChallengeWeeks.has(
                week
            )
        ) {

            schedule.push(
                noChallenge
            );

        }
        else {

            schedule.push(
                challenges[
                    challengeIndex %
                    challenges.length
                ]
            );


            challengeIndex++;

        }

    }


    return schedule;

}


// ==================================================
// לוח האתגרים השנתי
// ==================================================

const challengeSchedule =
    buildChallengeSchedule();


// ==================================================
// האתגר הנוכחי
// ==================================================
//
// אחרי שבוע 52 חוזרים לשבוע 1.
//

const scheduleIndex =
    (
        (
            currentWeek - 1
        ) %
        52
    );


const currentChallenge =
    challengeSchedule[
        scheduleIndex
    ];