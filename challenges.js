// ==================================================
// אלמנטים
// ==================================================

const challengeDays =
    document.getElementById(
        "challengeDays"
    );

const challengeScore =
    document.getElementById(
        "challengeScore"
    );

const challengeProgress =
    document.getElementById(
        "challengeProgress"
    );

const challengeMessage =
    document.getElementById(
        "challengeMessage"
    );

const weekNumber =
    document.getElementById(
        "weekNumber"
    );


// ==================================================
// אתגרים
// ==================================================

const challenges = [

    {
        name:
            "מתחילים את היום נכון",

        description:
            "השבוע ננסה להתחיל כל יום בצורה מסודרת.",

        icon:
            "☀️"
    },

    {
        name:
            "מים",

        description:
            "השבוע מקפידים לשתות מספיק מים בכל יום.",

        icon:
            "💧"
    },

    {
        name:
            "צעדים",

        description:
            "השבוע מוסיפים קצת יותר תנועה לשגרה.",

        icon:
            "👟"
    },

    {
        name:
            "ירקות",

        description:
            "השבוע מקפידים לשלב ירקות במהלך היום.",

        icon:
            "🥦"
    },

    {
        name:
            "ארוחה מסודרת",

        description:
            "השבוע מקפידים לאכול את הארוחות בצורה מסודרת.",

        icon:
            "🍽️"
    }

];


// ==================================================
// יום התחלה
// ==================================================

const startDate =
    new Date(
        2026,
        7,
        10
    );


// ==================================================
// היום של האתר
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


const today =
    getSiteToday();


// ==================================================
// מפתח
// ==================================================

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


// ==================================================
// מספר השבוע
// ==================================================

function getWeekNumber() {

    const difference =
        today -
        startDate;


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


const currentWeek =
    Math.max(
        1,
        getWeekNumber()
    );


// ==================================================
// האתגר הנוכחי
// ==================================================

const challengeIndex =
    (
        currentWeek - 1
    ) %
    challenges.length;


const currentChallenge =
    challenges[
        challengeIndex
    ];


// ==================================================
// נתונים
// ==================================================

const savedData =
    JSON.parse(
        localStorage.getItem(
            "dietData"
        )
    ) || {};


// ==================================================
// הצגת פרטי האתגר
// ==================================================

const challengeNameElement =
    document.getElementById(
        "challengeName"
    );

const challengeDescriptionElement =
    document.getElementById(
        "challengeDescription"
    );

const challengeIconElement =
    document.querySelector(
        ".challenge-icon"
    );


if (challengeNameElement) {

    challengeNameElement.textContent =
        currentChallenge.name;

}


if (
    challengeDescriptionElement
) {

    challengeDescriptionElement.textContent =
        currentChallenge.description;

}


if (challengeIconElement) {

    challengeIconElement.textContent =
        currentChallenge.icon;

}


if (weekNumber) {

    weekNumber.textContent =
        `שבוע ${currentWeek}`;

}


// ==================================================
// תחילת השבוע
// ==================================================

const weekStart =
    new Date(
        startDate
    );


weekStart.setDate(
    weekStart.getDate() +
    (currentWeek - 1) * 7
);


// ==================================================
// ימי השבוע
// ==================================================

const dayNames = [

    "א׳",
    "ב׳",
    "ג׳",
    "ד׳",
    "ה׳",
    "ו׳",
    "ש׳"

];


// ==================================================
// יצירת הימים
// ==================================================

for (
    let i = 0;
    i < 7;
    i++
) {

    const date =
        new Date(
            weekStart
        );


    date.setDate(
        weekStart.getDate() + i
    );


    const dateKey =
        getDateKey(date);


    const dayElement =
        document.createElement(
            "div"
        );


    dayElement.className =
        "challenge-day";


    if (
        savedData[dateKey] &&
        savedData[dateKey].challenge
    ) {

        dayElement.classList.add(
            "completed"
        );

    }


    dayElement.innerHTML = `

        <span class="day-name">
            ${dayNames[i]}
        </span>

        <span class="day-number">
            ${date.getDate()}
        </span>

    `;


    const isFuture =
        date > today;


    if (isFuture) {

        dayElement.style.opacity =
            "0.5";

        dayElement.style.cursor =
            "default";

    }
    else {

        dayElement.addEventListener(
            "click",
            () => {

                if (
                    !savedData[dateKey]
                ) {

                    savedData[
                        dateKey
                    ] = {

                        food: false,
                        activity: false,
                        challenge: false

                    };

                }


                savedData[
                    dateKey
                ].challenge =
                    !savedData[
                        dateKey
                    ].challenge;


                localStorage.setItem(
                    "dietData",
                    JSON.stringify(
                        savedData
                    )
                );


                window.dispatchEvent(
                    new Event(
                        "xpDataChanged"
                    )
                );


                dayElement.classList.toggle(
                    "completed",
                    savedData[
                        dateKey
                    ].challenge
                );


                updateProgress();

            }
        );

    }


    challengeDays.appendChild(
        dayElement
    );

}


// ==================================================
// התקדמות
// ==================================================

function updateProgress() {

    let completed = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(
                weekStart
            );


        date.setDate(
            weekStart.getDate() + i
        );


        const dateKey =
            getDateKey(
                date
            );


        if (
            savedData[dateKey] &&
            savedData[dateKey].challenge
        ) {

            completed++;

        }

    }


    if (challengeScore) {

        challengeScore.textContent =
            `${completed} / 7`;

    }


    if (challengeProgress) {

        challengeProgress.style.width =
            `${(
                completed /
                7
            ) * 100}%`;

    }


    if (challengeMessage) {

        if (completed === 7) {

            challengeMessage.textContent =
                "🎉 כל הכבוד! השלמת את האתגר השבועי!";

        }
        else if (completed >= 5) {

            challengeMessage.textContent =
                "🌟 את ממש קרובה לסיום!";

        }
        else if (completed >= 3) {

            challengeMessage.textContent =
                "💪 את בדרך הנכונה!";

        }
        else if (completed >= 1) {

            challengeMessage.textContent =
                "🌸 התחלת — ממשיכים קדימה!";

        }
        else {

            challengeMessage.textContent =
                "";

        }

    }

}


// ==================================================
// הפעלה
// ==================================================

updateProgress();