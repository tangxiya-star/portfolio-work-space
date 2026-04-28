# TaxPilot — API接口文档

> 最后更新：2026年3月23日 v1.0
> 面向前端开发者，描述所有后端接口的请求/响应格式

---

## 基础规范

**Base URL**
```
development:  http://localhost:8000/api
staging:      https://taxpilot-staging.railway.app/api
production:   https://taxpilot.railway.app/api
```

**认证**
除登录注册接口外，所有请求需在Header中携带JWT token：
```
Authorization: Bearer {access_token}
```

**通用响应格式**
```json
// 成功
{
  "success": true,
  "data": { ... }
}

// 失败
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

**通用错误码**
```
AUTH_REQUIRED         未登录或token过期
FORBIDDEN             无权限访问
NOT_FOUND             资源不存在
VALIDATION_ERROR      请求参数错误
SERVER_ERROR          服务端错误
```

---

## 一、用户认证

### 1.1 Apple Sign In
```
POST /auth/apple

Request:
{
  "identity_token": "string",    // Apple返回的identity token
  "user_id": "string"            // Apple user ID
}

Response:
{
  "access_token": "string",      // JWT，24小时有效
  "refresh_token": "string",     // 30天有效
  "is_new_user": boolean         // true=新用户，需走Onboarding
}
```

### 1.2 Google Sign In
```
POST /auth/google

Request:
{
  "id_token": "string"           // Google返回的ID token
}

Response: 同1.1
```

### 1.3 刷新Token
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

### 1.4 登出
```
POST /auth/logout

Response:
{
  "success": true
}
```

---

## 二、Onboarding

### 2.1 保存税务框架设定
```
POST /users/tax-settings

Request:
{
  "income_types": ["1099", "W2"],     // 多选：W2/1099/副业/K1/rental
  "entity_type": "LLC",               // individual/LLC/S-Corp/partnership
  "state": "CA",                      // 两字母州缩写
  "filing_status": "single",          // single/married_joint/married_separate
  "tax_start_year": 2024,             // 报税起点年份
  "tax_region": "US"                  // 默认US，多国扩张预留
}

Response:
{
  "id": "uuid",
  "updated_at": "2026-03-23T10:00:00Z"
}
```

### 2.2 获取税务框架设定
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

## 三、Plaid银行连接

### 3.1 创建Link Token（连接/重新认证）
```
POST /plaid/create-link-token

Request:
{
  "mode": "create" | "update",    // create=新连接，update=重新认证
  "item_id": "string"             // update模式时必填
}

Response:
{
  "link_token": "string"          // 传给前端Plaid Link SDK
}
```

### 3.2 Exchange Token（连接成功后调用）
```
POST /plaid/exchange-token

Request:
{
  "public_token": "string",       // Plaid Link返回的public_token
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
  "sync_status": "processing"     // 历史数据正在处理中
}
```

### 3.3 获取已连接账户列表
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

### 3.4 暂停/恢复账户同步
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

### 3.5 断开账户连接
```
DELETE /plaid/items/{item_id}

Response:
{
  "success": true,
  "message": "账户已断开，历史数据已保留"
}
```

### 3.6 获取数据加载状态（Onboarding加载页轮询）
```
GET /plaid/sync-status

Response:
{
  "status": "processing" | "complete",
  "accounts_connected": 3,
  "transactions_processed": 847,
  "transactions_total": 1240,
  "current_step": "识别可抵扣支出"
}
```

---

## 四、首次发现

### 4.1 获取首次发现数据
```
GET /discovery

Response:
{
  "case": "case1" | "case2" | "case3" | "case4",
  "confirmed_amount": 3840.00,       // 已确认可抵扣总额
  "pending_count": 23,               // 待确认笔数
  "categories": [
    {
      "name": "软件订阅",
      "amount": 1240.00
    }
  ],
  "estimated_tax_savings": 1680.00,  // 预计减少税款
  "tax_deadline_days": 24,           // 距报税截止天数（case2适用）
  "has_prior_year_deductions": true  // 是否有历史年份抵扣（1040-X相关）
}
```

---

## 五、交易

### 5.1 获取主页交易列表
```
GET /transactions/home

Query:
  limit: integer (default: 20)
  cursor: string (分页游标)

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
        "category": "业务餐饮",
        "deductible_amount": 140.00,
        "confidence": "medium",
        "submit_status": "submitted"
      }
    }
  ],
  "next_cursor": "string"
}
```

### 5.2 获取日历页某天交易
```
GET /transactions/by-date

Query:
  date: "2026-03-14"    // YYYY-MM-DD

Response:
{
  "transactions": [ ... ]  // 同5.1格式
}
```

### 5.3 获取省税页分类汇总
```
GET /transactions/by-category

Query:
  year: integer (default: 当年)

Response:
{
  "year": 2026,
  "categories": [
    {
      "name": "软件订阅",
      "total_amount": 1240.00,
      "tax_savings": 297.60,
      "transaction_count": 12,
      "transactions": [ ... ]   // 该分类下的交易列表
    }
  ]
}
```

### 5.4 获取交易详情
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
    "category": "业务餐饮",
    "deductible_pct": 50,
    "deductible_amount": 140.00,
    "judgment_source": "user",
    "user_declaration": "和客户业务晚餐，讨论Q2合同续签",
    "irs_publication": "Pub 463",
    "irs_description": "业务餐饮50%抵扣规则",
    "confidence": "high",
    "submit_status": "submitted"
  }
}
```

### 5.5 用户选择AI分支（待确认款项）
```
POST /transactions/{transaction_id}/select-branch

// 用户从AI返回的suggested_branches中选择一个分支
Request:
{
  "selected_branch_index": 0    // 用户选择的分支索引
}

Response:
{
  "id": "uuid",
  "status": "confirmed",
  "card": {
    "category": "业务差旅",
    "deductible_pct": 100,
    "deductible_amount": 45.00,
    "judgment_source": "user",
    "irs_publication": "Pub 463",
    "irs_description": "业务差旅停车费100%抵扣",
    "submit_status": "submitted"
  }
}
// 直接确认，不进入pending_submit，立即更新税务数字
```

### 5.6 修改已有声明（标记为待提交，不立即触发AI）
```
PATCH /transactions/{transaction_id}/declaration

Request:
{
  "user_declaration": "新的声明文字"
}

Response:
{
  "id": "uuid",
  "submit_status": "pending_submit",
  "pending_changes": {
    "user_declaration": "新的声明文字"
  }
}
// 仅标记状态，不触发AI，等待批量提交
```

### 5.7 批量提交修改
```
POST /transactions/batch-submit

Request:
{
  "transaction_ids": ["uuid1", "uuid2", "uuid3"]  // 所有pending_submit的id
}

Response:
{
  "submitted_count": 3,
  "processing": true    // AI正在处理，完成后推送更新
}
```

### 5.8 手动录入支出
```
POST /transactions/manual

Request:
{
  "merchant_name": "停车场 Terminal A",
  "amount": -45.00,
  "date": "2026-03-12",
  "user_declaration": "飞纽约出差，机场停车三天"
}

Response:
{
  "id": "uuid",
  "status": "processing"   // AI正在判断
}
```

### 5.9 跳过交易（标记为ignored）
```
PATCH /transactions/{transaction_id}/ignore

Response:
{
  "id": "uuid",
  "status": "ignored"
}
```

---

## 六、手动收入录入

### 6.1 录入K-1收入
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

### 6.2 录入现金/其他收入
```
POST /income/other

Request:
{
  "income_type": "cash" | "check" | "other_platform",
  "description": "咨询服务费",
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

### 6.3 获取所有手动收入记录
```
GET /income

Query:
  year: integer (default: 当年)

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

### 6.4 删除手动收入记录
```
DELETE /income/{income_id}

Response:
{
  "success": true
}
```

---

## 七、税务计算

### 7.1 获取主页四格指标
```
GET /tax/summary

Query:
  year: integer (default: 当年)

Response:
{
  "year": 2026,
  "total_income": 84200.00,
  "total_deductible": 18640.00,
  "taxable_income": 65560.00,       // 最低0，不显示负数
  "estimated_tax_reduction": 4890.00,
  "is_zero_taxable": false,          // true时前端显示"本年度暂无应税收入"
  "pending_count": 3,                // 待确认款项数量
  "note": "基于今年已入账收入估算 · 随时更新"
}
```

### 7.2 获取报告页完整税务计算
```
GET /tax/report

Query:
  year: integer (default: 当年)

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
      "name": "软件订阅",
      "total": 1240.00,
      "count": 12,
      "transactions": [ ... ]
    }
  ]
}
```

### 7.3 获取自行报税指南
```
GET /tax/filing-guide

Query:
  year: integer (default: 当年)

Response:
{
  "year": 2026,
  "schedule_c": {
    "line_27_other_expenses": {
      "label": "软件订阅 / 云服务",
      "amount": 1240.00
    },
    "line_24a_travel": {
      "label": "业务差旅",
      "amount": 3400.00
    },
    "line_24b_meals": {
      "label": "业务餐饮（×50%已计算）",
      "amount": 1050.00
    }
  },
  "schedule_se": {
    "net_self_employment": {
      "label": "自雇净收入",
      "amount": 65560.00
    }
  },
  "schedule_1": {
    "line_17_se_deduction": {
      "label": "自雇税抵扣",
      "amount": 5016.00
    }
  }
}
```

---

## 八、报告导出

### 8.1 导出PDF
```
GET /reports/pdf

Query:
  year: integer (default: 当年)

Response: application/pdf 二进制流
```

### 8.2 发送给CPA
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

## 九、设置

### 9.1 更新税务框架（修改后触发全量重算）
```
PUT /users/tax-settings

Request: 同2.1

Response:
{
  "updated_at": "2026-03-23T10:00:00Z",
  "recalculating": true    // 后台正在重算所有数据
}
```

### 9.2 获取用户信息
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

### 9.3 删除账户
```
DELETE /users/me

Response:
{
  "success": true,
  "message": "账户及所有数据已删除"
}
```

---

## 十、Webhook（后端内部，前端无需调用）

```
POST /plaid/webhook          # Plaid事件推送入口
```

前端通过以下方式获取Webhook触发后的数据更新：
- React Query自动轮询（关键数据每30秒刷新）
- Expo Push Notification推送后用户主动进入App触发刷新

---

## 十一、错误码一览

```
AUTH_001    token已过期
AUTH_002    token无效
PLAID_001   Plaid连接失败
PLAID_002   账户需要重新认证
PLAID_003   银行不支持（历史数据不足）
TAX_001     税务框架未设置
TAX_002     计算数据不足
INCOME_001  收入记录不存在
TXN_001     交易不存在
TXN_002     无权限操作此交易
REPORT_001  PDF生成失败
REPORT_002  邮件发送失败
```

---

*最后更新：2026年3月23日 v1.0*
