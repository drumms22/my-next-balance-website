export const financeData = {
    startingBalance: 1000,
    weeklySpendingMode: "flat",
    weeklySpendingItems: [],
    weeklySpending: 175,
    incomeRules: [],
    startConfig: {
        day: 1,
        month: 1
    },
    extraIncome: [
    ],
    overrides: [
        // Example override format
        // { month: 5, day: 10, name: "CC Payment", amount: 1200 }
    ],
    incomeOverrides: [
        // { month: 5, day: "Friday", amount: 1200 }
    ],
    excludes: [
    ],
    days: {
        1: {
        expenses: [
            { type: "subscription", name: "YouTube", amount: 15, remaining: -1 },
            { type: "subscription", name: "Apple Cloud", amount: 3, remaining: -1 },
            { type: "bill", name: "Rent", amount: 695, remaining: -1 }
        ]
        },

        3: {
        expenses: [
            { type: "debt", name: "Klarna", amount: 30, remaining: 1 }
        ]
        },

        5: {
        expenses: [
            { type: "debt", name: "Affirm", amount: 15.78, remaining: 4 }
        ]
        },

        10: {
        expenses: [
            { type: "credit_card", name: "Capital One Savior", amount: 100, remaining: -1 }
        ]
        },

        12: {
        expenses: [
            { type: "insurance", name: "Car Insurance", amount: 127, remaining: -1 }
        ]
        },

        13: {
        expenses: [
            { type: "debt", name: "Zip", amount: 41, remaining: 1 },
            { type: "subscription", name: "Sunday Ticket", amount: 50, remaining: 1 }
        ]
        },

        14: {
        expenses: [
            { type: "subscription", name: "Blink", amount: 12, remaining: -1 },
            { type: "debt", name: "NASM", amount: 110, remaining: 5 }
        ]
        },

        16: {
        expenses: [
            { type: "bill", name: "Phone", amount: 116, remaining: -1 }
        ]
        },

        18: {
        expenses: [
            { type: "subscription", name: "OpenAI", amount: 20, remaining: -1 }
        ]
        },

        19: {
        expenses: [
            { type: "credit_card", name: "Care Credit", amount: 60, remaining: -1 },
            { type: "credit_card", name: "Capital One", amount: 60, remaining: -1 }
        ]
        },

        20: {
        expenses: [
            { type: "debt", name: "Affirm", amount: 78.06, remaining: 6 },
        ]
        },

        24: {
        expenses: [
            { type: "credit_card", name: "Bank", amount: 60, remaining: -1 },
            { type: "utility", name: "Gas", amount: 100, remaining: -1 },
            { type: "debt", name: "Amazon", amount: 40, remaining: 1 }
        ]
        },

        25: {
        expenses: [
            { type: "credit_card", name: "Guitar Center", amount: 50, remaining: -1 }
        ]
        },

        26: {
        expenses: [
            { type: "subscription", name: "Gym", amount: 32, remaining: -1 },
            { type: "subscription", name: "Apple Music", amount: 10.99, remaining: -1 }
        ]
        },

        27: {
        expenses: [
            { type: "debt", name: "Zip", amount: 41, remaining: 1 },
            { type: "debt", name: "Zip", amount: 15, remaining: 1 },
            { type: "debt", name: "Affirm", amount: 108.75, remaining: 1 }
        ]
        },

        28: {
        expenses: [
            { type: "subscription", name: "Railway", amount: 5, remaining: -1 },
            { type: "bill", name: "Fubo", amount: 87, remaining: -1 }
        ]
        },

        30: {
        expenses: [
            { type: "debt", name: "Affirm", amount: 25.02, remaining: 1 }
        ]
        }
    }
};