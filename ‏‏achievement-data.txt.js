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
        description: "היית פעילה ביום הראשון",
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
        description: "השלמת 3 ימים פעילים",
        xp: 50,
        unlocked: data => data.activeDays >= 3
    },

    {
        id: "five_active_days",
        icon: "🌼",
        name: "נכנסת לקצב",
        description: "השלמת 5 ימים פעילים",
        xp: 75,
        unlocked: data => data.activeDays >= 5
    },

    {
        id: "ten_active_days",
        icon: "📅",
        name: "10 ימים",
        description: "השלמת 10 ימים פעילים",
        xp: 100,
        unlocked: data => data.activeDays >= 10
    },

    {
        id: "thirty_active_days",
        icon: "🌸",
        name: "30 ימים",
        description: "השלמת 30 ימים פעילים",
        xp: 200,
        unlocked: data => data.activeDays >= 30
    },

    {
        id: "sixty_active_days",
        icon: "💮",
        name: "60 ימים",
        description: "השלמת 60 ימים פעילים",
        xp: 300,
        unlocked: data => data.activeDays >= 60
    },

    {
        id: "one_hundred_active_days",
        icon: "👑",
        name: "100 ימים פעילים",
        description: "השלמת 100 ימים פעילים",
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
        description: "השלמת יום מושלם",
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
    // תזונה
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
    },


    // ==================================================
    // פעילות
    // ==================================================

    {
        id: "first_activity_day",
        icon: "🏃",
        name: "מתחילים לזוז",
        description: "השלמת את יעד 20 הדקות הראשון",
        xp: 50,
        unlocked: data => data.activitySuccessDays >= 1
    },

    {
        id: "five_activity_days",
        icon: "👟",
        name: "5 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־5 ימים",
        xp: 75,
        unlocked: data => data.activitySuccessDays >= 5
    },

    {
        id: "ten_activity_days",
        icon: "⚡",
        name: "10 אימונים מוצלחים",
        description: "הגעת ליעד הפעילות ב־10 ימים",
        xp: 100,
        unlocked: data => data.activitySuccessDays >= 10
    },

    {
        id: "twenty_activity_days",
        icon: "🏃‍♀️",
        name: "20 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־20 ימים",
        xp: 200,
        unlocked: data => data.activitySuccessDays >= 20
    },

    {
        id: "thirty_activity_days",
        icon: "🔥",
        name: "30 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־30 ימים",
        xp: 250,
        unlocked: data => data.activitySuccessDays >= 30
    },

    {
        id: "fifty_activity_days",
        icon: "🏅",
        name: "50 ימי תנועה",
        description: "הגעת ליעד הפעילות ב־50 ימים",
        xp: 400,
        unlocked: data => data.activitySuccessDays >= 50
    },


    // ==================================================
    // דקות פעילות
    // ==================================================

    {
        id: "one_hundred_activity_minutes",
        icon: "⏱️",
        name: "100 דקות",
        description: "צברת 100 דקות פעילות",
        xp: 50,
        unlocked: data => data.totalActivityMinutes >= 100
    },

    {
        id: "two_hundred_fifty_activity_minutes",
        icon: "⌚",
        name: "250 דקות",
        description: "צברת 250 דקות פעילות",
        xp: 75,
        unlocked: data => data.totalActivityMinutes >= 250
    },

    {
        id: "five_hundred_activity_minutes",
        icon: "🚀",
        name: "500 דקות",
        description: "צברת 500 דקות פעילות",
        xp: 100,
        unlocked: data => data.totalActivityMinutes >= 500
    },

    {
        id: "one_thousand_activity_minutes",
        icon: "🌈",
        name: "1000 דקות",
        description: "צברת 1000 דקות פעילות",
        xp: 200,
        unlocked: data => data.totalActivityMinutes >= 1000
    },

    {
        id: "two_thousand_activity_minutes",
        icon: "💫",
        name: "2000 דקות",
        description: "צברת 2000 דקות פעילות",
        xp: 300,
        unlocked: data => data.totalActivityMinutes >= 2000
    },

    {
        id: "five_thousand_activity_minutes",
        icon: "👑",
        name: "5000 דקות",
        description: "צברת 5000 דקות פעילות",
        xp: 750,
        unlocked: data => data.totalActivityMinutes >= 5000
    },


    // ==================================================
    // אתגרים
    // ==================================================

    {
        id: "first_challenge_day",
        icon: "🎯",
        name: "אתגר ראשון",
        description: "השלמת אתגר ביום אחד",
        xp: 50,
        unlocked: data => data.challengeDays >= 1
    },

    {
        id: "three_challenge_days",
        icon: "🎯",
        name: "3 ימי אתגר",
        description: "השלמת אתגר ב־3 ימים",
        xp: 75,
        unlocked: data => data.challengeDays >= 3
    },

    {
        id: "seven_challenge_days",
        icon: "🏆",
        name: "שבוע של אתגרים",
        description: "השלמת אתגר ב־7 ימים",
        xp: 100,
        unlocked: data => data.challengeDays >= 7
    },

    {
        id: "fourteen_challenge_days",
        icon: "🔥",
        name: "14 ימי אתגר",
        description: "השלמת אתגר ב־14 ימים",
        xp: 150,
        unlocked: data => data.challengeDays >= 14
    },

    {
        id: "thirty_challenge_days",
        icon: "💎",
        name: "30 ימי אתגר",
        description: "השלמת אתגר ב־30 ימים",
        xp: 250,
        unlocked: data => data.challengeDays >= 30
    },

    {
        id: "fifty_challenge_days",
        icon: "👑",
        name: "50 ימי אתגר",
        description: "השלמת אתגר ב־50 ימים",
        xp: 400,
        unlocked: data => data.challengeDays >= 50
    }

];