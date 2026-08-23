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
// יעד
// ==================================================

const DAILY_ACTIVITY_TARGET = 20;


// ==================================================
// היום באתר
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


const dateKey =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
        today.getDate()
    ).padStart(2, "0");


// ==================================================
// נתונים
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
// מצב יעד
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
            ) =>
                total +
                Number(
                    activity.minutes || 0
                ),
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
// אנימציה
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
// משימת פעילות
// ==================================================

function updateActivityTask() {

    const total =
        getTodayActivityMinutes();


    const wasSuccessful =
        activityWasSuccessful;


    const isSuccessful =
        total >= DAILY_ACTIVITY_TARGET;


    dietData[dateKey].activity =
        isSuccessful;


    localStorage.setItem(
        "dietData",
        JSON.stringify(
            dietData
        )
    );


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
// הצעות
// ==================================================

function showSuggestions(
    value
) {

    if (!activitySuggestions) {
        return;
    }


    activitySuggestions.innerHTML =
        "";

    customActivityBox.style.display =
        "none";


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


                    activitySearch.value =
                        "";

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
        matches.length === 0
    ) {

        customActivityText.textContent =
            `הפעילות "${searchText}" לא נמצאה במאגר.`;

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

            activitySuggestions.innerHTML =
                "";

            customActivityBox.style.display =
                "none";

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


    activity.minutes =
        (
            value === ""
                ? 0
                : Math.max(
                    0,
                    Number(value) || 0
                )
        );


    saveActivityData();

    updateActivityTask();

    updateTotal();


    window.dispatchEvent(
        new Event(
            "xpDataChanged"
        )
    );

}


// ==================================================
// מחיקה
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
// טבלה
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
                        class="minutes-input">

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
// סה"כ
// ==================================================

function updateTotal() {

    if (!activityTotal) {
        return;
    }


    activityTotal.textContent =
        getTodayActivityMinutes();

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