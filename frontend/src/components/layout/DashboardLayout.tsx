import { LogOut, Menu, Moon, Sun, UsersRound, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";

export const DashboardLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-5 py-5 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-ink dark:text-white">GigFlow</div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Smart Leads</div>
          </div>
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition duration-200 hover:translate-x-1 ${
                isActive ? "bg-blue-50 text-brand dark:bg-blue-950 dark:text-blue-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <UsersRound className="h-5 w-5" />
            Leads
          </NavLink>
        </nav>
      </aside>

      {open ? <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-ink dark:text-white">Leads Dashboard</h1>
                <p className="hidden text-sm text-slate-500 sm:block">Track, qualify, and move opportunities forward.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-ink dark:text-white">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
              <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle dark mode">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" onClick={logout} aria-label="Log out">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};
