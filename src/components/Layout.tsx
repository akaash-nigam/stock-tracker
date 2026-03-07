import { useState } from 'react';
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
  Settings,
  Key,
} from 'lucide-react';
import { clearSession, exportData, importData, getFinnhubApiKey, setFinnhubApiKey, getCurrency, setCurrency as saveCurrency } from '../lib/storage';
import type { Currency } from '../lib/storage';
import { hasApiKey } from '../lib/finnhub';

import type { UserName } from '../types';

interface LayoutProps {
  onLogout: () => void;
  onRefresh: () => void;
  onDataChange: () => void;
  lastUpdated: string | null;
  loading: boolean;
  alertsOn: boolean;
  onToggleAlerts: () => void;
  alertBanner: string | null;
  currentUser: UserName | null;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onApiKeyChange: () => void;
}

const USER_BADGE_COLORS: Record<string, string> = {
  Vishal: 'bg-blue-500/20 text-blue-400',
  Jinesh: 'bg-emerald-500/20 text-emerald-400',
  Hitesh: 'bg-purple-500/20 text-purple-400',
  Soham: 'bg-amber-500/20 text-amber-400',
  Aakash: 'bg-cyan-500/20 text-cyan-400',
  Sarthak: 'bg-rose-500/20 text-rose-400',
  Amrit: 'bg-indigo-500/20 text-indigo-400',
};

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/positions', icon: Table2, label: 'Positions' },
  { to: '/add', icon: PlusCircle, label: 'Add Trade' },
  { to: '/watchlist', icon: Eye, label: 'Watchlist' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
];

export default function Layout({ onLogout, onRefresh, onDataChange, lastUpdated, loading, alertsOn, onToggleAlerts, alertBanner, currentUser, currency, onCurrencyChange, onApiKeyChange }: LayoutProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getFinnhubApiKey() ?? '');

  function handleSaveApiKey() {
    setFinnhubApiKey(apiKeyInput.trim());
    onApiKeyChange();
    setShowSettings(false);
  }

  function handleCurrencyToggle() {
    const next = currency === 'USD' ? 'CAD' : 'USD';
    saveCurrency(next);
    onCurrencyChange(next);
  }

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
            {currentUser && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${USER_BADGE_COLORS[currentUser] ?? 'bg-slate-500/20 text-slate-400'}`}>
                {currentUser}
              </span>
            )}
            <button
              onClick={handleCurrencyToggle}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Toggle currency"
            >
              {currency}
            </button>
            {!hasApiKey() && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded hidden sm:block hover:bg-amber-400/20 transition-colors"
              >
                Set API Key
              </button>
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
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-100">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <Key className="w-4 h-4" />
                  Finnhub API Key
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Get a free key at <a href="https://finnhub.io/register" target="_blank" rel="noopener" className="text-blue-400 underline">finnhub.io/register</a> (60 calls/min, 15-min delayed)
                </p>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="Enter your Finnhub API key"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Currency</p>
                  <p className="text-xs text-slate-500">Display prices in USD or CAD</p>
                </div>
                <button
                  onClick={handleCurrencyToggle}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {currency}
                </button>
              </div>
              <button
                onClick={handleSaveApiKey}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
