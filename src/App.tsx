import { useMemo, useState, type FormEvent } from "react";
import { menuItems, type PageId } from "./config/navigation";
import { accessLevelLabel, pageToDomain, roleRules, type AccessLevel, type UserRole } from "./config/roles";
import { AppShell } from "./layout/AppShell";
import {
  ChannelsPage,
  DashboardPage,
  MlMonitoringPage,
  OperationsPage,
  ReceivablesPage,
  RecommendationsPage,
  ReportsPage
} from "./pages/Pages";
import { deleteCookie, getCookie, setCookie } from "./shared/cookies";

const roleOptions = Object.keys(roleRules) as UserRole[];

const isRole = (value: string | null): value is UserRole => {
  return value !== null && roleOptions.includes(value as UserRole);
};

const getStoredRole = (): UserRole | null => {
  const saved = getCookie("ml-debit-user");
  return isRole(saved) ? saved : null;
};

const getStoredPage = (): PageId => {
  const stored = getCookie("ml-debit-page");
  if (!stored) {
    return "dashboard";
  }
  return menuItems.some((item) => item.id === stored) ? (stored as PageId) : "dashboard";
};

export const App = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(getStoredRole());
  const [loginRole, setLoginRole] = useState<UserRole>(getStoredRole() ?? "analyst");
  const [username, setUsername] = useState(() => getCookie("ml-debit-username") ?? "");
  const [password, setPassword] = useState("");
  const [activePage, setActivePage] = useState<PageId>(getStoredPage);

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

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }
    setSelectedRole(loginRole);
    setCookie("ml-debit-user", loginRole, 7);
    setCookie("ml-debit-username", username.trim(), 7);
    setCookie("ml-debit-page", "dashboard", 7);
    setActivePage("dashboard");
  };

  const handlePageChange = (page: PageId) => {
    setActivePage(page);
    setCookie("ml-debit-page", page, 7);
  };

  const handleLogout = () => {
    deleteCookie("ml-debit-user");
    deleteCookie("ml-debit-username");
    deleteCookie("ml-debit-page");
    setSelectedRole(null);
    setPassword("");
    setActivePage("dashboard");
  };

  if (!selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/30">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SmartCollection AI</p>
            <h1 className="mt-3 text-3xl font-semibold">Вход в систему</h1>
            <p className="mt-2 text-sm text-slate-400">Введите данные для доступа к лицевым счетам.</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-500">Логин</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                placeholder="ivanov"
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-500">Пароль</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                placeholder="••••••••"
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-500">Роль</span>
              <select
                value={loginRole}
                onChange={(event) => setLoginRole(event.target.value as UserRole)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role} className="bg-slate-950 text-slate-100">
                    {roleRules[role].label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Войти
            </button>
          </form>
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
    "ml-monitoring": <MlMonitoringPage />,
    reports: <ReportsPage />
  };

  if (!effectivePage) {
    return null;
  }

  return (
    <AppShell
      activePage={effectivePage}
      onChangePage={handlePageChange}
      onChangeRole={handleLogout}
      menuItems={roleMenu}
      roleTitle={`${roleRules[selectedRole].label} • ${username || "пользователь"}`}
      roleAccessHint={roleAccessHint}
    >
      {pageContent[effectivePage]}
    </AppShell>
  );
};
