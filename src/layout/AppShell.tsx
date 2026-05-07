import type { ReactNode } from "react";
import { pageTitleMap, type MenuItem, type PageId } from "../config/navigation";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  activePage: PageId;
  onChangePage: (page: PageId) => void;
  onChangeRole: () => void;
  menuItems: MenuItem[];
  roleTitle: string;
  roleAccessHint: string;
  children: ReactNode;
};

export const AppShell = ({ activePage, onChangePage, onChangeRole, menuItems, roleTitle, roleAccessHint, children }: AppShellProps) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="mx-auto flex max-w-[1400px] gap-6 px-6 py-6">
      <Sidebar activePage={activePage} onSelectPage={onChangePage} menuItems={menuItems} />

      <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{pageTitleMap[activePage]}</h2>
            <p className="mt-1 text-xs text-slate-400">{roleTitle}: {roleAccessHint}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onChangeRole}
              className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:border-blue-500 hover:text-blue-300"
            >
              Сменить роль
            </button>
            <span className="rounded-full bg-emerald-950/50 px-3 py-1 text-sm text-emerald-300">Среда обновлена</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  </div>
);
