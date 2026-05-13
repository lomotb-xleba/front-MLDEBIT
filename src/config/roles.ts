import { type PageId } from "./navigation";

export type AccessLevel = "none" | "limited" | "full" | "partial";

export type UserRole = "lead" | "analyst" | "ml" | "operator" | "admin";

type RoleRule = {
  label: string;
  dashboards: AccessLevel;
  debtWork: AccessLevel;
  mlMonitoring: AccessLevel;
  userManagement: AccessLevel;
};

export const roleRules: Record<UserRole, RoleRule> = {
  lead: {
    label: "Руководитель",
    dashboards: "full",
    debtWork: "limited",
    mlMonitoring: "limited",
    userManagement: "none"
  },
  analyst: {
    label: "Аналитик",
    dashboards: "full",
    debtWork: "full",
    mlMonitoring: "partial",
    userManagement: "none"
  },
  ml: {
    label: "ML-инженер",
    dashboards: "full",
    debtWork: "limited",
    mlMonitoring: "full",
    userManagement: "none"
  },
  operator: {
    label: "Оператор",
    dashboards: "limited",
    debtWork: "full",
    mlMonitoring: "none",
    userManagement: "none"
  },
  admin: {
    label: "Администратор",
    dashboards: "full",
    debtWork: "full",
    mlMonitoring: "full",
    userManagement: "full"
  }
};

export const pageToDomain: Record<PageId, keyof Omit<RoleRule, "label">> = {
  dashboard: "dashboards",
  receivables: "dashboards",
  channels: "dashboards",
  reports: "dashboards",
  recommendations: "debtWork",
  operations: "debtWork",
  "ml-monitoring": "mlMonitoring"
};

export const accessLevelLabel: Record<Exclude<AccessLevel, "none">, string> = {
  full: "Полный доступ",
  limited: "Ограниченный доступ",
  partial: "Частичный доступ"
};
