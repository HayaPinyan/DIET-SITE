// ==================================================
// אלמנטים
// ==================================================

const foodSearch =
    document.getElementById("foodSearch");

const foodSuggestions =
    document.getElementById("foodSuggestions");

const customFoodBox =
    document.getElementById("customFoodBox");

const customFoodText =
    document.getElementById("customFoodText");

const addCustomFood =
    document.getElementById("addCustomFood");

const foodTableBody =
    document.getElementById("foodTableBody");

const foodTotal =
    document.getElementById("foodTotal");

const emptyFoodMessage =
    document.getElementById("emptyFoodMessage");


// ==================================================
// מאגר אישי
// ==================================================

const FOOD_CATALOG_KEY =
    "foodCatalog";


const builtInFoodEmoji = {

    "תפוח": "🍎",
    "תפוח אדום": "🍎",
    "תפוח ירוק": "🍏",
    "תפוח אדמה": "🥔",
    "בננה": "🍌",
    "תפוז": "🍊",
    "לימון": "🍋",
    "אבטיח": "🍉",
    "ענבים": "🍇",
    "תות": "🍓",
    "תותים": "🍓",
    "אפרסק": "🍑",
    "אננס": "🍍",
    "קוקוס": "🥥",
    "אבוקדו": "🥑",
    "עגבנייה": "🍅",
    "עגבניה": "🍅",
    "חציל": "🍆",
    "גזר": "🥕",
    "תירס": "🌽",
    "פלפל": "🌶️",
    "מלפפון": "🥒",
    "חסה": "🥬",
    "ברוקולי": "🥦",
    "פטריות": "🍄",
    "לחם": "🍞",
    "קרואסון": "🥐",
    "בייגלה": "🥨",
    "פיצה": "🍕",
    "המבורגר": "🍔",
    "צ'יפס": "🍟",
    "נקניקייה": "🌭",
    "טאקו": "🌮",
    "סנדוויץ'": "🥪",
    "פסטה": "🍝",
    "אורז": "🍚",
    "מרק": "🍲",
    "ביצה": "🥚",
    "חלב": "🥛",
    "גבינה": "🧀",
    "יוגורט": "🥣",
    "עוף": "🍗",
    "בשר": "🥩",
    "דג": "🐟",
    "עוגה": "🍰",
    "עוגייה": "🍪",
    "שוקולד": "🍫",
    "ופלים": "🧇",
    "סוכרייה": "🍬",
    "גלידה": "🍦",
    "קפה": "☕",
    "תה": "🍵",
    "מיץ": "🥤",
    "אייס קפה": "🧋",
    "פופקורן": "🍿",
    "קרקר": "🫓",
    "פריכיות": "🍘",
    "חביתה": "🍳"

};


function loadFoodCatalog() {

    return (
        JSON.parse(
            localStorage.getItem(
                FOOD_CATALOG_KEY
            )
        ) || []
    );

}


let foodCatalog =
    loadFoodCatalog();


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
// נתוני היום
// ==================================================

const allFoodData =
    JSON.parse(
        localStorage.getItem(
            "foodData"
        )
    ) || {};


if (!allFoodData[dateKey]) {

    allFoodData[dateKey] = [];

}


// ==================================================
// שמירה
// ==================================================

function saveFoodData() {

    localStorage.setItem(
        "foodData",
        JSON.stringify(
            allFoodData
        )
    );

}


// ==================================================
// אימוג'י
// ==================================================

function getFoodEmoji(
    name
) {

    const cleanName =
        name.trim();


    if (
        builtInFoodEmoji[
            cleanName
        ]
    ) {

        return builtInFoodEmoji[
            cleanName
        ];

    }


    const catalogFood =
        foodCatalog.find(
            food =>
                food.name &&
                food.name.trim()
                    .localeCompare(
                        cleanName,
                        "he",
                        {
                            sensitivity:
                                "base"
                        }
                    ) === 0
        );


    if (
        catalogFood &&
        catalogFood.emoji
    ) {

        return catalogFood.emoji;

    }


    return "";

}


// ==================================================
// התאמות למאגר
// ==================================================

function findCatalogMatches(
    searchText
) {

    const cleanSearch =
        searchText.trim();


    if (!cleanSearch) {
        return [];
    }


    return foodCatalog.filter(
        food =>
            food.name &&
            food.name.includes(
                cleanSearch
            )
    );

}


// ==================================================
// הצעות
// ==================================================

function showSuggestions(
    value
) {

    foodSuggestions.innerHTML =
        "";

    customFoodBox.style.display =
        "none";


    const searchText =
        value.trim();


    if (!searchText) {
        return;
    }


    const matches =
        findCatalogMatches(
            searchText
        );


    matches.forEach(
        food => {

            const suggestion =
                document.createElement(
                    "div"
                );


            suggestion.className =
                "food-suggestion";


            suggestion.innerHTML = `

                <span
                    class="food-suggestion-emoji">

                    ${food.emoji || getFoodEmoji(food.name)}

                </span>

                <span
                    class="food-suggestion-content">

                    <strong>
                        ${escapeHtml(food.name)}
                    </strong>

                    <small>

                        ${escapeHtml(food.amount || "")}

                        ${
                            food.amount && food.unit
                                ? " "
                                : ""
                        }

                        ${escapeHtml(food.unit || "")}

                        ${
                            food.amount || food.unit
                                ? " · "
                                : ""
                        }

                        ${Number(food.calories || 0)}
                        קלוריות

                    </small>

                </span>

            `;


            suggestion.addEventListener(
                "click",
                () => {

                    addFoodFromCatalog(
                        food
                    );


                    foodSearch.value =
                        "";

                    foodSuggestions.innerHTML =
                        "";

                }
            );


            foodSuggestions.appendChild(
                suggestion
            );

        }
    );


    if (
        matches.length === 0
    ) {

        customFoodText.textContent =
            `המאכל "${searchText}" לא נמצא במאגר. אפשר להוסיף אותו ידנית.`;

        customFoodBox.style.display =
            "block";

    }

}


// ==================================================
// הוספה מהמאגר
// ==================================================

function addFoodFromCatalog(
    catalogFood
) {

    const baseAmount =
        Number(
            catalogFood.amount
        ) || 0;

    const baseCalories =
        Number(
            catalogFood.calories
        ) || 0;


    allFoodData[dateKey].push({

        id:
            Date.now(),

        name:
            catalogFood.name,

        emoji:
            catalogFood.emoji ||
            getFoodEmoji(
                catalogFood.name
            ),

        unit:
            catalogFood.unit || "",

        amount:
            catalogFood.amount || "",

        calories:
            baseCalories,

        // ------------------------------------------
        // "בסיס" מהמאגר, לחישוב קלוריות יחסי
        // כשמשנים את הכמות
        // ------------------------------------------

        baseAmount:
            baseAmount,

        baseCalories:
            baseCalories

    });


    saveFoodData();

    renderFoodTable();

    updateTotal();


    window.dispatchEvent(
        new Event("xpDataChanged")
    );

}


// ==================================================
// מאכל חופשי
// ==================================================

if (addCustomFood) {

    addCustomFood.addEventListener(
        "click",
        () => {

            const name =
                foodSearch.value.trim();


            if (!name) {
                return;
            }


            addFood(
                name,
                getFoodEmoji(name)
            );


            foodSearch.value =
                "";

            foodSuggestions.innerHTML =
                "";

            customFoodBox.style.display =
                "none";

        }
    );

}


// ==================================================
// הוספת מאכל
// ==================================================

function addFood(
    name,
    emoji = ""
) {

    allFoodData[dateKey].push({

        id:
            Date.now(),

        name:
            name,

        emoji:
            emoji,

        unit:
            "",

        amount:
            "",

        calories:
            0,

        baseAmount:
            0,

        baseCalories:
            0

    });


    saveFoodData();

    renderFoodTable();

    updateTotal();


    window.dispatchEvent(
        new Event("xpDataChanged")
    );

}


// ==================================================
// שינוי יחידה
// ==================================================

function updateUnit(
    id,
    value
) {

    const food =
        allFoodData[dateKey]
            .find(
                item =>
                    item.id === id
            );


    if (!food) {
        return;
    }


    food.unit =
        value;


    saveFoodData();

}


// ==================================================
// שינוי כמות
// ==================================================
//
// אם למאכל יש "בסיס" מהמאגר (כמות + קלוריות),
// הקלוריות מתעדכנות אוטומטית באופן יחסי לכמות החדשה.
// ==================================================

function updateAmount(
    id,
    value,
    calorieInput
) {

    const food =
        allFoodData[dateKey]
            .find(
                item =>
                    item.id === id
            );


    if (!food) {
        return;
    }


    food.amount =
        value;


    const hasBase =
        Number(food.baseAmount) > 0;


    if (hasBase) {

        const newAmount =
            Number(value) || 0;


        const newCalories =
            Math.round(
                (
                    food.baseCalories *
                    newAmount
                ) /
                food.baseAmount
            );


        food.calories =
            newCalories;


        if (calorieInput) {

            calorieInput.value =
                newCalories;

        }

    }


    saveFoodData();

    updateTotal();


    window.dispatchEvent(
        new Event("xpDataChanged")
    );

}


// ==================================================
// שינוי קלוריות
// ==================================================

function updateCalories(
    id,
    value
) {

    const food =
        allFoodData[dateKey]
            .find(
                item =>
                    item.id === id
            );


    if (!food) {
        return;
    }


    food.calories =
        value === ""
            ? ""
            : Math.max(
                0,
                Number(value) || 0
            );


    // ----------------------------------------------
    // אם עדכנו את הקלוריות ידנית, "מבסיסים" מחדש
    // את היחס מול הכמות הנוכחית - כך ששינוי כמות
    // עתידי ימשיך לחשב באופן יחסי נכון
    // ----------------------------------------------

    const currentAmount =
        Number(food.amount);


    if (
        currentAmount > 0 &&
        food.calories !== ""
    ) {

        food.baseAmount =
            currentAmount;

        food.baseCalories =
            food.calories;

    }


    saveFoodData();

    updateTotal();


    window.dispatchEvent(
        new Event("xpDataChanged")
    );

}


// ==================================================
// מחיקה
// ==================================================

function deleteFood(
    id
) {

    allFoodData[dateKey] =
        allFoodData[dateKey]
            .filter(
                item =>
                    item.id !== id
            );


    saveFoodData();

    renderFoodTable();

    updateTotal();


    window.dispatchEvent(
        new Event("xpDataChanged")
    );

}


// ==================================================
// טבלה
// ==================================================

function renderFoodTable() {

    foodTableBody.innerHTML =
        "";


    const todayFoods =
        allFoodData[dateKey];


    emptyFoodMessage.style.display =
        todayFoods.length === 0
            ? "block"
            : "none";


    todayFoods.forEach(
        food => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <span
                        class="table-food-name">

                        <span
                            class="table-food-emoji">

                            ${food.emoji || ""}

                        </span>

                        ${escapeHtml(food.name)}

                    </span>

                </td>


                <td>

                    <input
                        type="text"
                        value="${escapeHtml(food.unit || "")}"
                        placeholder="כוס, גרם..."
                        list="unitOptions"
                        autocomplete="off"
                        class="unit-input">

                </td>


                <td>

                    <input
                        type="text"
                        value="${escapeHtml(food.amount || "")}"
                        placeholder="כמות"
                        class="amount-input">

                </td>


                <td>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        value="${
                            food.calories === ""
                                ? ""
                                : food.calories
                        }"
                        placeholder="קלוריות"
                        class="calorie-input">

                </td>


                <td>

                    <button
                        class="delete-food"
                        type="button">

                        🗑️

                    </button>

                </td>

            `;


            const unitInput =
                row.querySelector(
                    ".unit-input"
                );


            unitInput.addEventListener(
                "input",
                () => {

                    updateUnit(
                        food.id,
                        unitInput.value
                    );

                }
            );


            const calorieInput =
                row.querySelector(
                    ".calorie-input"
                );


            const amountInput =
                row.querySelector(
                    ".amount-input"
                );


            amountInput.addEventListener(
                "input",
                () => {

                    updateAmount(
                        food.id,
                        amountInput.value,
                        calorieInput
                    );

                }
            );


            calorieInput.addEventListener(
                "input",
                () => {

                    updateCalories(
                        food.id,
                        calorieInput.value
                    );

                }
            );


            const deleteButton =
                row.querySelector(
                    ".delete-food"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteFood(
                        food.id
                    );

                }
            );


            foodTableBody.appendChild(
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

    const total =
        allFoodData[dateKey]
            .reduce(
                (
                    sum,
                    food
                ) =>
                    sum +
                    Number(
                        food.calories || 0
                    ),
                0
            );


    foodTotal.textContent =
        total;

}


// ==================================================
// חיפוש
// ==================================================

if (foodSearch) {

    foodSearch.addEventListener(
        "input",
        () => {

            showSuggestions(
                foodSearch.value
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
            foodSearch &&
            foodSuggestions &&
            !foodSearch.contains(
                event.target
            ) &&
            !foodSuggestions.contains(
                event.target
            )
        ) {

            foodSuggestions.innerHTML =
                "";

        }

    }
);


// ==================================================
// עזר
// ==================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==================================================
// הפעלה
// ==================================================

renderFoodTable();