# FinNest API Documentation

## Authorization

- Most endpoints require a Bearer JWT token in the `Authorization` header.
- Tokens expire in 6 hours; refresh tokens are supported.

---

## Authentication

### POST `/api/auth/login`
- Body: `{ "email": string, "password": string }`
- Response: `{ "token": string, "expiresIn": number }`

### GET `/api/auth/oauth/google`
- Initiate Google OAuth login (redirect)

### GET `/api/auth/oauth/google/callback`
- OAuth callback endpoint

### GET `/api/auth/oauth/apple`
- Initiate Apple OAuth login (redirect)

### POST `/api/auth/oauth/apple/callback`
- OAuth callback endpoint

### POST `/api/auth/biometric-login`
- Body: `{ "biometricToken": string }`
- Response: `{ "token": string, "expiresIn": number }`

### POST `/api/auth/refresh-token`
- Body: `{ "token": string }`
- Response: `{ "token": string, "expiresIn": number }`

### POST `/api/auth/logout`
- Logs out the user (token invalidation optional)

---

## Bank Synchronization

### GET `/api/bank-sync/transactions`
- Query params: `page`, `limit`, `category`, `merchantName`, `dateFrom`, `dateTo`, `sortBy`, `sortOrder`
- Response: `{ total: number, page: number, limit: number, transactions: [Transaction] }`

### POST `/api/bank-sync/sync`
- Body: `{ provider: "plaid" | "truelayer", bankSyncId?: string }`
- Response: `{ message: string, bankSyncId: string }`

### GET `/api/bank-sync/fraud-alerts`
- Response: `{ fraudAlerts: [Transaction] }`

### GET `/api/bank-sync/anomalies`
- Response: `{ anomalies: [Transaction] }`

---

## UPI Payments

### POST `/api/upi/pay`
- Body: `{ amount: number, payeeVPA: string, paymentMethod: "PhonePe" | "Paytm" | "GooglePay" | "BHIM_UPI" }`
- Response: `{ message: string, transactionId: string, paymentMethod: string, status: string, qrCode?: string }`

### GET `/api/upi/payment-status/:id`
- Response: `{ transactionId: string, status: string, amount: number, payeeVPA: string, paymentMethod: string, timestamp: string }`

### GET `/api/upi/rewards`
- Response: `{ rewards: [Reward] }`

### POST `/api/upi/voice-payment`
- Body: `{ voiceData: string }`
- Response: `{ transactionId?: string, status: string, message?: string, error?: string }`

---

## AI Financial Insights

### GET `/api/ai/expense-forecast`
- Response: `{ monthlyExpenses: [{ month: string, amount: number }], confidence: number }`

### GET `/api/ai/saving-suggestions`
- Response: `{ suggestions: [string] }`

### GET `/api/ai/overspending-warnings`
- Response: `{ warnings: [{ category: string, lastMonthSpend: number, avgSpend: number, warning: string }] }`

### GET `/api/ai/personal-goals`
- Response: `{ goals: [{ goalId: string, title: string, progressPercent: number, recommendation: string }] }`

---

## Investments

### POST `/api/investments/goals`
- Body: `{ title: string, description?: string, targetAmount: number, deadline?: string, familyShared?: boolean }`
- Response: Goal object

### GET `/api/investments/goals`
- Response: `[Goal]`

### PUT `/api/investments/goals/:id`
- Body: Goal update fields
- Response: Updated Goal object

### DELETE `/api/investments/goals/:id`
- Response: `{ message: string }`

---

## Gamification

### GET `/api/gamification/status`
- Response: Gamification status object

### POST `/api/gamification/challenge/complete`
- Body: `{ challengeId: string, xpEarned: number, badge?: string }`
- Response: `{ message: string, xpPoints: number, badges: [string], streakCount: number }`

### GET `/api/gamification/family-leaderboard`
- Response: `{ leaderboard: [Gamification] }`

---

## Expense Entry

### POST `/api/expenses/voice-entry`
- Body: `{ voiceData: string }`
- Response: ExpenseEntry object

### POST `/api/expenses/photo-upload`
- Multipart form-data: `receiptPhoto` (file), `amount`, `category`, `entryDate`
- Response: ExpenseEntry object

### POST `/api/expenses/manual-entry`
- Body: `{ amount: number, category: string, entryDate: string }`
- Response: ExpenseEntry object

### GET `/api/expenses/categories`
- Response: `{ categories: [string] }`

---

## Family Collaboration

### POST `/api/family/invite`
- Not implemented

### GET `/api/family/members`
- Not implemented

### PUT `/api/family/roles/:memberId`
- Not implemented

### GET `/api/family/shared-bills`
- Not implemented

### POST `/api/family/shared-bills`
- Not implemented

---

## Error Codes

- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error
