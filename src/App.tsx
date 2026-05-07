import { useMemo, useState } from "react";
import { menuItems, type PageId } from "./config/navigation";
import { accessLevelLabel, pageToDomain, roleRules, type AccessLevel, type UserRole } from "./config/roles";
import { AppShell } from "./layout/AppShell";
import {
  AbTestsPage,
  ChannelsPage,
  DashboardPage,
  MlMonitoringPage,
  OperationsPage,
  ReceivablesPage,
  RecommendationsPage,
  ReportsPage,
  SettingsPage
} from "./pages/Pages";

export const App = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  const roleMenu = useMemo(() => {
    if (!selectedRole) {
      return [];
    }

    return menuItems.filter((item) => roleRules[selectedRole][pageToDomain[item.id]] !== "none");
  }, [selectedRole]);

  const effectivePage = useMemo(() => {
    if (!selectedRole) {
      return null;
    }

    if (!roleMenu.some((item) => item.id === activePage)) {
      return roleMenu[0]?.id ?? null;
    }

    return activePage;
  }, [activePage, roleMenu, selectedRole]);

  const roleAccessHint = useMemo(() => {
    if (!selectedRole || !effectivePage) {
      return "";
    }

    const level = roleRules[selectedRole][pageToDomain[effectivePage]];
    return level === "none" ? "" : accessLevelLabel[level as Exclude<AccessLevel, "none">];
  }, [effectivePage, selectedRole]);

  if (!selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <section className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Выбор роли</h1>
          <p className="mt-2 text-sm text-slate-400">Выберите роль для входа в систему.</p>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {(Object.keys(roleRules) as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-left transition hover:border-blue-500"
              >
                <h2 className="text-base font-semibold">{roleRules[role].label}</h2>
                <ul className="mt-2 space-y-1 text-xs text-slate-300">
                  <li>Дашборды: {roleRules[role].dashboards === "full" ? "Да" : roleRules[role].dashboards === "none" ? "Нет" : "Ограниченно"}</li>
                  <li>Работа с должниками: {roleRules[role].debtWork === "full" ? "Да" : roleRules[role].debtWork === "none" ? "Нет" : "Ограниченно"}</li>
                  <li>ML-мониторинг: {roleRules[role].mlMonitoring === "full" ? "Да" : roleRules[role].mlMonitoring === "none" ? "Нет" : "Ограниченно / частично"}</li>
                </ul>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const pageContent: Record<PageId, JSX.Element> = {
    dashboard: <DashboardPage />,
    receivables: <ReceivablesPage />,
    recommendations: <RecommendationsPage />,
    operations: <OperationsPage />,
    channels: <ChannelsPage />,
    "ab-tests": <AbTestsPage />,
    "ml-monitoring": <MlMonitoringPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />
  };

  if (!effectivePage) {
    return null;
  }

  return (
    <AppShell
      activePage={effectivePage}
      onChangePage={setActivePage}
      onChangeRole={() => setSelectedRole(null)}
      menuItems={roleMenu}
      roleTitle={roleRules[selectedRole].label}
      roleAccessHint={roleAccessHint}
    >
      {pageContent[effectivePage]}
    </AppShell>
  );
};
