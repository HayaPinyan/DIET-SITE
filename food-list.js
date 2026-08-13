// ==================================================
// הגדרות
// ==================================================

const FOOD_CATALOG_KEY =
    "foodCatalog";


// ==================================================
// אלמנטים
// ==================================================

const tableBody =
    document.getElementById(
        "foodListTableBody"
    );

const emptyMessage =
    document.getElementById(
        "emptyFoodList"
    );

const addRowButton =
    document.getElementById(
        "addFoodRowButton"
    );

const messageElement =
    document.getElementById(
        "foodListMessage"
    );


// ==================================================
// אימוג'ים
// ==================================================

const foodEmojiMap = {

"אבוקדו": "🥑",
"פיצה": "🍕",
"המבורגר": "🍔",
"צ'יפס": "🍟",
"נקניקייה": "🌭",
"פופקורן": "🍿",
"מלח": "🧂",
"בייקון": "🥓",
"ביצה": "🥚",
"חביתה": "🍳",
"וופל": "🧇",
"פנקייק": "🥞",
"חמאה": "🧈",
"לחם": "🍞",
"קרואסון": "🥐",
"בייגלה": "🥨",
"בייגל": "🥯",
"לחמניה": "🥖",
"לאפה": "🫓",
"גבינה": "🧀",
"סלט": "🥗",
"פיתה": "🥙",
"סנדוויץ'": "🥪",
"טאקו": "🌮",
"בוריטו": "🌯",
"טמאלי": "🫔",
"שימורים": "🥫",
"בשר": "🍖",
"עוף": "🍗",
"סטייק": "🥩",
"בטטה": "🍠",
"כיסונים": "🥟",
"עוגיית מזל": "🥠",
"טייק אוויי": "🥡",
"בנטו": "🍱",
"פריכיות": "🍘",
"אוניגירי": "🍙",
"אורז": "🍚",
"קארי": "🍛",
"ראמן": "🍜",
"צדפה": "🦪",
"סושי": "🍣",
"שרימפס": "🍤",
"נארוטומאקי": "🍥",
"מאפה יפני": "🥮",
"שיפוד": "🍢",
"פלאפל": "🧆",
"תבשיל": "🥘",
"מרק": "🍲",
"פונדו": "🫕",
"פסטה": "🍝",
"קוואקר": "🥣",
"פאי": "🥧",
"גלידה": "🍦",
"ברד": "🍧",
"גלידה בגביע": "🍨",
"דונאט": "🍩",
"עוגיה": "🍪",
"עוגת יום הולדת": "🎂",
"קאפ קייק": "🧁",
"עוגה": "🍰",
"שוקולד": "🍫",
"סוכרייה": "🍬",
"סוכריית מקל": "🍭",
"דנגו": "🍡",
"פודינג": "🍮",
"דבש": "🍯",
"בקבוק תינוק": "🍼",
"חלב": "🥛",
"מיץ": "🧃",
"קפה": "☕",
"תה": "🫖",
"תה ירוק": "🍵",
"מאטה": "🧉",
"סאקה": "🍶",
"שמפניה": "🍾",
"יין": "🍷",
"קוקטייל": "🍸",
"משקה טרופי": "🍹",
"בירה": "🍺",
"בירות": "🍻",
"יין מבעבע": "🥂",
"משקה": "🥃",
"משקה שנמזג": "🫗",
"קוביית קרח": "🧊",
"משקה קל": "🥤",
"תה בועות": "🧋",
"מקלות אכילה": "🥢",
"צלחת": "🍽️",
"מזלג וסכין": "🍴",
"כף": "🥄",
"כד": "🏺",
"קיווי": "🥝",
"קוקוס": "🥥",
"ענבים": "🍇",
"מלון": "🍈",
"חסה": "🥬",
"אבטיח": "🍉",
"תפוז": "🍊",
"לימון": "🍋",
"ליים": "🍋‍🟩",
"בננה": "🍌",
"אננס": "🍍",
"מנגו": "🥭",
"תות": "🍓",
"דובדבן": "🍒",
"אפרסק": "🍑",
"אגס": "🍐",
"תפוח ירוק": "🍏",
"תפוח": "🍎",
"אוכמניות": "🫐",
"עגבנייה": "🍅",
"זית": "🫒",
"חציל": "🍆",
"תירס": "🌽",
"פלפל חריף": "🌶️",
"מלפפון": "🥒",
"אבוקדו": "🥑",
"פטרייה": "🍄",
"פלפל": "🫑",
"ברוקולי": "🥦",
"תפוח אדמה": "🥔",
"שום": "🧄",
"בצל": "🧅",
"גזר": "🥕",
"ערמון": "🌰",
"שעועית": "🫘",
"בוטנים": "🥜",
"צנונית": "🫜",
"פטרייה חומה": "🍄‍🟫",
"אפונה": "🫛",
"ג'ינג'ר": "🫚"
};


// ==================================================
// טעינת נתונים
// ==================================================

let foodCatalog =
    JSON.parse(
        localStorage.getItem(
            FOOD_CATALOG_KEY
        )
    ) || [];


// ==================================================
// שמירה
// ==================================================

function saveCatalog() {

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

function getEmoji(
    name
) {

    const cleanName =
        name.trim();


    if (
        foodEmojiMap[
            cleanName
        ]
    ) {

        return foodEmojiMap[
            cleanName
        ];

    }


    return "";

}


// ==================================================
// מיון
// ==================================================

function sortCatalog() {

    foodCatalog.sort(
        (
            a,
            b
        ) =>
            a.name.localeCompare(
                b.name,
                "he"
            )
    );

}


// ==================================================
// הצגת הודעה
// ==================================================

function showMessage(
    text
) {

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        text;


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            () => {

                messageElement.textContent =
                    "";

            },
            1800
        );

}


// ==================================================
// יצירת שורה
// ==================================================

function createRow(
    food
) {

    const row =
        document.createElement(
            "tr"
        );


    row.dataset.id =
        food.id;


    row.innerHTML = `

        <td>

            <div class="food-table-name">

                <span
                    class="food-table-emoji">
                    ${food.emoji || ""}
                </span>

                <input
                    type="text"
                    class="food-name-input"
                    value="${escapeHtml(food.name)}"
                    placeholder="שם המאכל"
                    autocomplete="off">

            </div>

        </td>


        <td>

            <input
                type="text"
                class="food-amount-input"
                value="${escapeHtml(food.amount)}"
                placeholder="לדוגמה: 1 יחידה">

        </td>


        <td>

            <input
                type="number"
                min="0"
                step="1"
                class="food-calories-input"
                value="${food.calories ?? ""}"
                placeholder="קלוריות">

        </td>


        <td>

            <button
                type="button"
                class="delete-food-row"
                title="מחיקה">

                🗑️

            </button>

        </td>

    `;


    const nameInput =
        row.querySelector(
            ".food-name-input"
        );

    const amountInput =
        row.querySelector(
            ".food-amount-input"
        );

    const caloriesInput =
        row.querySelector(
            ".food-calories-input"
        );

    const emojiElement =
        row.querySelector(
            ".food-table-emoji"
        );

    const deleteButton =
        row.querySelector(
            ".delete-food-row"
        );


    // ----------------------------------------------
    // שם
    // ----------------------------------------------

    nameInput.addEventListener(
        "input",
        () => {

            food.name =
                nameInput.value;


            food.emoji =
                getEmoji(
                    nameInput.value
                );


            emojiElement.textContent =
                food.emoji;


            saveCatalog();

        }
    );


    // ----------------------------------------------
    // כמות
    // ----------------------------------------------

    amountInput.addEventListener(
        "input",
        () => {

            food.amount =
                amountInput.value;


            saveCatalog();

        }
    );


    // ----------------------------------------------
    // קלוריות
    // ----------------------------------------------

    caloriesInput.addEventListener(
        "input",
        () => {

            food.calories =
                caloriesInput.value === ""
                    ? ""
                    : Number(
                        caloriesInput.value
                    );


            saveCatalog();

        }
    );


    // ----------------------------------------------
    // מחיקה
    // ----------------------------------------------

    deleteButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "למחוק את המאכל הזה?"
                );


            if (!confirmed) {
                return;
            }


            foodCatalog =
                foodCatalog.filter(
                    item =>
                        item.id !==
                        food.id
                );


            saveCatalog();

            renderTable();

        }
    );


    return row;

}


// ==================================================
// מניעת הכנסת HTML בשם המאכל
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
// רינדור
// ==================================================

function renderTable() {

    tableBody.innerHTML =
        "";


    sortCatalog();


    if (
        emptyMessage
    ) {

        emptyMessage.style.display =
            foodCatalog.length === 0
                ? "block"
                : "none";

    }


    foodCatalog.forEach(
        food => {

            tableBody.appendChild(
                createRow(food)
            );

        }
    );

}


// ==================================================
// הוספת שורה
// ==================================================

// ==================================================
// הוספת שורה
// ==================================================

function addFoodRow() {

    const newFood = {

        id:
            Date.now(),

        name:
            "",

        emoji:
            "",

        amount:
            "",

        calories:
            ""

    };


    foodCatalog.push(
        newFood
    );


    saveCatalog();


    renderTable();


    // ----------------------------------------------
    // מיקוד בשורה החדשה
    // ----------------------------------------------

    const newRow =
        tableBody.querySelector(
            `tr[data-id="${newFood.id}"]`
        );


    if (newRow) {

        const input =
            newRow.querySelector(
                ".food-name-input"
            );


        if (input) {

            input.focus();

        }

    }


    showMessage(
        "נוספה שורה חדשה ✨"
    );

}


if (addRowButton) {

    addRowButton.addEventListener(
        "click",
        addFoodRow
    );

}


// ==================================================
// הפעלה
// ==================================================

renderTable();