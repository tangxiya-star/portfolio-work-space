/**
 * TaxPilot — Mock数据
 * 最后更新：2026年3月23日 v1.0
 *
 * 使用说明：
 * 1. 在 services/api.ts 中，用这些Mock数据替换真实API调用
 * 2. 后端接口上线后，将对应函数改为真实fetch请求，页面代码无需改动
 * 3. 所有数据格式与API接口文档完全一致
 */

// ─────────────────────────────────────────
// 一、用户认证
// ─────────────────────────────────────────

export const mockAuthResponse = {
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock",
  refresh_token: "mock_refresh_token_abc123",
  is_new_user: false
}

export const mockUser = {
  id: "usr_01HV3K9XMQP8N2J7T5R6W4B",
  email: "evan@hawky.co",
  subscription_status: "active",
  trial_ends_at: null,
  created_at: "2026-01-15T10:00:00Z"
}

// ─────────────────────────────────────────
// 二、税务框架设定
// ─────────────────────────────────────────

export const mockTaxSettings = {
  income_types: ["1099", "side"],
  entity_type: "LLC",
  state: "CA",
  filing_status: "single",
  tax_start_year: 2024,
  tax_region: "US",
  updated_at: "2026-03-01T10:00:00Z"
}

// ─────────────────────────────────────────
// 三、Plaid银行账户
// ─────────────────────────────────────────

export const mockPlaidItems = {
  items: [
    {
      item_id: "item_01HV3K9CHASE001",
      institution_name: "Chase",
      status: "active",
      last_synced_at: "2026-03-23T08:00:00Z",
      accounts: [
        {
          account_id: "acc_chase_checking",
          name: "Chase Checking",
          type: "depository",
          subtype: "checking",
          mask: "2847"
        },
        {
          account_id: "acc_chase_sapphire",
          name: "Chase Sapphire",
          type: "credit",
          subtype: "credit card",
          mask: "4821"
        }
      ]
    },
    {
      item_id: "item_01HV3K9CHASE002",
      institution_name: "Chase",
      status: "reauth_required",   // 演示重新认证状态
      last_synced_at: "2026-03-10T08:00:00Z",
      accounts: [
        {
          account_id: "acc_business_checking",
          name: "Business Checking",
          type: "depository",
          subtype: "checking",
          mask: "9021"
        }
      ]
    }
  ]
}

export const mockSyncStatus = {
  status: "complete",
  accounts_connected: 3,
  transactions_processed: 1240,
  transactions_total: 1240,
  current_step: "完成"
}

// ─────────────────────────────────────────
// 四、首次发现
// ─────────────────────────────────────────

// 情况二：部分Clear + 部分模糊（最常见）
export const mockDiscovery = {
  case: "case2",
  confirmed_amount: 3840.00,
  pending_count: 23,
  categories: [
    { name: "软件订阅", amount: 1240.00 },
    { name: "业务差旅", amount: 2100.00 },
    { name: "办公支出", amount: 500.00 }
  ],
  estimated_tax_savings: 1680.00,
  tax_deadline_days: 24,
  has_prior_year_deductions: true
}

// 情况三：全模糊
export const mockDiscoveryAllPending = {
  case: "case3",
  confirmed_amount: 0,
  pending_count: 47,
  categories: [],
  estimated_tax_savings: 0,
  tax_deadline_days: 24,
  has_prior_year_deductions: true
}

// 情况四：无历史
export const mockDiscoveryNoHistory = {
  case: "case4",
  confirmed_amount: 0,
  pending_count: 0,
  categories: [],
  estimated_tax_savings: 0,
  tax_deadline_days: 24,
  has_prior_year_deductions: false
}

// ─────────────────────────────────────────
// 五、交易数据
// ─────────────────────────────────────────

// 交易类型定义（与 types/transaction.ts 一致）
export type TransactionStatus = "pending" | "confirmed" | "ignored"
export type SubmitStatus = "submitted" | "pending_submit"
export type JudgmentSource = "ai" | "user"
export type Confidence = "high" | "medium" | "low"

export const mockTransactions = {
  transactions: [
    // 已确认·AI识别
    {
      id: "txn_01HV3AWS001",
      merchant_name: "AWS",
      amount: -243.67,
      date: "2026-03-15",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_def456",
      account: { name: "Chase Checking", mask: "2847" },
      card: {
        category: "软件订阅",
        deductible_pct: 100,
        deductible_amount: 243.67,
        judgment_source: "ai",
        user_declaration: null,
        irs_publication: "Pub 535",
        irs_description: "ordinary and necessary business expense",
        confidence: "high",
        submit_status: "submitted"
      }
    },
    // 待确认·AI返回多分支
    {
      id: "txn_01HV3SFO001",
      merchant_name: "SFO Airport Parking",
      amount: -45.00,
      date: "2026-03-12",
      source: "plaid",
      status: "pending",
      is_income: false,
      plaid_transaction_id: "plaid_txn_ghi789",
      account: { name: "Chase Sapphire", mask: "4821" },
      card: null,
      suggested_branches: [
        {
          category: "业务差旅",
          deductible_pct: 100,
          deductible_amount: 45.00,
          tax_savings: 10.80,
          irs_publication: "Pub 463",
          irs_description: "业务差旅停车费100%抵扣"
        },
        {
          category: "个人消费",
          deductible_pct: 0,
          deductible_amount: 0,
          tax_savings: 0,
          irs_publication: null,
          irs_description: "个人消费不可抵扣"
        }
      ]
    },
    // 已确认·用户声明（已修改未提交状态）
    {
      id: "txn_01HV3NOBU001",
      merchant_name: "Nobu Restaurant",
      amount: -280.00,
      date: "2026-03-14",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_abc123",
      account: { name: "Chase Sapphire", mask: "4821" },
      card: {
        category: "业务餐饮",
        deductible_pct: 50,
        deductible_amount: 140.00,
        judgment_source: "user",
        user_declaration: "和客户业务晚餐，讨论Q2合同续签",
        irs_publication: "Pub 463",
        irs_description: "业务餐饮50%抵扣规则",
        confidence: "high",
        submit_status: "pending_submit",   // 演示已修改未提交状态
        pending_changes: {
          user_declaration: "Q2合同续签客户晚餐"
        }
      }
    },
    // 收入条目
    {
      id: "txn_01HV3STRIPE001",
      merchant_name: "Stripe",
      amount: 3200.00,
      date: "2026-03-10",
      source: "plaid",
      status: "confirmed",
      is_income: true,
      plaid_transaction_id: "plaid_txn_jkl012",
      account: { name: "Chase Checking", mask: "2847" },
      card: null
    },
    // Notion订阅
    {
      id: "txn_01HV3NOTION001",
      merchant_name: "Notion",
      amount: -16.00,
      date: "2026-03-10",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_mno345",
      account: { name: "Chase Checking", mask: "2847" },
      card: {
        category: "软件订阅",
        deductible_pct: 100,
        deductible_amount: 16.00,
        judgment_source: "ai",
        user_declaration: null,
        irs_publication: "Pub 535",
        irs_description: "ordinary and necessary business expense",
        confidence: "high",
        submit_status: "submitted"
      }
    }
  ],
  next_cursor: null
}

// 按分类汇总（省税页）
export const mockTransactionsByCategory = {
  year: 2026,
  categories: [
    {
      name: "软件订阅",
      total_amount: 1240.00,
      tax_savings: 297.60,
      transaction_count: 12,
      transactions: [
        mockTransactions.transactions[0],  // AWS
        mockTransactions.transactions[4],  // Notion
      ]
    },
    {
      name: "业务差旅",
      total_amount: 3400.00,
      tax_savings: 816.00,
      transaction_count: 8,
      transactions: []
    },
    {
      name: "业务餐饮",
      total_amount: 2100.00,
      tax_savings: 504.00,
      transaction_count: 15,
      transactions: [
        mockTransactions.transactions[2],  // Nobu
      ]
    },
    {
      name: "待确认",
      total_amount: 0,
      tax_savings: 0,
      transaction_count: 23,
      transactions: [
        mockTransactions.transactions[1],  // SFO Parking
      ]
    }
  ]
}

// 按日期（日历页，3月14日）
export const mockTransactionsByDate = {
  transactions: [
    mockTransactions.transactions[2],  // Nobu
    mockTransactions.transactions[0],  // AWS
    mockTransactions.transactions[3],  // Stripe收款
  ]
}

// ─────────────────────────────────────────
// 六、手动收入
// ─────────────────────────────────────────

export const mockManualIncome = {
  records: [
    {
      id: "inc_01HV3K1001",
      income_type: "k1",
      source_name: "Hawky LLC",
      tax_year: 2025,
      ordinary_income: 84200.00,
      rental_income: null,
      interest_income: null,
      capital_gains: null,
      other_income: null,
      total_income: 84200.00,
      created_at: "2026-03-01T10:00:00Z"
    }
  ]
}

// ─────────────────────────────────────────
// 七、税务计算
// ─────────────────────────────────────────

export const mockTaxSummary = {
  year: 2026,
  total_income: 84200.00,
  total_deductible: 18640.00,
  taxable_income: 65560.00,
  estimated_tax_reduction: 4890.00,
  is_zero_taxable: false,
  pending_count: 3,
  note: "基于今年已入账收入估算 · 随时更新"
}

// 边界情况：收入小于支出
export const mockTaxSummaryZero = {
  year: 2026,
  total_income: 3000.00,
  total_deductible: 6240.00,
  taxable_income: 0,
  estimated_tax_reduction: 0,
  is_zero_taxable: true,
  pending_count: 0,
  note: "今年支出超过收入，本年度暂无应税收入"
}

export const mockTaxReport = {
  year: 2026,
  total_income: 84200.00,
  total_deductible: 18640.00,
  taxable_income: 65560.00,
  federal_tax: 14423.00,
  federal_rate: "22%",
  self_employment_tax: 10031.00,
  se_rate: "15.3%",
  state_tax: 6097.00,
  state_rate: "9.3%",
  state: "CA",
  estimated_total: 30551.00,
  categories: mockTransactionsByCategory.categories
}

export const mockFilingGuide = {
  year: 2026,
  schedule_c: {
    line_27_other_expenses: {
      label: "软件订阅 / 云服务",
      amount: 1240.00
    },
    line_24a_travel: {
      label: "业务差旅",
      amount: 3400.00
    },
    line_24b_meals: {
      label: "业务餐饮（×50%已计算）",
      amount: 1050.00
    }
  },
  schedule_se: {
    net_self_employment: {
      label: "自雇净收入",
      amount: 65560.00
    }
  },
  schedule_1: {
    line_17_se_deduction: {
      label: "自雇税抵扣",
      amount: 5016.00
    }
  }
}

// ─────────────────────────────────────────
// 八、如何在 services/api.ts 中使用
// ─────────────────────────────────────────
//
// 开发阶段（使用Mock数据）：
//
// import { mockTaxSummary } from '../mocks'
//
// export async function getTaxSummary(year: number) {
//   // TODO: 替换为真实请求
//   return mockTaxSummary
// }
//
// 后端上线后（替换为真实请求）：
//
// export async function getTaxSummary(year: number) {
//   return api.get<TaxSummary>(`/tax/summary?year=${year}`)
// }
//
// 页面组件代码完全不需要改动。
