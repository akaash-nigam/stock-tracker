import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Table2,
  PlusCircle,
  Wallet,
  LogOut,
  Download,
  Upload,
  RefreshCw,
  Bell,
  BellOff,
  X,
  Eye,
  History,
} from 'lucide-react';
import { clearSession, exportData, importData } from '../lib/storage';
import { hasApiKey } from '../lib/finnhub';

interface LayoutProps {
  onLogout: () => void;
  onRefresh: () => void;
  onDataChange: () => void;
  lastUpdated: string | null;
  loading: boolean;
  alertsOn: boolean;
  onToggleAlerts: () => void;
  alertBanner: string | null;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/positions', icon: Table2, label: 'Positions' },
  { to: '/add', icon: PlusCircle, label: 'Add Trade' },
  { to: '/watchlist', icon: Eye, label: 'Watchlist' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
];

export default function Layout({ onLogout, onRefresh, onDataChange, lastUpdated, loading, alertsOn, onToggleAlerts, alertBanner }: LayoutProps) {
  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        importData(text);
        onDataChange();
      } catch {
        alert('Invalid file format');
      }
    };
    input.click();
  }

  function handleLogout() {
    clearSession();
    onLogout();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Alert banner */}
      {alertBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-amber-300">{alertBanner}</span>
          <button className="text-amber-400 hover:text-amber-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Stock Tracker
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!hasApiKey() && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                No API key
              </span>
            )}
            {lastUpdated && (
              <span className="text-xs text-slate-500 hidden sm:block">
                Updated {lastUpdated}
              </span>
            )}
            <button
              onClick={onToggleAlerts}
              className={`p-2 rounded-lg transition-colors ${
                alertsOn
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={alertsOn ? 'Alerts ON — click to disable' : 'Alerts OFF — click to enable'}
            >
              {alertsOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh prices"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Export data"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleImport}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Import data"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex border-t border-slate-800">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
