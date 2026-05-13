export type DashboardTrendPoint = {
  period: string;
  recoveryRate: number;
  collected: number;
};

export type ChannelPerformance = {
  channel: string;
  roi: number;
  collected: number;
};

export type DashboardMetrics = {
  recoveryRate: number;
  cashToCash: string;
  expectedEffect: number;
  accountsInWork: number;
  atRiskAccounts: number;
  modelStatus: string;
  trend: DashboardTrendPoint[];
  channels: ChannelPerformance[];
};

export type ReceivableFilter = {
  label: string;
  options: string[];
};

export type ReceivableDistribution = {
  name: string;
  value: number;
};

export type ReceivablesSummary = {
  totalDebt: number;
  overdueDebt: number;
  overdueShare: number;
  avgOverdueDays: number;
  topRegions: Array<{ region: string; amount: number }>;
  overdueDistribution: ReceivableDistribution[];
  segmentDistribution: ReceivableDistribution[];
};

export type RecommendationItem = {
  id: string;
  account: string;
  recommendation: string;
  priority: string;
  successRate: string;
  debt: number;
  riskScore: number;
  region: string;
  status: "в работе" | "выполнено";
};

export type OperationTask = {
  id: string;
  account: string;
  priority: string;
  overdue: string;
  amount: number;
  channel: string;
  status: string;
};

export type ChannelMetric = {
  channel: string;
  roi: number;
  responseRate: number;
  avgEffect: number;
};

export type DriftAlert = {
  name: string;
  level: "high" | "medium" | "ok";
};

export type ConfusionCategory = {
  name: string;
  value: number;
};

export type ModelQuality = {
  rocAuc: number;
  precision: number;
  recall: number;
  f1Score: number;
  status: string;
  modelSource: string;
  version: string;
  trainedOn: string;
  driftAlerts: DriftAlert[];
  confusion: ConfusionCategory[];
};

export const dashboardMetrics: DashboardMetrics = {
  recoveryRate: 72,
  cashToCash: "34 дня",
  expectedEffect: 5200000,
  accountsInWork: 13850,
  atRiskAccounts: 1920,
  modelStatus: "Стабильна",
  trend: [
    { period: "Янв", recoveryRate: 56, collected: 42 },
    { period: "Фев", recoveryRate: 58, collected: 48 },
    { period: "Мар", recoveryRate: 60, collected: 53 },
    { period: "Апр", recoveryRate: 65, collected: 58 },
    { period: "Май", recoveryRate: 72, collected: 62 }
  ],
  channels: [
    { channel: "SMS", roi: 118, collected: 8.4 },
    { channel: "Email", roi: 96, collected: 5.2 },
    { channel: "Оператор", roi: 142, collected: 11.0 },
    { channel: "Автодозвон", roi: 131, collected: 7.3 }
  ]
};

export const receivablesSummary: ReceivablesSummary = {
  totalDebt: 128400000,
  overdueDebt: 96400000,
  overdueShare: 75,
  avgOverdueDays: 43,
  topRegions: [
    { region: "Октябрьский район", amount: 35400000 },
    { region: "Свердловский район", amount: 21800000 },
    { region: "Иркутск 2", amount: 13200000 }
  ],
  overdueDistribution: [
    { name: "0–30 дн.", value: 28 },
    { name: "31–60 дн.", value: 36 },
    { name: "61+ дн.", value: 36 }
  ],
  segmentDistribution: [
    { name: "Крупные счета", value: 44 },
    { name: "Средние счета", value: 33 },
    { name: "Малые счета", value: 23 }
  ]
};

export const recommendationsMock: RecommendationItem[] = [
  {
    id: "C-1042",
    account: "ул. Пушкина, 15, кв. 8",
    recommendation: "звонок оператора",
    priority: "высокий",
    successRate: "78%",
    debt: 840000,
    riskScore: 0.62,
    region: "Октябрьский район",
    status: "в работе"
  },
  {
    id: "C-1188",
    account: "ул. Ленина, 32, кв. 4",
    recommendation: "SMS",
    priority: "средний",
    successRate: "61%",
    debt: 460000,
    riskScore: 0.48,
    region: "Октябрьский район",
    status: "в работе"
  },
  {
    id: "C-1326",
    account: "пр. Невский, 24, кв. 12",
    recommendation: "письмо на email",
    priority: "высокий",
    successRate: "53%",
    debt: 320000,
    riskScore: 0.71,
    region: "Иркутск 2",
    status: "в работе"
  }
];

export const operationTasks: OperationTask[] = [
  {
    id: "C-1042",
    account: "ул. Пушкина, 15, кв. 8",
    priority: "высокий",
    overdue: "42 дня",
    amount: 840000,
    channel: "Оператор",
    status: "В работе"
  },
  {
    id: "C-1188",
    account: "ул. Ленина, 32, кв. 4",
    priority: "средний",
    overdue: "19 дней",
    amount: 460000,
    channel: "Автодозвон",
    status: "В работе"
  },
  {
    id: "C-1326",
    account: "пр. Невский, 24, кв. 12",
    priority: "высокий",
    overdue: "67 дней",
    amount: 320000,
    channel: "SMS",
    status: "В работе"
  }
];

export const channelMetrics: ChannelMetric[] = [
  { channel: "Автодозвон", roi: 131, responseRate: 18, avgEffect: 12600 },
  { channel: "SMS", roi: 118, responseRate: 14, avgEffect: 9800 },
  { channel: "Email", roi: 96, responseRate: 11, avgEffect: 7200 },
  { channel: "Оператор", roi: 142, responseRate: 21, avgEffect: 15500 }
];

export const modelQuality: ModelQuality = {
  rocAuc: 0.84,
  precision: 0.79,
  recall: 0.74,
  f1Score: 0.76,
  status: "Предобученная модель",
  modelSource: "Имейте в виду что это предобученная модель, которая может не идеально соответствовать специфике ваших данных. Рекомендуется провести дополнительную калибровку и тестирование на ваших данных для достижения оптимальных результатов.",
  version: "v2.1-pretrained",
  trainedOn: "2025-12-01",
  driftAlerts: [
    { name: "Income_Source", level: "medium" },
    { name: "Last_Contact_Days", level: "medium" },
    { name: "Target distribution", level: "ok" }
  ],
  confusion: [
    { name: "True Positive", value: 3620 },
    { name: "False Positive", value: 310 },
    { name: "False Negative", value: 625 },
    { name: "True Negative", value: 9480 }
  ]
};
