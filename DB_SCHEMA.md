# FinNest PostgreSQL Database Schema Documentation

## Tables

### users
| Column          | Data Type          | Constraints                       | Description                           |
|-----------------|--------------------|---------------------------------|-------------------------------------|
| id              | UUID               | PK, not null                    | Primary key user ID                  |
| email           | VARCHAR(255)       | Unique, not null                | User email                          |
| passwordHash    | VARCHAR            | Nullable                       | Hashed password                     |
| oauthProvider   | VARCHAR(50)        | Nullable                       | OAuth provider (google, apple)      |
| oauthId         | VARCHAR(255)       | Nullable                       | OAuth provider user ID              |
| biometricEnabled| BOOLEAN            | Default false                  | Biometric login enabled             |
| roles           | TEXT[]             | Not null, default ['user']     | User roles                         |
| createdAt       | TIMESTAMP WITH TZ  | Not null                      | Creation timestamp                 |
| updatedAt       | TIMESTAMP WITH TZ  | Not null                      | Last update timestamp              |

---

### transactions
| Column          | Data Type          | Constraints                      | Description                         |
|-----------------|--------------------|--------------------------------|-----------------------------------|
| id              | UUID               | PK, not null                   | Primary key transaction ID        |
| userId          | UUID               | FK users(id), not null         | User who owns transaction         |
| bankSyncId      | UUID               | FK bank_syncs(id), nullable    | Related bank sync record          |
| amount          | NUMERIC(14,2)      | Not null                      | Transaction amount                |
| currency        | VARCHAR(3)         | Not null, default 'INR'       | Currency code                    |
| merchantName    | VARCHAR            | Nullable                      | Merchant name                    |
| category        | VARCHAR            | Nullable                      | Transaction category             |
| transactionDate | DATE               | Not null                     | Date of transaction             |
| isFraud         | BOOLEAN            | Default false                | Fraud flag                      |
| anomalyScore    | FLOAT              | Nullable                     | Anomaly detection score         |
| createdAt       | TIMESTAMP WITH TZ  | Not null                    | Creation timestamp             |
| updatedAt       | TIMESTAMP WITH TZ  | Not null                    | Update timestamp               |

---

### bank_syncs
| Column              | Data Type          | Constraints                    | Description                      |
|---------------------|--------------------|-------------------------------|--------------------------------|
| id                  | UUID               | PK, not null                 | Bank sync record ID             |
| userId              | UUID               | FK users(id), not null       | User who owns the sync          |
| bankName            | VARCHAR            | Not null                    | Bank or provider name           |
| accountNumber       | TEXT               | Encrypted, nullable          | Encrypted account number        |
| lastSyncDate        | TIMESTAMP WITH TZ  | Nullable                    | Last successful sync timestamp  |
| syncStatus          | ENUM               | Default 'pending'            | Sync status (pending, success, failed) |
| plaidAccessToken    | TEXT               | Encrypted, nullable          | Plaid API access token          |
| truelayerAccessToken| TEXT               | Encrypted, nullable          | TrueLayer API access token      |
| createdAt           | TIMESTAMP WITH TZ  | Not null                    | Creation timestamp             |
| updatedAt           | TIMESTAMP WITH TZ  | Not null                    | Update timestamp               |

---

### upi_payments
| Column          | Data Type          | Constraints                      | Description                      |
|-----------------|--------------------|---------------------------------|--------------------------------|
| id              | UUID               | PK, not null                   | UPI payment record ID           |
| userId          | UUID               | FK users(id), not null         | User who made payment           |
| amount          | NUMERIC(14,2)      | Not null                      | Payment amount                 |
| payeeVPA        | VARCHAR            | Not null                      | Payee VPA                      |
| transactionId   | VARCHAR            | Unique, not null               | Provider transaction ID        |
| status          | ENUM               | Not null, default 'pending'    | Payment status (pending, success, failed) |
| paymentMethod   | ENUM               | Not null                      | PhonePe, Paytm, GooglePay, BHIM_UPI |
| timestamp       | TIMESTAMP WITH TZ  | Not null, default now          | Payment timestamp              |

---

### goals
| Column            | Data Type          | Constraints                     | Description                      |
|-------------------|--------------------|--------------------------------|--------------------------------|
| id                | UUID               | PK, not null                  | Investment goal ID              |
| userId            | UUID               | FK users(id), not null        | User who owns the goal          |
| title             | VARCHAR(255)       | Not null                     | Goal title                     |
| description       | TEXT               | Nullable                     | Goal description               |
| targetAmount      | NUMERIC(14,2)      | Not null                     | Target investment amount       |
| currentAmount     | NUMERIC(14,2)      | Not null, default 0           | Current saved amount           |
| deadline          | DATE               | Nullable                     | Target deadline                |
| aiRecommendedPlan | JSONB              | Nullable                     | AI suggested investment plan  |
| familyShared      | BOOLEAN            | Default false                | Shared with family flag        |
| createdAt         | TIMESTAMP WITH TZ  | Not null                    | Creation timestamp            |
| updatedAt         | TIMESTAMP WITH TZ  | Not null                    | Last update timestamp         |

---

### gamifications
| Column             | Data Type          | Constraints                    | Description                   |
|--------------------|--------------------|-------------------------------|-------------------------------|
| userId             | UUID               | PK, not null                 | User ID                       |
| xpPoints           | INTEGER            | Default 0                   | Experience points             |
| badges             | TEXT[]             | Default empty array          | List of earned badges         |
| streakCount        | INTEGER            | Default 0                   | Current streak count          |
| lastActiveDate     | DATE               | Nullable                    | Last activity date            |
| familyLeaderboardRank | INTEGER          | Nullable                    | Leaderboard ranking           |

---

### expense_entries
| Column          | Data Type          | Constraints                      | Description                   |
|-----------------|--------------------|---------------------------------|-------------------------------|
| id              | UUID               | PK, not null                   | Expense entry ID              |
| userId          | UUID               | FK users(id), not null         | User who added expense        |
| amount          | NUMERIC(14,2)      | Not null                      | Expense amount               |
| category        | VARCHAR            | Not null                      | Expense category             |
| entryDate       | DATE               | Not null                      | Date of expense              |
| source          | ENUM               | Not null                      | Entry source (voice, photo, manual) |
| receiptPhotoURL | VARCHAR            | Nullable                      | URL to uploaded receipt photo |
| createdAt       | TIMESTAMP WITH TZ  | Not null                    | Creation timestamp           |
| updatedAt       | TIMESTAMP WITH TZ  | Not null                    | Last update timestamp        |

---

## Indexes and Foreign Keys

- `transactions.userId` references `users.id`
- `transactions.bankSyncId` references `bank_syncs.id`
- `bank_syncs.userId` references `users.id`
- `upi_payments.userId` references `users.id`
- `goals.userId` references `users.id`
- `gamifications.userId` references `users.id`
- `expense_entries.userId` references `users.id`

Indexes exist on foreign key columns and frequently queried fields such as `transactionDate`, `userId`, and `status` for faster lookups.

---

## Notes

- Sensitive data such as account numbers and access tokens are encrypted in the database.
- Timestamps are stored in UTC with timezone information.
- Enum fields enforce valid status and source values.

