// ==================================================
// כל ההישגים באתר
// ==================================================

const achievementCatalog = [

    // ==================================================
    // התחלה
    // ==================================================

    {
        id: "first_active_day",
        icon: "🌱",
        name: "הצעד הראשון",
        description: "הזנת נתוני תזונה ביום הראשון",
        xp: 50,
        unlocked: data => data.activeDays >= 1
    },

    {
        id: "first_finished_day",
        icon: "🎯",
        name: "סיימתי יום",
        description: "סימנת את היום הראשון כסיום",
        xp: 50,
        unlocked: data => data.finishedDays >= 1
    },

    {
        id: "three_active_days",
        icon: "🥳",
        name: "התחלה טובה",
        description: "הזנת נתוני תזונה ב־3 ימים",
        xp: 50,
        unlocked: data => data.activeDays >= 3
    },

    {
        id: "five_active_days",
        icon: "🌼",
        name: "נכנסת לקצב",
        description: "הזנת נתוני תזונה ב־5 ימים",
        xp: 75,
        unlocked: data => data.activeDays >= 5
    },

    {
        id: "ten_active_days",
        icon: "📅",
        name: "10 ימים",
        description: "הזנת נתוני תזונה ב־10 ימים",
        xp: 100,
        unlocked: data => data.activeDays >= 10
    },

    {
        id: "thirty_active_days",
        icon: "🌸",
        name: "30 ימים",
        description: "הזנת נתוני תזונה ב־30 ימים",
        xp: 200,
        unlocked: data => data.activeDays >= 30
    },

    {
        id: "sixty_active_days",
        icon: "💮",
        name: "60 ימים",
        description: "הזנת נתוני תזונה ב־60 ימים",
        xp: 300,
        unlocked: data => data.activeDays >= 60
    },

    {
        id: "one_hundred_active_days",
        icon: "👑",
        name: "100 ימים",
        description: "הזנת נתוני תזונה ב־100 ימים",
        xp: 500,
        unlocked: data => data.activeDays >= 100
    },


    // ==================================================
    // סיום ימים
    // ==================================================

    {
        id: "three_finished_days",
        icon: "✅",
        name: "3 ימים שהושלמו",
        description: "סיימת 3 ימים",
        xp: 75,
        unlocked: data => data.finishedDays >= 3
    },

    {
        id: "seven_finished_days",
        icon: "🌟",
        name: "שבוע של סיום",
        description: "סיימת 7 ימים",
        xp: 100,
        unlocked: data => data.finishedDays >= 7
    },

    {
        id: "fourteen_finished_days",
        icon: "💪",
        name: "שבועיים של התמדה",
        description: "סיימת 14 ימים",
        xp: 150,
        unlocked: data => data.finishedDays >= 14
    },

    {
        id: "thirty_finished_days",
        icon: "🏆",
        name: "30 ימים שהושלמו",
        description: "סיימת 30 ימים",
        xp: 250,
        unlocked: data => data.finishedDays >= 30
    },

    {
        id: "fifty_finished_days",
        icon: "💎",
        name: "50 ימים שהושלמו",
        description: "סיימת 50 ימים",
        xp: 350,
        unlocked: data => data.finishedDays >= 50
    },

    {
        id: "one_hundred_finished_days",
        icon: "👑",
        name: "100 ימים שהושלמו",
        description: "סיימת 100 ימים",
        xp: 600,
        unlocked: data => data.finishedDays >= 100
    },


    // ==================================================
    // ימים מושלמים
    // ==================================================

    {
        id: "first_perfect_day",
        icon: "⭐",
        name: "היום המושלם הראשון",
        description: "עמדת ביעד הקלורי וסיימת את היום",
        xp: 100,
        unlocked: data => data.perfectDays >= 1
    },

    {
        id: "three_perfect_days",
        icon: "✨",
        name: "3 ימים מושלמים",
        description: "השלמת 3 ימים מושלמים",
        xp: 100,
        unlocked: data => data.perfectDays >= 3
    },

    {
        id: "five_perfect_days",
        icon: "🌟",
        name: "5 ימים מושלמים",
        description: "השלמת 5 ימים מושלמים",
        xp: 125,
        unlocked: data => data.perfectDays >= 5
    },

    {
        id: "ten_perfect_days",
        icon: "🥇",
        name: "10 ימים מושלמים",
        description: "השלמת 10 ימים מושלמים",
        xp: 200,
        unlocked: data => data.perfectDays >= 10
    },

    {
        id: "twenty_perfect_days",
        icon: "🏅",
        name: "20 ימים מושלמים",
        description: "השלמת 20 ימים מושלמים",
        xp: 250,
        unlocked: data => data.perfectDays >= 20
    },

    {
        id: "thirty_perfect_days",
        icon: "🏆",
        name: "30 ימים מושלמים",
        description: "השלמת 30 ימים מושלמים",
        xp: 350,
        unlocked: data => data.perfectDays >= 30
    },

    {
        id: "fifty_perfect_days",
        icon: "💎",
        name: "50 ימים מושלמים",
        description: "השלמת 50 ימים מושלמים",
        xp: 500,
        unlocked: data => data.perfectDays >= 50
    },

    {
        id: "one_hundred_perfect_days",
        icon: "👑",
        name: "100 ימים מושלמים",
        description: "השלמת 100 ימים מושלמים",
        xp: 1000,
        unlocked: data => data.perfectDays >= 100
    },


    // ==================================================
    // רצפים
    // ==================================================

    {
        id: "three_perfect_streak",
        icon: "🔥",
        name: "מתחילים להתחמם",
        description: "3 ימים מושלמים ברצף",
        xp: 100,
        unlocked: data => data.currentStreak >= 3
    },

    {
        id: "seven_perfect_streak",
        icon: "🔥",
        name: "שבוע של אש",
        description: "7 ימים מושלמים ברצף",
        xp: 200,
        unlocked: data => data.currentStreak >= 7
    },

    {
        id: "fourteen_perfect_streak",
        icon: "💪",
        name: "שבועיים ברצף",
        description: "14 ימים מושלמים ברצף",
        xp: 300,
        unlocked: data => data.currentStreak >= 14
    },

    {
        id: "thirty_perfect_streak",
        icon: "🏆",
        name: "חודש רצוף",
        description: "30 ימים מושלמים ברצף",
        xp: 500,
        unlocked: data => data.currentStreak >= 30
    },

    {
        id: "sixty_perfect_streak",
        icon: "💎",
        name: "60 ימים ברצף",
        description: "60 ימים מושלמים ברצף",
        xp: 750,
        unlocked: data => data.currentStreak >= 60
    },


    // ==================================================
    // תזונה ועמידה ביעד הקלורי
    // ==================================================

    {
        id: "first_calorie_success",
        icon: "🍎",
        name: "בשליטה",
        description: "עמדת ביעד הקלורי ביום אחד",
        xp: 50,
        unlocked: data => data.calorieSuccessDays >= 1
    },

    {
        id: "five_calorie_success",
        icon: "🥗",
        name: "5 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־5 ימים",
        xp: 75,
        unlocked: data => data.calorieSuccessDays >= 5
    },

    {
        id: "ten_calorie_success",
        icon: "🍏",
        name: "10 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־10 ימים",
        xp: 100,
        unlocked: data => data.calorieSuccessDays >= 10
    },

    {
        id: "twenty_calorie_success",
        icon: "🥑",
        name: "20 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־20 ימים",
        xp: 200,
        unlocked: data => data.calorieSuccessDays >= 20
    },

    {
        id: "thirty_calorie_success",
        icon: "🥦",
        name: "30 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־30 ימים",
        xp: 250,
        unlocked: data => data.calorieSuccessDays >= 30
    },

    {
        id: "fifty_calorie_success",
        icon: "🌿",
        name: "50 ימים בשליטה",
        description: "עמדת ביעד הקלורי ב־50 ימים",
        xp: 400,
        unlocked: data => data.calorieSuccessDays >= 50
    }

];