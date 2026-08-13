// ==================================================
// הגנה על דף המשקל
// ==================================================

if (
    localStorage.getItem(
        "weightAccess"
    ) !== "true"
) {

    window.location.href =
        "weight-login.html";

}

// ==================================================
// הגדרות
// ==================================================

const WEIGHT_LOSS_GOAL = 50;


// ==================================================
// אלמנטים
// ==================================================

const weightInput =
    document.getElementById(
        "weightInput"
    );

const saveWeightButton =
    document.getElementById(
        "saveWeightButton"
    );

const weightLost =
    document.getElementById(
        "weightLost"
    );

const weightRemaining =
    document.getElementById(
        "weightRemaining"
    );

const weighInMessage =
    document.getElementById(
        "weighInMessage"
    );

const weighInCard =
    document.getElementById(
        "weighInCard"
    );

const weightChart =
    document.getElementById(
        "weightChart"
    );

const weightHistory =
    document.getElementById(
        "weightHistory"
    );


// ==================================================
// נתונים
// ==================================================

const weightData =
    JSON.parse(
        localStorage.getItem(
            "weightData"
        )
    ) || {

        startWeight: null,

        weighIns: {}

    };


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


// ==================================================
// מפתח חודש
// ==================================================

function getMonthKey(date) {

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0")
    );

}


const currentMonthKey =
    getMonthKey(today);


// ==================================================
// שמירה
// ==================================================

function saveWeightData() {

    localStorage.setItem(
        "weightData",
        JSON.stringify(
            weightData
        )
    );

}


// ==================================================
// כמה ירדו
// ==================================================

function getWeightLost() {

    if (
        weightData.startWeight === null
    ) {

        return 0;

    }


    const months =
        Object.keys(
            weightData.weighIns
        ).sort();


    if (
        months.length === 0
    ) {

        return 0;

    }


    const latestMonth =
        months[
            months.length - 1
        ];


    const latestWeight =
        Number(
            weightData.weighIns[
                latestMonth
            ]
        );


    return Math.max(
        0,
        weightData.startWeight -
        latestWeight
    );

}


// ==================================================
// כמה נשארו
// ==================================================

function getWeightRemaining() {

    const lost =
        getWeightLost();


    return Math.max(
        0,
        WEIGHT_LOSS_GOAL -
        lost
    );

}


// ==================================================
// הצגת סיכום
// ==================================================

function updateSummary() {

    const lost =
        getWeightLost();


    const remaining =
        getWeightRemaining();


    if (weightLost) {

        weightLost.textContent =
            `${lost.toFixed(1)} ק״ג`;

    }


    if (weightRemaining) {

        weightRemaining.textContent =
            `${remaining.toFixed(1)} ק״ג`;

    }

}


// ==================================================
// האם השקילה החודשית בוצעה
// ==================================================

function hasCurrentMonthWeighIn() {

    return Object.prototype.hasOwnProperty.call(
        weightData.weighIns,
        currentMonthKey
    );

}


// ==================================================
// תאריך השקילה הבאה
// ==================================================

function getNextWeighInDate() {

    let year =
        today.getFullYear();

    let month =
        today.getMonth();


    // אם השקילה של החודש כבר בוצעה
    // או שהיום כבר עבר את ה-1

    if (
        today.getDate() >= 1
    ) {

        month++;

        if (month > 11) {

            month = 0;
            year++;

        }

    }


    return new Date(
        year,
        month,
        1
    );

}


// ==================================================
// הצגת הודעת השקילה
// ==================================================

function updateWeighInMessage() {

    if (
        !weighInMessage ||
        !weighInCard
    ) {

        return;

    }


    weighInCard.classList.remove(
        "weigh-in-today"
    );


    if (
        hasCurrentMonthWeighIn()
    ) {

        const nextWeighIn =
            getNextWeighInDate();


        const nextDate =
            nextWeighIn.toLocaleDateString(
                "he-IL",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );


        weighInMessage.textContent =
            `✅ השקילה של החודש כבר בוצעה. השקילה הבאה: ${nextDate}`;

        return;

    }


    if (
        today.getDate() === 1
    ) {

        weighInMessage.textContent =
            "⚖️ היום הוא יום השקילה החודשי שלך!";

        weighInCard.classList.add(
            "weigh-in-today"
        );

        return;

    }


    const nextWeighIn =
        new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1
        );


    const nextDate =
        nextWeighIn.toLocaleDateString(
            "he-IL",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    weighInMessage.textContent =
        `השקילה הבאה: ${nextDate}`;

}


// ==================================================
// שמירת שקילה
// ==================================================

if (saveWeightButton) {

    saveWeightButton.addEventListener(
        "click",
        () => {

            const value =
                Number(
                    weightInput.value
                );


            if (
                !value ||
                value <= 0
            ) {

                alert(
                    "נא להזין משקל תקין."
                );

                return;

            }


            // --------------------------------------
            // השקילה הראשונה = משקל התחלתי
            // --------------------------------------

            if (
                weightData.startWeight === null
            ) {

                weightData.startWeight =
                    value;

            }


            // --------------------------------------
            // שמירת השקילה לחודש הנוכחי
            // --------------------------------------

            weightData.weighIns[
                currentMonthKey
            ] = value;


            saveWeightData();


            weightInput.value =
                "";


            updateAll();


            if (weighInMessage) {

                weighInMessage.textContent =
                    "✅ השקילה נשמרה בהצלחה!";

            }


            if (weighInCard) {

                weighInCard.classList.remove(
                    "weigh-in-today"
                );

            }

        }
    );

}


// ==================================================
// גרף
// ==================================================

function drawChart() {

    if (!weightChart) {
        return;
    }


    weightChart.innerHTML =
        "";


    const months =
        Object.keys(
            weightData.weighIns
        ).sort();


    if (
        months.length === 0
    ) {

        weightChart.innerHTML = `

            <text
                x="400"
                y="200"
                text-anchor="middle"
                class="chart-empty">

                עדיין אין נתונים להצגת הגרף

            </text>

        `;

        return;

    }


    // ----------------------------------------------
    // מידות
    // ----------------------------------------------

    const width = 800;
    const height = 400;

    const left = 65;
    const right = 55;
    const top = 40;
    const bottom = 60;

    const chartWidth =
        width -
        left -
        right;

    const chartHeight =
        height -
        top -
        bottom;


    // ----------------------------------------------
    // המרה של "כמה נשאר" למיקום בגרף
    // 50 למעלה
    // 0 למטה
    // ----------------------------------------------

    function getY(
        remaining
    ) {

        const value =
            Math.max(
                0,
                Math.min(
                    WEIGHT_LOSS_GOAL,
                    remaining
                )
            );


        return (
            top +
            (
                (
                    WEIGHT_LOSS_GOAL -
                    value
                ) /
                WEIGHT_LOSS_GOAL
            ) *
            chartHeight
        );

    }


    // ----------------------------------------------
    // קווי רקע
    // ----------------------------------------------

    for (
        let value = 0;
        value <= WEIGHT_LOSS_GOAL;
        value += 10
    ) {

        const y =
            getY(value);


        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        line.setAttribute(
            "x1",
            left
        );


        line.setAttribute(
            "x2",
            width - right
        );


        line.setAttribute(
            "y1",
            y
        );


        line.setAttribute(
            "y2",
            y
        );


        line.classList.add(
            "chart-grid-line"
        );


        weightChart.appendChild(
            line
        );


        const label =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );


        label.setAttribute(
            "x",
            left - 12
        );


        label.setAttribute(
            "y",
            y + 4
        );


        label.setAttribute(
            "text-anchor",
            "end"
        );


        label.classList.add(
            "chart-label"
        );


        label.textContent =
            value;


        weightChart.appendChild(
            label
        );

    }


    // ----------------------------------------------
    // יצירת נקודות
    // ----------------------------------------------

    const points =
        months.map(
            (
                month,
                index
            ) => {

                const weight =
                    Number(
                        weightData.weighIns[
                            month
                        ]
                    );


                const lost =
                    Math.max(
                        0,
                        weightData.startWeight -
                        weight
                    );


                const remaining =
                    Math.max(
                        0,
                        WEIGHT_LOSS_GOAL -
                        lost
                    );


                const x =
                    months.length === 1
                        ? left +
                          chartWidth / 2
                        : left +
                          (
                              index /
                              (
                                  months.length -
                                  1
                              )
                          ) *
                          chartWidth;


                const y =
                    getY(
                        remaining
                    );


                return {

                    month,
                    weight,
                    lost,
                    remaining,
                    x,
                    y

                };

            }
        );


    // ----------------------------------------------
    // קו
    // ----------------------------------------------

    if (
        points.length > 1
    ) {

        const polyline =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polyline"
            );


        polyline.setAttribute(
            "points",
            points
                .map(
                    point =>
                        `${point.x},${point.y}`
                )
                .join(" ")
        );


        polyline.classList.add(
            "chart-line"
        );


        weightChart.appendChild(
            polyline
        );

    }


    // ----------------------------------------------
    // נקודות + תוויות
    // ----------------------------------------------

    points.forEach(
        (
            point,
            index
        ) => {

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                point.x
            );


            circle.setAttribute(
                "cy",
                point.y
            );


            circle.setAttribute(
                "r",
                "6"
            );


            circle.classList.add(
                "chart-point"
            );


            weightChart.appendChild(
                circle
            );


            // --------------------------------------
            // משקל ליד הנקודה
            // --------------------------------------

            const weightLabel =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            weightLabel.setAttribute(
                "x",
                point.x
            );


            weightLabel.setAttribute(
                "y",
                point.y - 12
            );


            weightLabel.setAttribute(
                "text-anchor",
                "middle"
            );


            weightLabel.classList.add(
                "chart-weight-label"
            );


            weightLabel.textContent =
                `${point.weight.toFixed(1)} ק״ג`;


            weightChart.appendChild(
                weightLabel
            );


            // --------------------------------------
            // חודש
            // --------------------------------------

            const monthLabel =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            monthLabel.setAttribute(
                "x",
                point.x
            );


            monthLabel.setAttribute(
                "y",
                height - 20
            );


            monthLabel.setAttribute(
                "text-anchor",
                "middle"
            );


            monthLabel.classList.add(
                "chart-label"
            );


            monthLabel.textContent =
                point.month;


            weightChart.appendChild(
                monthLabel
            );

        }
    );

}


// ==================================================
// היסטוריית שקילות
// ==================================================

function renderHistory() {

    if (!weightHistory) {
        return;
    }


    weightHistory.innerHTML =
        "";


    const months =
        Object.keys(
            weightData.weighIns
        ).sort()
        .reverse();


    if (
        months.length === 0
    ) {

        weightHistory.innerHTML = `

            <p class="weight-empty">
                עדיין לא נשמרו שקילות.
            </p>

        `;

        return;

    }


    months.forEach(
        month => {

            const weight =
                Number(
                    weightData.weighIns[
                        month
                    ]
                );


            const lost =
                Math.max(
                    0,
                    weightData.startWeight -
                    weight
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "weight-history-row";


            row.innerHTML = `

                <span>
                    ${month}
                </span>

                <strong>
                    ${weight.toFixed(1)} ק״ג
                </strong>

                <span>
                    ירדו ${lost.toFixed(1)} ק״ג
                </span>

                <button
                    type="button"
                    class="delete-weight-button"
                    data-month="${month}">

                    🗑️

                </button>

            `;


            const deleteButton =
                row.querySelector(
                    ".delete-weight-button"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        confirm(
                            `למחוק את השקילה של ${month}?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    delete weightData.weighIns[
                        month
                    ];


                    // אם לא נשארה שום שקילה,
                    // מאפסים גם את משקל ההתחלה

                    if (
                        Object.keys(
                            weightData.weighIns
                        ).length === 0
                    ) {

                        weightData.startWeight =
                            null;

                    }


                    saveWeightData();

                    updateAll();

                }
            );


            weightHistory.appendChild(
                row
            );

        }
    );

}


// ==================================================
// עדכון הכול
// ==================================================

function updateAll() {

    updateSummary();

    updateWeighInMessage();

    drawChart();

    renderHistory();

}


// ==================================================
// הפעלה
// ==================================================

updateAll();