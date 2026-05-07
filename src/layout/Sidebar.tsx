import { type MenuItem, type PageId } from "../config/navigation";

type SidebarProps = {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  menuItems: MenuItem[];
};

export const Sidebar = ({ activePage, onSelectPage, menuItems }: SidebarProps) => (
  <aside className="sticky top-6 h-[calc(100vh-3rem)] w-72 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <div className="mb-6 px-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">ML DEBIT</p>
      <h1 className="mt-1 text-lg font-semibold">SmartCollection AI</h1>
    </div>

    <nav className="max-h-[calc(100vh-9rem)] space-y-1 overflow-auto pr-1">
      {menuItems.map(({ id, title, icon: Icon }) => {
        const isActive = id === activePage;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectPage(id)}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
              isActive ? "bg-blue-500/20 text-blue-300" : "text-slate-300 hover:bg-slate-800"
            ].join(" ")}
          >
            <Icon size={18} />
            <span>{title}</span>
          </button>
        );
      })}
    </nav>
  </aside>
);
