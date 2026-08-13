// ==================================================
// אלמנטים בדף
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
// הצגת פרטי האתגר הנוכחי
// ==================================================

document.getElementById(
    "challengeName"
).textContent =
    currentChallenge.name;


document.getElementById(
    "challengeDescription"
).textContent =
    currentChallenge.description;


// ==================================================
// אייקון
// ==================================================

const challengeIconElement =
    document.querySelector(
        ".challenge-icon"
    );


if (
    challengeIconElement
) {

    challengeIconElement.textContent =
        currentChallenge.icon;

}


// ==================================================
// מספר השבוע
// ==================================================

if (
    weekNumber
) {

    weekNumber.textContent =
        `שבוע ${currentWeek}`;

}


// ==================================================
// נתוני המשתמש
// ==================================================

const savedData =
    JSON.parse(
        localStorage.getItem(
            "dietData"
        )
    ) || {};


// ==================================================
// שמות ימי השבוע
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
// תחילת השבוע הנוכחי
// ==================================================

const weekStart =
    new Date(
        startDate
    );


weekStart.setDate(
    weekStart.getDate() +
    (
        (
            (
                currentWeek - 1
            ) %
            52
        ) * 7
    )
);


// ==================================================
// יצירת 7 הימים
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


    // ----------------------------------------------
    // מפתח התאריך
    // ----------------------------------------------

    const dateKey =
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
        );


    // ----------------------------------------------
    // יצירת משבצת היום
    // ----------------------------------------------

    const dayElement =
        document.createElement(
            "div"
        );


    dayElement.className =
        "challenge-day";


    // ----------------------------------------------
    // האם היום הושלם?
    // ----------------------------------------------

    if (
        savedData[dateKey] &&
        savedData[dateKey].challenge
    ) {

        dayElement.classList.add(
            "completed"
        );

    }


    // ----------------------------------------------
    // תוכן
    // ----------------------------------------------

    dayElement.innerHTML = `

        <span class="day-name">

            ${dayNames[i]}

        </span>


        <span class="day-number">

            ${date.getDate()}

        </span>

    `;


    // ----------------------------------------------
    // בדיקה האם היום עתידי
    // ----------------------------------------------

    const today =
        getIsraelToday();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const currentDate =
        new Date(
            date
        );


    currentDate.setHours(
        0,
        0,
        0,
        0
    );


    const isFuture =
        currentDate >
        today;


    if (
        isFuture
    ) {

        dayElement.style.opacity =
            "0.5";


        dayElement.style.cursor =
            "default";

    }
    else {

        // ------------------------------------------
        // לחיצה על יום
        // ------------------------------------------

        dayElement.addEventListener(
            "click",
            () => {

                // ----------------------------------
                // יצירת נתונים ליום אם אין
                // ----------------------------------

                if (
                    !savedData[dateKey]
                ) {

                    savedData[dateKey] = {

                        food: false,

                        activity: false,

                        challenge: false

                    };

                }


                // ----------------------------------
                // שינוי מצב האתגר
                // ----------------------------------

                const isCompleted =
                    !savedData[
                        dateKey
                    ].challenge;


                savedData[
                    dateKey
                ].challenge =
                    isCompleted;


                // ----------------------------------
                // שמירה
                // ----------------------------------

                localStorage.setItem(
                    "dietData",
                    JSON.stringify(
                        savedData
                    )
                );


                // ----------------------------------
                // עדכון XP
                // ----------------------------------

                window.dispatchEvent(
                    new Event(
                        "xpDataChanged"
                    )
                );


                // ----------------------------------
                // עדכון התצוגה
                // ----------------------------------

                dayElement.classList.toggle(
                    "completed",
                    isCompleted
                );


                // ----------------------------------
                // עדכון ההתקדמות
                // ----------------------------------

                updateProgress();

            }
        );

    }


    // ----------------------------------------------
    // הוספה לדף
    // ----------------------------------------------

    challengeDays.appendChild(
        dayElement
    );

}


// ==================================================
// עדכון ההתקדמות
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
            );


        if (
            savedData[dateKey] &&
            savedData[dateKey].challenge
        ) {

            completed++;

        }

    }


    // ==================================================
    // שבוע ללא אתגר
    // ==================================================

    if (
        currentChallenge.isNoChallenge
    ) {

        if (
            challengeScore
        ) {

            challengeScore.textContent =
                "🌸 שבוע מנוחה";

        }


        if (
            challengeProgress
        ) {

            challengeProgress.style.width =
                "100%";

        }


        if (
            challengeMessage
        ) {

            challengeMessage.textContent =
                "🌸 השבוע אין אתגר — ממשיכים במסע בשבוע הבא!";

        }


        return;

    }


    // ==================================================
    // מספר הימים שהושלמו
    // ==================================================

    if (
        challengeScore
    ) {

        challengeScore.textContent =
            `${completed} / 7`;

    }


    // ==================================================
    // פס התקדמות
    // ==================================================

    if (
        challengeProgress
    ) {

        const percentage =
            (
                completed /
                7
            ) * 100;


        challengeProgress.style.width =
            `${percentage}%`;

    }


    // ==================================================
    // הודעה
    // ==================================================

    if (
        challengeMessage
    ) {

        if (
            completed === 7
        ) {

            challengeMessage.textContent =
                "🎉 כל הכבוד! השלמת את האתגר השבועי!";

        }

        else if (
            completed >= 5
        ) {

            challengeMessage.textContent =
                "🌟 את ממש קרובה לסיום!";

        }

        else if (
            completed >= 3
        ) {

            challengeMessage.textContent =
                "💪 את בדרך הנכונה!";

        }

        else if (
            completed >= 1
        ) {

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
// הפעלה ראשונית
// ==================================================

updateProgress();