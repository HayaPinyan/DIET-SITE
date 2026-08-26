// בדיקה אם המשתמשת עברה דרך דף התחברות
if (sessionStorage.getItem("is_authenticated") !== "true") {
    window.location.href = "weight-login.html";
}
// ==================================================
// אלמנטים
// ==================================================
const weightInput = document.getElementById("weightInput");
const saveWeightButton = document.getElementById("saveWeightButton");
const currentWeightEl = document.getElementById("currentWeight");
const weightLostEl = document.getElementById("weightLost");
const startWeightEl = document.getElementById("startWeight");
const weightChart = document.getElementById("weightChart");
const weightHistory = document.getElementById("weightHistory");

// ==================================================
// טעינת נתונים
// ==================================================
let weightData = JSON.parse(localStorage.getItem("weightData_v2")) || [];

// תמיכה בנתונים ישנים אם קיימים
if (!Array.isArray(weightData)) {
    weightData = [];
}

function saveWeightData() {
    localStorage.setItem("weightData_v2", JSON.stringify(weightData));
}

// ==================================================
// הוספת שקילה
// ==================================================
if (saveWeightButton) {
    saveWeightButton.addEventListener("click", () => {
        const val = Number(weightInput.value);

        if (!val || val <= 0) {
            alert("נא להזין משקל תקין.");
            return;
        }

        const now = new Date();
        const timestamp = now.toISOString();
        const displayDate = now.toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        weightData.push({
            weight: val,
            timestamp: timestamp,
            dateStr: displayDate
        });

        saveWeightData();
        weightInput.value = "";
        updateAll();
    });
}

// ==================================================
// עדכון סיכום
// ==================================================
function updateSummary() {
    if (weightData.length === 0) {
        if (currentWeightEl) currentWeightEl.textContent = "-- ק״ג";
        if (startWeightEl) startWeightEl.textContent = "-- ק״ג";
        if (weightLostEl) weightLostEl.textContent = "0 ק״ג";
        return;
    }

    const first = weightData[0].weight;
    const latest = weightData[weightData.length - 1].weight;
    const diff = latest - first;

    if (currentWeightEl) currentWeightEl.textContent = `${latest.toFixed(1)} ק״ג`;
    if (startWeightEl) startWeightEl.textContent = `${first.toFixed(1)} ק״ג`;

    if (weightLostEl) {
        if (diff < 0) {
            weightLostEl.textContent = `🟢 ירידה של ${Math.abs(diff).toFixed(1)} ק״ג`;
            weightLostEl.style.color = "#2e7d32";
        } else if (diff > 0) {
            weightLostEl.textContent = `🔴 עלייה של ${diff.toFixed(1)} ק״ג`;
            weightLostEl.style.color = "#c62828";
        } else {
            weightLostEl.textContent = "ללא שינוי";
            weightLostEl.style.color = "#555";
        }
    }
}

// ==================================================
// ציור הגרף (ירוק בירידה, אדום בעלייה, קו עבה)
// ==================================================
function drawChart() {
    if (!weightChart) return;
    weightChart.innerHTML = "";

    if (weightData.length === 0) {
        weightChart.innerHTML = `
            <text x="400" y="200" text-anchor="middle" class="chart-empty">
                עדיין אין נתונים. הזיני שקילה ראשונה כדי להתחיל!
            </text>
        `;
        return;
    }

    const width = 800;
    const height = 400;
    const padding = { top: 50, bottom: 60, left: 60, right: 60 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const weights = weightData.map(d => d.weight);
    let minW = Math.min(...weights);
    let maxW = Math.max(...weights);

    // מרווח לגרף שלא יגע בקצוות
    if (minW === maxW) {
        minW -= 2;
        maxW += 2;
    } else {
        const margin = (maxW - minW) * 0.15;
        minW -= margin;
        maxW += margin;
    }

    function getX(index) {
        if (weightData.length === 1) return padding.left + chartW / 2;
        return padding.left + (index / (weightData.length - 1)) * chartW;
    }

    function getY(val) {
        return padding.top + (1 - (val - minW) / (maxW - minW)) * chartH;
    }

    // ציור קווי רשת רוחביים
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const val = minW + (i / steps) * (maxW - minW);
        const y = getY(val);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding.left);
        line.setAttribute("x2", width - padding.right);
        line.setAttribute("y1", y);
        line.setAttribute("y2", y);
        line.classList.add("chart-grid-line");
        weightChart.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", padding.left - 10);
        label.setAttribute("y", y + 4);
        label.setAttribute("text-anchor", "end");
        label.classList.add("chart-label");
        label.textContent = val.toFixed(1);
        weightChart.appendChild(label);
    }

    // חישוב נקודות
    const points = weightData.map((d, i) => ({
        x: getX(i),
        y: getY(d.weight),
        weight: d.weight,
        dateStr: d.dateStr
    }));

    // ציור קווים עבים בין נקודות עם צבע מעודכן (ירוק/אדום)
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x);
        line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x);
        line.setAttribute("y2", p2.y);

        // בעלייה -> אדום, בירידה/שווה -> ירוק
        const color = p2.weight > p1.weight ? "#e53935" : "#43a047";

        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "6");
        line.setAttribute("stroke-linecap", "round");

        weightChart.appendChild(line);
    }

    // ציור הנקודות והתוויות
    points.forEach((p, i) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
        circle.setAttribute("r", "7");

        // צבע הנקודה לפי כיוון השינוי
        let color = "#43a047";
        if (i > 0 && points[i].weight > points[i - 1].weight) {
            color = "#e53935";
        }
        circle.setAttribute("fill", color);
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "3");

        weightChart.appendChild(circle);

        // משקל מעל הנקודה
        const weightLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        weightLabel.setAttribute("x", p.x);
        weightLabel.setAttribute("y", p.y - 12);
        weightLabel.setAttribute("text-anchor", "middle");
        weightLabel.classList.add("chart-weight-label");
        weightLabel.textContent = `${p.weight.toFixed(1)} ק״ג`;
        weightChart.appendChild(weightLabel);

        // תאריך מתחת לגרף
        const dateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        dateLabel.setAttribute("x", p.x);
        dateLabel.setAttribute("y", height - 15);
        dateLabel.setAttribute("text-anchor", "middle");
        dateLabel.classList.add("chart-label");
        dateLabel.textContent = p.dateStr.split(",")[0]; // הצגת התאריך בלבד
        weightChart.appendChild(dateLabel);
    });
}

// ==================================================
// היסטוריית שקילות
// ==================================================
function renderHistory() {
    if (!weightHistory) return;
    weightHistory.innerHTML = "";

    if (weightData.length === 0) {
        weightHistory.innerHTML = `<p class="weight-empty">עדיין לא נרשמו שקילות.</p>`;
        return;
    }

    // הצגה מהחדש לישן
    [...weightData].reverse().forEach((item, revIdx) => {
        const originalIndex = weightData.length - 1 - revIdx;

        const row = document.createElement("div");
        row.className = "weight-history-row";

        // חישוב הפרש מהשקילה הקודמת
        let diffStr = "";
        if (originalIndex > 0) {
            const prev = weightData[originalIndex - 1].weight;
            const diff = item.weight - prev;
            if (diff < 0) {
                diffStr = `<span style="color:#2e7d32">📉 ${Math.abs(diff).toFixed(1)}- ק״ג</span>`;
            } else if (diff > 0) {
                diffStr = `<span style="color:#c62828">📈 ${diff.toFixed(1)}+ ק״ג</span>`;
            } else {
                diffStr = `<span style="color:#888">ללא שינוי</span>`;
            }
        } else {
            diffStr = `<span style="color:#888">שקילה ראשונה</span>`;
        }

        row.innerHTML = `
            <span>${item.dateStr}</span>
            <strong>${item.weight.toFixed(1)} ק״ג</strong>
            ${diffStr}
            <button type="button" class="delete-weight-button" data-index="${originalIndex}">🗑️</button>
        `;

        row.querySelector(".delete-weight-button").addEventListener("click", () => {
            if (confirm("למחוק שקילה זו?")) {
                weightData.splice(originalIndex, 1);
                saveWeightData();
                updateAll();
            }
        });

        weightHistory.appendChild(row);
    });
}

// ==================================================
// רענון הכול
// ==================================================
function updateAll() {
    updateSummary();
    drawChart();
    renderHistory();
}

updateAll();