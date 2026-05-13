import type { ComponentType } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  ClipboardList,
  FileBarChart2,
  LayoutDashboard,
  WalletCards
} from "lucide-react";

export type PageId =
  | "dashboard"
  | "receivables"
  | "recommendations"
  | "operations"
  | "channels"
  | "ml-monitoring"
  | "reports";

export type MenuItem = {
  id: PageId;
  title: string;
  icon: ComponentType<{ size?: string | number }>;
};

export const menuItems: MenuItem[] = [
  { id: "dashboard", title: "Панель управления", icon: LayoutDashboard },
  { id: "receivables", title: "Дебиторская задолженность", icon: BarChart3 },
  { id: "recommendations", title: "Рекомендации", icon: Bell },
  { id: "operations", title: "Операционная работа", icon: WalletCards },
  { id: "channels", title: "Эффективность каналов", icon: ClipboardList },
  { id: "ml-monitoring", title: "Мониторинг моделей", icon: Bot },
  { id: "reports", title: "Отчёты", icon: FileBarChart2 }
];

export const pageTitleMap: Record<PageId, string> = {
  dashboard: "Панель управления",
  receivables: "Дебиторская задолженность",
  recommendations: "Рекомендации",
  operations: "Операционная работа",
  channels: "Эффективность каналов",
  "ml-monitoring": "Мониторинг моделей",
  reports: "Отчёты"
};
