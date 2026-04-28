# TaxPilot — API Documentation

> Last updated: March 23, 2026 v1.0
> For frontend developers — describes request/response formats for all backend endpoints

---

## Conventions

**Base URL**
```
development:  http://localhost:8000/api
staging:      https://taxpilot-staging.railway.app/api
production:   https://taxpilot.railway.app/api
```

**Authentication**
Except for the auth endpoints, all requests must include a JWT in the Header:
```
Authorization: Bearer {access_token}
```

**Standard Response Format**
```json
// Success
{
  "success": true,
  "data": { ... }
}

// Failure
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

**Common Error Codes**
```
AUTH_REQUIRED         Not signed in or token expired
FORBIDDEN             No permission to access
NOT_FOUND             Resource does not exist
VALIDATION_ERROR      Invalid request parameters
SERVER_ERROR          Server-side error
```

---

## 1. User Authentication

### 1.1 Apple Sign In
```
POST /auth/apple

Request:
{
  "identity_token": "string",    // Identity token returned by Apple
  "user_id": "string"            // Apple user ID
}

Response:
{
  "access_token": "string",      // JWT, valid for 24 hours
  "refresh_token": "string",     // valid for 30 days
  "is_new_user": boolean         // true = new user, must go through Onboarding
}
```

### 1.2 Google Sign In
```
POST /auth/google

Request:
{
  "id_token": "string"           // ID token returned by Google
}

Response: same as 1.1
```

### 1.3 Refresh Token
```
POST /auth/refresh

Request:
{
  "refresh_token": "string"
}

Response:
{
  "access_token": "string",
  "refresh_token": "string"
}
```

### 1.4 Sign Out
```
POST /auth/logout

Response:
{
  "success": true
}
```

---

## 2. Onboarding

### 2.1 Save Tax Framework Settings
```
POST /users/tax-settings

Request:
{
  "income_types": ["1099", "W2"],     // multi-select: W2 / 1099 / side / K1 / rental
  "entity_type": "LLC",               // individual / LLC / S-Corp / partnership
  "state": "CA",                      // 2-letter state code
  "filing_status": "single",          // single / married_joint / married_separate
  "tax_start_year": 2024,             // year filing under this status started
  "tax_region": "US"                  // defaults to US, reserved for multi-country expansion
}

Response:
{
  "id": "uuid",
  "updated_at": "2026-03-23T10:00:00Z"
}
```

### 2.2 Get Tax Framework Settings
```
GET /users/tax-settings

Response:
{
  "income_types": ["1099"],
  "entity_type": "LLC",
  "state": "CA",
  "filing_status": "single",
  "tax_start_year": 2024,
  "tax_region": "US",
  "updated_at": "2026-03-23T10:00:00Z"
}
```

---

## 3. Plaid Bank Connection

### 3.1 Create Link Token (connect / re-auth)
```
POST /plaid/create-link-token

Request:
{
  "mode": "create" | "update",    // create = new connection, update = re-auth
  "item_id": "string"             // required when mode is update
}

Response:
{
  "link_token": "string"          // pass to the frontend Plaid Link SDK
}
```

### 3.2 Exchange Token (called after a successful connection)
```
POST /plaid/exchange-token

Request:
{
  "public_token": "string",       // public_token returned by Plaid Link
  "institution_name": "string"
}

Response:
{
  "item_id": "uuid",
  "institution_name": "string",
  "accounts": [
    {
      "account_id": "string",
      "name": "Chase Checking",
      "type": "depository",
      "subtype": "checking",
      "mask": "2847"
    }
  ],
  "sync_status": "processing"     // historical data is being processed
}
```

### 3.3 List Connected Accounts
```
GET /plaid/items

Response:
{
  "items": [
    {
      "item_id": "uuid",
      "institution_name": "Chase",
      "status": "active" | "reauth_required" | "paused",
      "last_synced_at": "2026-03-23T10:00:00Z",
      "accounts": [
        {
          "account_id": "string",
          "name": "Chase Checking",
          "type": "depository",
          "mask": "2847"
        }
      ]
    }
  ]
}
```

### 3.4 Pause / Resume Account Sync
```
PATCH /plaid/items/{item_id}/status

Request:
{
  "status": "paused" | "active"
}

Response:
{
  "item_id": "uuid",
  "status": "paused"
}
```

### 3.5 Disconnect Account
```
DELETE /plaid/items/{item_id}

Response:
{
  "success": true,
  "message": "Account disconnected; historical data preserved"
}
```

### 3.6 Sync Status (polled by the Onboarding loading screen)
```
GET /plaid/sync-status

Response:
{
  "status": "processing" | "complete",
  "accounts_connected": 3,
  "transactions_processed": 847,
  "transactions_total": 1240,
  "current_step": "Identifying deductible expenses"
}
```

---

## 4. First Discovery

### 4.1 Get First Discovery Data
```
GET /discovery

Response:
{
  "case": "case1" | "case2" | "case3" | "case4",
  "confirmed_amount": 3840.00,       // total confirmed deductible amount
  "pending_count": 23,               // number of pending items
  "categories": [
    {
      "name": "Software Subscriptions",
      "amount": 1240.00
    }
  ],
  "estimated_tax_savings": 1680.00,  // estimated tax reduction
  "tax_deadline_days": 24,           // days until tax deadline (relevant for case2)
  "has_prior_year_deductions": true  // whether prior-year deductions exist (relevant to 1040-X)
}
```

---

## 5. Transactions

### 5.1 Home Transaction List
```
GET /transactions/home

Query:
  limit: integer (default: 20)
  cursor: string (pagination cursor)

Response:
{
  "transactions": [
    {
      "id": "uuid",
      "merchant_name": "Nobu Restaurant",
      "amount": -280.00,
      "date": "2026-03-14",
      "source": "plaid",
      "status": "pending",
      "card": {
        "category": "Business Meals",
        "deductible_amount": 140.00,
        "confidence": "medium",
        "submit_status": "submitted"
      }
    }
  ],
  "next_cursor": "string"
}
```

### 5.2 Transactions for a Specific Date (Calendar)
```
GET /transactions/by-date

Query:
  date: "2026-03-14"    // YYYY-MM-DD

Response:
{
  "transactions": [ ... ]  // same shape as 5.1
}
```

### 5.3 Category Summary (Savings page)
```
GET /transactions/by-category

Query:
  year: integer (default: current year)

Response:
{
  "year": 2026,
  "categories": [
    {
      "name": "Software Subscriptions",
      "total_amount": 1240.00,
      "tax_savings": 297.60,
      "transaction_count": 12,
      "transactions": [ ... ]   // transactions in this category
    }
  ]
}
```

### 5.4 Transaction Detail
```
GET /transactions/{transaction_id}

Response:
{
  "id": "uuid",
  "merchant_name": "Nobu Restaurant",
  "amount": -280.00,
  "date": "2026-03-14",
  "source": "plaid",
  "status": "confirmed",
  "plaid_transaction_id": "txn_abc123",
  "account": {
    "name": "Chase Sapphire",
    "mask": "4821"
  },
  "card": {
    "category": "Business Meals",
    "deductible_pct": 50,
    "deductible_amount": 140.00,
    "judgment_source": "user",
    "user_declaration": "Business dinner with client to discuss Q2 contract renewal",
    "irs_publication": "Pub 463",
    "irs_description": "Business meals — 50% deductible rule",
    "confidence": "high",
    "submit_status": "submitted"
  }
}
```

### 5.5 Select an AI Branch (for pending items)
```
POST /transactions/{transaction_id}/select-branch

// User picks one branch from the AI's suggested_branches
Request:
{
  "selected_branch_index": 0    // index of the selected branch
}

Response:
{
  "id": "uuid",
  "status": "confirmed",
  "card": {
    "category": "Business Travel",
    "deductible_pct": 100,
    "deductible_amount": 45.00,
    "judgment_source": "user",
    "irs_publication": "Pub 463",
    "irs_description": "Business travel parking — 100% deductible",
    "submit_status": "submitted"
  }
}
// Confirmed immediately, does not enter pending_submit; tax numbers update right away
```

### 5.6 Edit an Existing Declaration (marks pending_submit, does not trigger AI)
```
PATCH /transactions/{transaction_id}/declaration

Request:
{
  "user_declaration": "New declaration text"
}

Response:
{
  "id": "uuid",
  "submit_status": "pending_submit",
  "pending_changes": {
    "user_declaration": "New declaration text"
  }
}
// Marks state only; does not trigger AI — waits for batch submit
```

### 5.7 Batch Submit Edits
```
POST /transactions/batch-submit

Request:
{
  "transaction_ids": ["uuid1", "uuid2", "uuid3"]  // all pending_submit IDs
}

Response:
{
  "submitted_count": 3,
  "processing": true    // AI is processing; updates will be pushed when finished
}
```

### 5.8 Manual Expense Entry
```
POST /transactions/manual

Request:
{
  "merchant_name": "Parking · Terminal A",
  "amount": -45.00,
  "date": "2026-03-12",
  "user_declaration": "Flew to NY for business, airport parking for 3 days"
}

Response:
{
  "id": "uuid",
  "status": "processing"   // AI is evaluating
}
```

### 5.9 Skip a Transaction (mark as ignored)
```
PATCH /transactions/{transaction_id}/ignore

Response:
{
  "id": "uuid",
  "status": "ignored"
}
```

---

## 6. Manual Income Entry

### 6.1 Enter K-1 Income
```
POST /income/k1

Request:
{
  "source_name": "Hawky LLC",
  "tax_year": 2025,
  "ordinary_income": 84200.00,
  "rental_income": null,
  "interest_income": null,
  "capital_gains": null,
  "other_income": null
}

Response:
{
  "id": "uuid",
  "income_type": "k1",
  "total_income": 84200.00,
  "created_at": "2026-03-23T10:00:00Z"
}
```

### 6.2 Enter Cash / Other Income
```
POST /income/other

Request:
{
  "income_type": "cash" | "check" | "other_platform",
  "description": "Consulting fee",
  "amount": 2500.00,
  "date": "2026-03-10"
}

Response:
{
  "id": "uuid",
  "income_type": "cash",
  "amount": 2500.00,
  "created_at": "2026-03-23T10:00:00Z"
}
```

### 6.3 List All Manual Income Records
```
GET /income

Query:
  year: integer (default: current year)

Response:
{
  "records": [
    {
      "id": "uuid",
      "income_type": "k1",
      "source_name": "Hawky LLC",
      "tax_year": 2025,
      "total_income": 84200.00,
      "created_at": "2026-03-23T10:00:00Z"
    }
  ]
}
```

### 6.4 Delete a Manual Income Record
```
DELETE /income/{income_id}

Response:
{
  "success": true
}
```

---

## 7. Tax Calculation

### 7.1 Home Four-Cell Metrics
```
GET /tax/summary

Query:
  year: integer (default: current year)

Response:
{
  "year": 2026,
  "total_income": 84200.00,
  "total_deductible": 18640.00,
  "taxable_income": 65560.00,       // floored at 0; never negative
  "estimated_tax_reduction": 4890.00,
  "is_zero_taxable": false,          // when true, frontend shows "no taxable income for the period"
  "pending_count": 3,                // number of pending items
  "note": "Estimated from this year's recorded income · updates live"
}
```

### 7.2 Full Tax Calculation (Report page)
```
GET /tax/report

Query:
  year: integer (default: current year)

Response:
{
  "year": 2026,
  "total_income": 84200.00,
  "total_deductible": 18640.00,
  "taxable_income": 65560.00,
  "federal_tax": 14423.00,
  "federal_rate": "22%",
  "self_employment_tax": 10031.00,
  "se_rate": "15.3%",
  "state_tax": 6097.00,
  "state_rate": "9.3%",
  "state": "CA",
  "estimated_total": 30551.00,
  "categories": [
    {
      "name": "Software Subscriptions",
      "total": 1240.00,
      "count": 12,
      "transactions": [ ... ]
    }
  ]
}
```

### 7.3 Self-Filing Guide
```
GET /tax/filing-guide

Query:
  year: integer (default: current year)

Response:
{
  "year": 2026,
  "schedule_c": {
    "line_27_other_expenses": {
      "label": "Software Subscriptions / Cloud Services",
      "amount": 1240.00
    },
    "line_24a_travel": {
      "label": "Business Travel",
      "amount": 3400.00
    },
    "line_24b_meals": {
      "label": "Business Meals (× 50% applied)",
      "amount": 1050.00
    }
  },
  "schedule_se": {
    "net_self_employment": {
      "label": "Net self-employment income",
      "amount": 65560.00
    }
  },
  "schedule_1": {
    "line_17_se_deduction": {
      "label": "Self-employment tax deduction",
      "amount": 5016.00
    }
  }
}
```

---

## 8. Report Export

### 8.1 Export PDF
```
GET /reports/pdf

Query:
  year: integer (default: current year)

Response: application/pdf binary stream
```

### 8.2 Send to CPA
```
POST /reports/send-to-cpa

Request:
{
  "email": "cpa@example.com",
  "year": 2026,
  "include_filing_guide": true
}

Response:
{
  "success": true,
  "sent_to": "cpa@example.com"
}
```

---

## 9. Settings

### 9.1 Update Tax Framework (triggers full recalculation)
```
PUT /users/tax-settings

Request: same as 2.1

Response:
{
  "updated_at": "2026-03-23T10:00:00Z",
  "recalculating": true    // backend is recomputing all data
}
```

### 9.2 Get Current User
```
GET /users/me

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "subscription_status": "active" | "trial" | "expired",
  "trial_ends_at": "2026-03-30T00:00:00Z",
  "created_at": "2026-03-23T10:00:00Z"
}
```

### 9.3 Delete Account
```
DELETE /users/me

Response:
{
  "success": true,
  "message": "Account and all data deleted"
}
```

---

## 10. Webhook (backend internal — not called from the frontend)

```
POST /plaid/webhook          # Plaid event ingestion endpoint
```

The frontend picks up post-webhook updates via:
- React Query auto-polling (key data refreshes every 30 seconds)
- After an Expo Push Notification, when the user opens the app, a refresh is triggered

---

## 11. Error Code Reference

```
AUTH_001    Token expired
AUTH_002    Token invalid
PLAID_001   Plaid connection failed
PLAID_002   Account requires re-authentication
PLAID_003   Bank not supported (insufficient history)
TAX_001     Tax framework not configured
TAX_002     Insufficient data for calculation
INCOME_001  Income record does not exist
TXN_001     Transaction does not exist
TXN_002     No permission to operate on this transaction
REPORT_001  PDF generation failed
REPORT_002  Email send failed
```

---

*Last updated: March 23, 2026 v1.0*
