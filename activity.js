// ==================================================
// אלמנטים
// ==================================================

const activitySearch =
    document.getElementById(
        "activitySearch"
    );

const activitySuggestions =
    document.getElementById(
        "activitySuggestions"
    );

const customActivityBox =
    document.getElementById(
        "customActivityBox"
    );

const customActivityText =
    document.getElementById(
        "customActivityText"
    );

const addCustomActivity =
    document.getElementById(
        "addCustomActivity"
    );

const activityTableBody =
    document.getElementById(
        "activityTableBody"
    );

const activityTotal =
    document.getElementById(
        "activityTotal"
    );

const emptyActivityMessage =
    document.getElementById(
        "emptyActivityMessage"
    );


// ==================================================
// הגדרות
// ==================================================

const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// רשימת פעילויות
// ==================================================

const activities = [

    {
        name: "הליכה",
        emoji: "🚶"
    },

    {
        name: "ריצה",
        emoji: "🏃"
    },

    {
        name: "אימון כוח",
        emoji: "🏋️"
    },

    {
        name: "רכיבה על אופניים",
        emoji: "🚴"
    },

    {
        name: "שחייה",
        emoji: "🏊"
    },

    {
        name: "ריקוד",
        emoji: "💃"
    },

    {
        name: "יוגה",
        emoji: "🧘"
    },

    {
        name: "מתיחות",
        emoji: "🤸"
    },

    {
        name: "הליכון",
        emoji: "🏃"
    },

    {
        name: "מדרגות",
        emoji: "🪜"
    }

];


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


const today =
    getIsraelToday();


const dateKey =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(
        2,
        "0"
    ) +
    "-" +
    String(
        today.getDate()
    ).padStart(
        2,
        "0"
    );


// ==================================================
// נתוני פעילות
// ==================================================

const allActivityData =
    JSON.parse(
        localStorage.getItem(
            "activityData"
        )
    ) || {};


if (!allActivityData[dateKey]) {

    allActivityData[dateKey] = [];

}


// ==================================================
// נתוני משימות
// ==================================================

const dietData =
    JSON.parse(
        localStorage.getItem(
            "dietData"
        )
    ) || {};


if (!dietData[dateKey]) {

    dietData[dateKey] = {

        food: false,
        activity: false,
        challenge: false

    };

}


// ==================================================
// מצב יעד פעילות
// ==================================================

let activityWasSuccessful =
    getTodayActivityMinutes() >=
    DAILY_ACTIVITY_TARGET;


// ==================================================
// חישוב דקות
// ==================================================

function getTodayActivityMinutes() {

    return allActivityData[dateKey]
        .reduce(
            (
                total,
                activity
            ) => {

                return (
                    total +
                    Number(
                        activity.minutes || 0
                    )
                );

            },
            0
        );

}


// ==================================================
// שמירה
// ==================================================

function saveActivityData() {

    localStorage.setItem(
        "activityData",
        JSON.stringify(
            allActivityData
        )
    );

}


// ==================================================
// אנימציית הצלחה
// ==================================================

function celebrateActivity() {

    const card =
        document.querySelector(
            ".activity-card"
        );


    if (!card) {
        return;
    }


    card.classList.remove(
        "activity-success-animation"
    );


    void card.offsetWidth;


    card.classList.add(
        "activity-success-animation"
    );

}


// ==================================================
// סנכרון משימת פעילות
// ==================================================

function updateActivityTask() {

    const total =
        getTodayActivityMinutes();


    const wasSuccessful =
        activityWasSuccessful;


    const isSuccessful =
        total >=
        DAILY_ACTIVITY_TARGET;


    dietData[dateKey].activity =
        isSuccessful;


    localStorage.setItem(
        "dietData",
        JSON.stringify(
            dietData
        )
    );


    // אנימציה רק במעבר מ־לא הושלם להושלם

    if (
        isSuccessful &&
        !wasSuccessful
    ) {

        celebrateActivity();

    }


    activityWasSuccessful =
        isSuccessful;

}


// ==================================================
// הצעות פעילות
// ==================================================

function showSuggestions(
    value
) {

    if (!activitySuggestions) {
        return;
    }


    activitySuggestions.innerHTML =
        "";


    if (customActivityBox) {

        customActivityBox.style.display =
            "none";

    }


    const searchText =
        value.trim();


    if (!searchText) {
        return;
    }


    const matches =
        activities.filter(
            activity =>
                activity.name.includes(
                    searchText
                )
        );


    matches.forEach(
        activity => {

            const suggestion =
                document.createElement(
                    "div"
                );


            suggestion.className =
                "activity-suggestion";


            suggestion.innerHTML = `

                <span
                    class="activity-suggestion-emoji">

                    ${activity.emoji}

                </span>

                <span>
                    ${activity.name}
                </span>

            `;


            suggestion.addEventListener(
                "click",
                () => {

                    addActivity(
                        activity.name,
                        activity.emoji
                    );


                    if (activitySearch) {

                        activitySearch.value =
                            "";

                    }


                    activitySuggestions.innerHTML =
                        "";

                }
            );


            activitySuggestions.appendChild(
                suggestion
            );

        }
    );


    if (
        matches.length === 0 &&
        customActivityBox
    ) {

        if (customActivityText) {

            customActivityText.textContent =
                `הפעילות "${searchText}" לא נמצאה במאגר.`;

        }


        customActivityBox.style.display =
            "block";

    }

}


// ==================================================
// הוספת פעילות
// ==================================================

function addActivity(
    name,
    emoji = ""
) {

    allActivityData[dateKey].push({

        id:
            Date.now(),

        name:
            name,

        emoji:
            emoji,

        minutes:
            0

    });


    saveActivityData();

    updateActivityTask();

    renderActivityTable();

    updateTotal();


    window.dispatchEvent(
        new Event(
            "xpDataChanged"
        )
    );

}


// ==================================================
// פעילות חופשית
// ==================================================

if (addCustomActivity) {

    addCustomActivity.addEventListener(
        "click",
        () => {

            if (!activitySearch) {
                return;
            }


            const name =
                activitySearch.value.trim();


            if (!name) {
                return;
            }


            addActivity(
                name,
                ""
            );


            activitySearch.value =
                "";


            if (activitySuggestions) {

                activitySuggestions.innerHTML =
                    "";

            }


            if (customActivityBox) {

                customActivityBox.style.display =
                    "none";

            }

        }
    );

}


// ==================================================
// שינוי דקות
// ==================================================

function updateMinutes(
    id,
    value
) {

    const activity =
        allActivityData[dateKey]
            .find(
                item =>
                    item.id === id
            );


    if (!activity) {
        return;
    }


    let minutes =
        Number(value);


    if (
        Number.isNaN(minutes) ||
        minutes < 0
    ) {

        minutes = 0;

    }


    activity.minutes =
        minutes;


    saveActivityData();


    // חשוב:
    // כאן לא קוראים ל־renderActivityTable()
    // כדי לא לאבד את הפוקוס מתיבת הקלט.

    updateActivityTask();

    updateTotal();


    window.dispatchEvent(
        new Event(
            "xpDataChanged"
        )
    );

}


// ==================================================
// מחיקת פעילות
// ==================================================

function deleteActivity(
    id
) {

    allActivityData[dateKey] =
        allActivityData[dateKey]
            .filter(
                item =>
                    item.id !== id
            );


    saveActivityData();

    updateActivityTask();

    renderActivityTable();

    updateTotal();


    window.dispatchEvent(
        new Event(
            "xpDataChanged"
        )
    );

}


// ==================================================
// בניית הטבלה
// ==================================================

function renderActivityTable() {

    if (!activityTableBody) {
        return;
    }


    activityTableBody.innerHTML =
        "";


    const todayActivities =
        allActivityData[dateKey];


    if (emptyActivityMessage) {

        emptyActivityMessage.style.display =
            todayActivities.length === 0
                ? "block"
                : "none";

    }


    todayActivities.forEach(
        activity => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <span
                        class="table-activity-name">

                        ${
                            activity.emoji
                                ? activity.emoji + " "
                                : ""
                        }

                        ${activity.name}

                    </span>

                </td>


                <td>

                    <input
                        type="number"
                        min="0"
                        value="${activity.minutes}"
                        class="minutes-input"
                    >

                </td>


                <td>

                    <button
                        class="delete-activity"
                        type="button">

                        🗑️

                    </button>

                </td>

            `;


            const minutesInput =
                row.querySelector(
                    ".minutes-input"
                );


            minutesInput.addEventListener(
                "input",
                () => {

                    updateMinutes(
                        activity.id,
                        minutesInput.value
                    );

                }
            );


            const deleteButton =
                row.querySelector(
                    ".delete-activity"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteActivity(
                        activity.id
                    );

                }
            );


            activityTableBody.appendChild(
                row
            );

        }
    );


    updateTotal();

}


// ==================================================
// סך הכול
// ==================================================

function updateTotal() {

    if (!activityTotal) {
        return;
    }


    const total =
        getTodayActivityMinutes();


    activityTotal.textContent =
        total;

}


// ==================================================
// חיפוש
// ==================================================

if (activitySearch) {

    activitySearch.addEventListener(
        "input",
        () => {

            showSuggestions(
                activitySearch.value
            );

        }
    );

}


// ==================================================
// סגירת הצעות
// ==================================================

document.addEventListener(
    "click",
    event => {

        if (
            activitySearch &&
            activitySuggestions &&
            !activitySearch.contains(
                event.target
            ) &&
            !activitySuggestions.contains(
                event.target
            )
        ) {

            activitySuggestions.innerHTML =
                "";

        }

    }
);


// ==================================================
// הפעלה
// ==================================================

updateActivityTask();

renderActivityTable();