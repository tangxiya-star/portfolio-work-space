# TaxPilot — 前端开发规范

> 最后更新：2026年3月23日 v1.0
> 面向前端开发者，请在开始任何开发工作前完整阅读本文档

---

## 零、开始之前

你需要的参考材料：
- **Wireframe v2**：所有页面的UI参考
- **IA活文档**：每个页面的业务逻辑
- **API接口文档**：每个页面调用哪些接口
- **本文档**：代码怎么组织、什么约束不能破

---

## 一、技术栈

```
框架        React Native + Expo Managed Workflow
路由        Expo Router（文件路由）
状态管理    Zustand
请求管理    React Query
语言        TypeScript（严格模式）
样式        StyleSheet（不用第三方UI库）
图标        @expo/vector-icons
```

---

## 二、目录结构规范

严格按照以下结构创建文件，不允许自行调整目录层级：

```
taxpilot-app/
├── app/                           # 页面文件（Expo Router）
│   ├── _layout.tsx                # 根布局，鉴权逻辑在这里
│   ├── (auth)/                    # 未登录流程
│   │   ├── welcome.tsx            # 启动页
│   │   ├── onboarding/
│   │   │   ├── step1.tsx          # 收入来源+实体类型
│   │   │   ├── step2.tsx          # 所在州+婚姻状态
│   │   │   └── step3.tsx          # 报税起点
│   │   ├── connect.tsx            # Plaid银行连接
│   │   ├── loading.tsx            # 数据加载页
│   │   └── discovery/
│   │       ├── index.tsx          # 首次发现路由（根据case跳转）
│   │       ├── case1.tsx          # 全Clear
│   │       ├── case2.tsx          # 部分Clear+模糊（最常见）
│   │       ├── case3.tsx          # 全模糊
│   │       ├── case4.tsx          # 无历史
│   │       └── transition.tsx     # 过渡页
│   └── (tabs)/                    # 主界面
│       ├── _layout.tsx            # Tab布局
│       ├── index.tsx              # 主页
│       ├── calendar.tsx           # 日历页
│       ├── savings.tsx            # 省税页
│       └── report.tsx             # 报告页
│
├── components/                    # 可复用组件
│   ├── transaction/
│   │   ├── TransactionCard.tsx    # 四入口共用卡片
│   │   ├── TransactionDetail.tsx  # 详情页
│   │   ├── EvidenceChain.tsx      # 三层凭证链
│   │   ├── PendingForm.tsx        # 待确认声明表单
│   │   ├── ManualEntry.tsx        # 手动录入支出
│   │   └── BatchSubmitBar.tsx     # 批量提交浮出按钮
│   ├── income/
│   │   ├── K1Form.tsx             # K-1收入表单
│   │   └── OtherIncomeForm.tsx    # 现金/其他收入表单
│   ├── tax/
│   │   ├── TaxSummary.tsx         # 四格核心指标
│   │   ├── TaxCalculation.tsx     # 税务计算过程
│   │   └── FilingGuide.tsx        # 自行报税指南
│   ├── plaid/
│   │   └── ReauthBanner.tsx       # 重新认证警告（按账户独立）
│   └── common/
│       ├── Button.tsx
│       ├── Tag.tsx
│       └── LoadingState.tsx
│
│
├── services/
│   ├── api.ts                     # 所有后端请求封装
│   ├── plaid.ts                   # Plaid Link初始化
│   └── storage.ts                 # AsyncStorage封装
│
├── store/
│   └── taxStore.ts                # Zustand全局状态
│
├── hooks/                         # 自定义Hook
│   ├── useTransactions.ts
│   ├── useTaxSummary.ts
│   └── usePlaidItems.ts
│
├── types/                         # TypeScript类型定义
│   ├── api.ts                     # API响应类型
│   ├── transaction.ts
│   └── tax.ts
│
└── constants/
    └── theme.ts                   # 颜色、字体、间距
```

---

## 三、命名规范

### 文件命名
```
页面文件        小写kebab-case        welcome.tsx / step1.tsx
组件文件        PascalCase            TransactionCard.tsx
Hook文件        camelCase，use前缀    useTransactions.ts
工具文件        camelCase             formatCurrency.ts
类型文件        camelCase             transaction.ts
```

### 组件命名
```typescript
// 正确：与文件名一致
export default function TransactionCard() { ... }

// 错误：与文件名不一致
export default function TxCard() { ... }
```

### 变量命名
```typescript
// 布尔值用is/has/can前缀
const isLoading = true
const hasUnsubmittedChanges = false
const canSubmit = true

// 事件处理用handle前缀
const handleSubmit = () => { ... }
const handlePress = () => { ... }
```

---

## 四、多国扩张说明

TaxPilot当前只做美国版，未来扩张到其他市场时会作为独立项目重新开发。

前端**不需要**维护多国config层，也不需要为多国扩张做任何特殊处理。

唯一需要注意的是：所有API请求的响应数据中包含`tax_region`字段，前端忽略即可，不需要基于它做任何条件渲染。

---

## 五、API调用规范

所有后端请求必须通过`services/api.ts`封装，不允许在组件或页面中直接使用`fetch`。

### services/api.ts 基础结构
```typescript
const BASE_URL = process.env.EXPO_PUBLIC_API_URL

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new APIError(error.error.code, error.error.message)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
```

### React Query使用规范
```typescript
// hooks/useTaxSummary.ts
export function useTaxSummary(year: number) {
  return useQuery({
    queryKey: ['tax-summary', year],
    queryFn: () => api.get<TaxSummary>(`/tax/summary?year=${year}`),
    staleTime: 30 * 1000,      // 30秒内不重新请求
    refetchOnWindowFocus: true, // App切回前台时刷新
  })
}

// 在组件中使用
const { data, isLoading, error } = useTaxSummary(2026)
```

---

## 六、状态管理规范

只有以下内容放入Zustand全局状态，其余数据用React Query管理：

```typescript
// store/taxStore.ts
interface TaxStore {
  // 用户基础信息（登录后持久化）
  userId: string | null
  accessToken: string | null

  // 批量提交状态（跨页面共享）
  pendingSubmitIds: string[]
  addPendingSubmit: (id: string) => void
  removePendingSubmit: (id: string) => void
  clearPendingSubmit: () => void

  // Onboarding进度
  onboardingComplete: boolean
  setOnboardingComplete: (v: boolean) => void
}
```

**不要**把交易列表、税务数据等服务端数据放入Zustand，这些由React Query管理。

---

## 七、批量提交机制实现规范

批量提交是产品的核心交互，实现必须符合以下规范：

```typescript
// 用户修改声明时
const handleDeclarationChange = (transactionId: string, declaration: string) => {
  // 1. 本地更新UI（乐观更新）
  // 2. 加入pending列表
  addPendingSubmit(transactionId)
  // 3. 调用API标记为pending_submit状态
  api.patch(`/transactions/${transactionId}/declaration`, { user_declaration: declaration })
}

// 用户点击"提交X条修改"
const handleBatchSubmit = async () => {
  await api.post('/transactions/batch-submit', { transaction_ids: pendingSubmitIds })
  clearPendingSubmit()
  // 刷新相关数据
  queryClient.invalidateQueries(['tax-summary'])
  queryClient.invalidateQueries(['transactions'])
}

// 离开页面时检查
useEffect(() => {
  return () => {
    if (pendingSubmitIds.length > 0) {
      // 显示提示："你有X条修改未提交"
    }
  }
}, [])
```

---

## 八、TransactionCard复用规范

TransactionCard是四个入口（主页/日历/省税/报告）共用的核心组件，使用规范：

```typescript
// components/transaction/TransactionCard.tsx
interface TransactionCardProps {
  transaction: Transaction
  onPress: () => void           // 点击跳转详情页
  showDate?: boolean            // 主页显示日期，日历页可不显示
  showCategory?: boolean        // 省税页显示分类标签
}

// 四个入口的跳转方式统一
const handlePress = () => {
  router.push({
    pathname: '/transaction-detail',
    params: {
      id: transaction.id,
      returnTo: 'home' | 'calendar' | 'savings' | 'report'  // 记录来源，用于返回
    }
  })
}
```

---

## 九、主题规范

所有颜色、字体、间距从`constants/theme.ts`读取，不允许硬编码颜色值。

```typescript
// constants/theme.ts
export const theme = {
  colors: {
    primary: '#1a1a1a',
    background: '#F5F5F3',
    surface: '#FFFFFF',
    border: '#C8C6C0',
    borderLight: '#EEECEA',
    textPrimary: '#1a1a1a',
    textSecondary: '#888888',
    textMuted: '#AAAAAA',
    green: '#3B6D11',
    greenBg: '#EAF3DE',
    amber: '#854F0B',
    amberBg: '#FAEEDA',
    amberBorder: '#EF9F27',
    blue: '#185FA5',
    blueBg: '#E6F1FB',
    red: '#A32D2D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  fontSize: {
    xs: 8,
    sm: 9,
    md: 11,
    lg: 13,
    xl: 16,
    xxl: 22,
  },
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    round: 999,
  }
}
```

---

## 十、TypeScript规范

严格模式，不允许使用`any`。

```typescript
// types/transaction.ts
export interface Transaction {
  id: string
  merchant_name: string
  amount: number
  date: string                    // YYYY-MM-DD
  source: 'plaid' | 'manual'
  status: 'pending' | 'confirmed' | 'ignored'
  is_income: boolean
  card?: TransactionCard
}

export interface TransactionCard {
  category: string
  deductible_pct: number
  deductible_amount: number
  judgment_source: 'ai' | 'user'
  user_declaration: string | null
  irs_publication: string
  irs_description: string
  confidence: 'high' | 'medium' | 'low'
  submit_status: 'submitted' | 'pending_submit'
}
```

---

## 十一、禁止事项清单

开发过程中以下行为严格禁止：

```
❌ 在组件中直接使用fetch，必须通过services/api.ts
❌ 在Zustand中存储服务端数据（交易列表、税务数据等）
❌ 使用any类型
❌ 在组件文件中定义业务逻辑，逻辑放入hooks/
```

---

## 十二、开发流程

### 分支规范
```
main          生产环境，不直接提交
dev           日常开发主分支
feature/xxx   具体功能分支，开发完提PR到dev
```

### 提交规范
```
feat: 新增功能
fix: 修复bug
style: 样式调整
refactor: 重构
docs: 文档更新

示例：feat: 实现TransactionCard批量提交功能
```

### 与后端联调
后端接口未完成时，使用Mock数据（见Mock数据文档）。
接口完成后，修改`services/api.ts`中对应函数的实现，组件代码不需要改动。

---

*最后更新：2026年3月23日 v1.0*
