// ==================================================
// אלמנטים
// ==================================================

const foodSearch =
    document.getElementById(
        "foodSearch"
    );

const foodSuggestions =
    document.getElementById(
        "foodSuggestions"
    );

const customFoodBox =
    document.getElementById(
        "customFoodBox"
    );

const customFoodText =
    document.getElementById(
        "customFoodText"
    );

const addCustomFood =
    document.getElementById(
        "addCustomFood"
    );

const foodTableBody =
    document.getElementById(
        "foodTableBody"
    );

const foodTotal =
    document.getElementById(
        "foodTotal"
    );

const emptyFoodMessage =
    document.getElementById(
        "emptyFoodMessage"
    );


// ==================================================
// מפתח מאגר המאכלים
// ==================================================

const FOOD_CATALOG_KEY =
    "foodCatalog";


// ==================================================
// מאכלים מובנים - רק לצורך אימוג'י
// ==================================================

const builtInFoodEmoji = {

    "תפוח":
        "🍎",

    "תפוח אדום":
        "🍎",

    "תפוח ירוק":
        "🍏",

    "תפוח אדמה":
        "🥔",

    "בננה":
        "🍌",

    "תפוז":
        "🍊",

    "לימון":
        "🍋",

    "אבטיח":
        "🍉",

    "ענבים":
        "🍇",

    "תות":
        "🍓",

    "תותים":
        "🍓",

    "אפרסק":
        "🍑",

    "אננס":
        "🍍",

    "קוקוס":
        "🥥",

    "אבוקדו":
        "🥑",

    "עגבנייה":
        "🍅",

    "עגבניה":
        "🍅",

    "חציל":
        "🍆",

    "גזר":
        "🥕",

    "תירס":
        "🌽",

    "פלפל":
        "🌶️",

    "מלפפון":
        "🥒",

    "חסה":
        "🥬",

    "ברוקולי":
        "🥦",

    "פטריות":
        "🍄",

    "לחם":
        "🍞",

    "קרואסון":
        "🥐",

    "בייגלה":
        "🥨",

    "פיצה":
        "🍕",

    "המבורגר":
        "🍔",

    "צ'יפס":
        "🍟",

    "נקניקייה":
        "🌭",

    "טאקו":
        "🌮",

    "סנדוויץ'":
        "🥪",

    "פסטה":
        "🍝",

    "אורז":
        "🍚",

    "מרק":
        "🍲",

    "ביצה":
        "🥚",

    "חלב":
        "🥛",

    "גבינה":
        "🧀",

    "יוגורט":
        "🥣",

    "עוף":
        "🍗",

    "בשר":
        "🥩",

    "דג":
        "🐟",

    "עוגה":
        "🍰",

    "עוגייה":
        "🍪",

    "שוקולד":
        "🍫",

    "ופלים":
        "🧇",

    "סוכרייה":
        "🍬",

    "גלידה":
        "🍦",

    "קפה":
        "☕",

    "תה":
        "🍵",

    "מיץ":
        "🥤",

    "אייס קפה":
        "🧋",

    "פופקורן":
        "🍿",

    "קרקר":
        "🫓",

    "פריכיות":
        "🍘",

    "חביתה":
        "🍳"

};


// ==================================================
// מאגר אישי
// ==================================================

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
// נתוני היום
// ==================================================

const today =
    new Date();


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
// טעינת האוכל ששמור
// ==================================================

const allFoodData =
    JSON.parse(
        localStorage.getItem(
            "foodData"
        )
    ) || {};


if (
    !allFoodData[dateKey]
) {

    allFoodData[dateKey] = [];

}


// ==================================================
// שמירת נתוני היום
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
// שמירת המאגר
// ==================================================

function saveFoodCatalog() {

    localStorage.setItem(
        FOOD_CATALOG_KEY,
        JSON.stringify(
            foodCatalog
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
// חיפוש במאגר
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


    // ----------------------------------------------
    // הצעות מהמאגר האישי
    // ----------------------------------------------

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
                            food.amount
                                ? " · "
                                : ""
                        }
                        ${Number(food.calories || 0)} קלוריות
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


    // ----------------------------------------------
    // מאכל חופשי
    // ----------------------------------------------

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
// הוספת מאכל מהמאגר
// ==================================================

function addFoodFromCatalog(
    catalogFood
) {

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

        amount:
            catalogFood.amount || "",

        calories:
            Number(
                catalogFood.calories
            ) || 0

    });


    saveFoodData();

    renderFoodTable();

    updateTotal();

}


// ==================================================
// הוספת מאכל חופשי
// ==================================================

if (
    addCustomFood
) {

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
// הוספת מאכל ידני
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

        amount:
            "",

        calories:
            0

    });


    saveFoodData();

    renderFoodTable();

    updateTotal();

}


// ==================================================
// שינוי כמות
// ==================================================

function updateAmount(
    id,
    value
) {

    const food =
        allFoodData[
            dateKey
        ].find(
            item =>
                item.id === id
        );


    if (!food) {

        return;

    }


    food.amount =
        value;


    saveFoodData();

}


// ==================================================
// שינוי קלוריות
// ==================================================

function updateCalories(
    id,
    value
) {

    const food =
        allFoodData[
            dateKey
        ].find(
            item =>
                item.id === id
        );


    if (!food) {

        return;

    }


    if (
        value === ""
    ) {

        food.calories =
            "";

    }
    else {

        let calories =
            Number(value);


        if (
            Number.isNaN(
                calories
            ) ||
            calories < 0
        ) {

            calories = 0;

        }


        food.calories =
            calories;

    }


    saveFoodData();

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

function deleteFood(
    id
) {

    allFoodData[dateKey] =
        allFoodData[
            dateKey
        ].filter(
            item =>
                item.id !== id
        );


    saveFoodData();

    renderFoodTable();

    updateTotal();

}


// ==================================================
// בניית הטבלה
// ==================================================

function renderFoodTable() {

    foodTableBody.innerHTML =
        "";


    const todayFoods =
        allFoodData[
            dateKey
        ];


    if (
        todayFoods.length === 0
    ) {

        emptyFoodMessage.style.display =
            "block";

    }
    else {

        emptyFoodMessage.style.display =
            "none";

    }


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
                        value="${escapeHtml(food.amount || "")}"
                        placeholder="כמות"
                        class="amount-input"
                        readonly>

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


            // ------------------------------------------
            // כמות
            // ------------------------------------------

            const amountInput =
                row.querySelector(
                    ".amount-input"
                );


            // הכמות לקריאה בלבד
            // אין אפשרות לערוך אותה מהטבלה


            // ------------------------------------------
            // קלוריות
            // ------------------------------------------

            const calorieInput =
                row.querySelector(
                    ".calorie-input"
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


            // ------------------------------------------
            // מחיקה
            // ------------------------------------------

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
// חישוב סה"כ
// ==================================================

function updateTotal() {

    const total =
        allFoodData[
            dateKey
        ].reduce(
            (
                sum,
                food
            ) => {

                return (
                    sum +
                    Number(
                        food.calories || 0
                    )
                );

            },
            0
        );


    foodTotal.textContent =
        total;

}


// ==================================================
// חיפוש
// ==================================================

if (
    foodSearch
) {

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
// סגירת הצעות בלחיצה בחוץ
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
// עזר לבטיחות HTML
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