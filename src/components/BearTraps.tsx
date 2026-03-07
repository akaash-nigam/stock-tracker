import { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, FileText, Target, Clock, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { BtrAlert, BtrHolding, BtrReport, MarketQuote } from '../types';
import { formatCurrency as fc, formatPercent, pnlColor } from '../lib/utils';
import { useCurrency } from '../lib/CurrencyContext';
import { generateId } from '../lib/utils';

interface BearTrapsProps {
  alerts: BtrAlert[];
  holdings: BtrHolding[];
  reports: BtrReport[];
  quotes: Record<string, MarketQuote>;
  onSaveAlerts: (alerts: BtrAlert[]) => void;
  onSaveHoldings: (holdings: BtrHolding[]) => void;
  onSaveReports: (reports: BtrReport[]) => void;
}

const ALLOC_COLORS: Record<string, string> = {
  'Energy': '#f59e0b',
  'Materials': '#a78bfa',
  'Tech': '#60a5fa',
  'Emerging Markets': '#34d399',
  'Precious Metals': '#fbbf24',
  'Financials': '#f87171',
  'Consumer Disc.': '#fb923c',
  'Value': '#94a3b8',
  'Telecom': '#22d3ee',
};

const PIE_COLORS = ['#f59e0b', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#fb923c', '#94a3b8', '#22d3ee'];

type Tab = 'overview' | 'alerts' | 'short' | 'long';

export default function BearTraps({ alerts, holdings, reports, quotes, onSaveAlerts, onSaveHoldings, onSaveReports }: BearTrapsProps) {
  const currency = useCurrency();
  const formatCurrency = (v: number) => fc(v, currency);
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddAlert, setShowAddAlert] = useState(false);

  const latestReport = reports[reports.length - 1] ?? null;
  const shortHoldings = holdings.filter(h => h.timeframe === 'short');
  const longHoldings = holdings.filter(h => h.timeframe === 'long');

  // Get all unique tickers from holdings for live prices
  const allTickers = [...new Set([...holdings.map(h => h.ticker), ...alerts.slice(0, 20).map(a => a.ticker)])];

  // Allocation pie data
  const allocData = latestReport
    ? Object.entries(latestReport.allocation)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value, color: ALLOC_COLORS[name] ?? '#94a3b8' }))
    : [];

  function handleAddAlert(alert: BtrAlert) {
    onSaveAlerts([alert, ...alerts]);
    setShowAddAlert(false);
  }

  function handleDeleteAlert(id: string) {
    onSaveAlerts(alerts.filter(a => a.id !== id));
  }

  function handleUpdateNotes(notes: string) {
    if (!latestReport) return;
    const updated = reports.map(r => r.id === latestReport.id ? { ...r, notes } : r);
    onSaveReports(updated);
  }

  const tabs: { label: string; value: Tab; icon: typeof FileText }[] = [
    { label: 'Overview', value: 'overview', icon: BarChart3 },
    { label: 'Trade Alerts', value: 'alerts', icon: Target },
    { label: 'Short-Term', value: 'short', icon: Clock },
    { label: 'Long-Term', value: 'long', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Bear Traps Report</h1>
          <p className="text-xs text-slate-500">Larry McDonald's Turning Point — Weekly Tracker</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.value
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && latestReport && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-amber-400">{latestReport.title}</h2>
              <span className="text-xs text-slate-500">{latestReport.date}</span>
            </div>

            {/* Performance vs S&P */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">HC 3-Month</p>
                <p className="text-lg font-bold text-emerald-400">{latestReport.performance.hc3m}</p>
                <p className="text-[10px] text-slate-500">vs S&P {latestReport.performance.sp3m}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">HC 12-Month</p>
                <p className="text-lg font-bold text-emerald-400">{latestReport.performance.hc12m}</p>
                <p className="text-[10px] text-slate-500">vs S&P {latestReport.performance.sp12m}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Realized Sells 12m</p>
                <p className="text-lg font-bold text-emerald-400">{latestReport.performance.realizedSells12m}</p>
                <p className="text-[10px] text-slate-500">Hedge: {latestReport.performance.hedgeRealized12m}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Allocation Pie */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-3">Core Portfolio Allocation</h2>
              {allocData.length > 0 && (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={allocData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                        {allocData.map((entry, i) => (
                          <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#f1f5f9' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5">
                    {allocData.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-slate-300">{d.name}</span>
                        <span className="text-slate-500 ml-auto tabular-nums">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Themes */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-3">Key Themes</h2>
              <ul className="space-y-2 text-xs text-slate-300 max-h-[300px] overflow-y-auto">
                {latestReport.keyThemes.map((theme, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Group Notes */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">Group Notes</h2>
            <p className="text-xs text-slate-500 mb-2">Add your weekly discussion notes here</p>
            <textarea
              value={latestReport.notes}
              onChange={e => handleUpdateNotes(e.target.value)}
              rows={4}
              placeholder="What did the group discuss? Key takeaways, disagreements, action items..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-slate-100">{shortHoldings.length}</p>
              <p className="text-xs text-slate-400">Short-Term Picks</p>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-slate-100">{longHoldings.length}</p>
              <p className="text-xs text-slate-400">Long-Term Picks</p>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-slate-100">{alerts.length}</p>
              <p className="text-xs text-slate-400">Trade Alerts</p>
            </div>
          </div>
        </div>
      )}

      {/* Trade Alerts Tab */}
      {tab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Recent Trade Alerts</h2>
            <button
              onClick={() => setShowAddAlert(!showAddAlert)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Alert
            </button>
          </div>

          {showAddAlert && <AddAlertForm onAdd={handleAddAlert} />}

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Action</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Ticker</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Description</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Size</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">P&L</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {alerts.map(a => (
                  <tr key={a.id} className="group">
                    <td className="px-3 py-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        a.action === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {a.action}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-semibold">{a.ticker}</td>
                    <td className="px-3 py-2 text-slate-400 text-xs">{a.description}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{a.size}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">
                      {a.price ? formatCurrency(a.price) : (quotes[a.ticker]?.c ? formatCurrency(quotes[a.ticker]!.c) : '--')}
                    </td>
                    <td className="px-3 py-2">
                      {a.closingPnl ? (
                        <span className={`text-xs font-bold ${a.closingPnl.startsWith('+') ? 'text-emerald-400' : a.closingPnl.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                          {a.closingPnl}
                        </span>
                      ) : '--'}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{a.date}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteAlert(a.id)}
                        className="p-1 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Short-Term / Long-Term Tabs */}
      {(tab === 'short' || tab === 'long') && (
        <HoldingsTable
          holdings={tab === 'short' ? shortHoldings : longHoldings}
          quotes={quotes}
          formatCurrency={formatCurrency}
          title={tab === 'short' ? 'Short-Term High Conviction (30-60 Days)' : 'Long-Term High Conviction (12-24 Months)'}
        />
      )}
    </div>
  );
}

// Holdings table sub-component
function HoldingsTable({ holdings, quotes, formatCurrency, title }: {
  holdings: BtrHolding[];
  quotes: Record<string, MarketQuote>;
  formatCurrency: (v: number) => string;
  title: string;
}) {
  // Group by sector
  const sectors = [...new Set(holdings.map(h => h.sector))];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Position</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Ticker</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Description</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Sector</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Price</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Day Chg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {holdings.map(h => {
              const quote = quotes[h.ticker];
              return (
                <tr key={h.id}>
                  <td className="px-3 py-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{h.position}</span>
                  </td>
                  <td className="px-3 py-2 font-semibold">{h.ticker}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{h.description}</td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-slate-500">{h.sector}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-slate-200">
                    {quote ? formatCurrency(quote.c) : '--'}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {quote ? (
                      <span className={`flex items-center gap-1 text-xs ${pnlColor(quote.dp)}`}>
                        {quote.dp >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(quote.dp)}
                      </span>
                    ) : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sector breakdown */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
        <h3 className="text-xs font-semibold text-slate-400 mb-2">By Sector</h3>
        <div className="flex flex-wrap gap-2">
          {sectors.map(s => {
            const count = holdings.filter(h => h.sector === s).length;
            return (
              <span key={s} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                {s} <span className="text-slate-500">({count})</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Add Alert form sub-component
function AddAlertForm({ onAdd }: { onAdd: (alert: BtrAlert) => void }) {
  const [action, setAction] = useState<'Buy' | 'Sell'>('Buy');
  const [size, setSize] = useState('1/3');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [closingPnl, setClosingPnl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticker) return;
    onAdd({
      id: generateId(),
      action,
      size,
      ticker: ticker.toUpperCase().trim(),
      description,
      price: price ? parseFloat(price) : undefined,
      closingPnl: closingPnl || undefined,
      date: new Date().toISOString().slice(0, 10),
      sector: 'Equities',
    });
    setTicker('');
    setDescription('');
    setPrice('');
    setClosingPnl('');
  }

  const inputClass = "bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900 border border-amber-500/20 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Action</label>
          <select value={action} onChange={e => setAction(e.target.value as 'Buy' | 'Sell')} className={inputClass}>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className={inputClass}>
            <option value="1/4">1/4</option>
            <option value="1/3">1/3</option>
            <option value="1/2">1/2</option>
            <option value="2/3">2/3</option>
            <option value="3/3">3/3</option>
            <option value="All">All</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Ticker</label>
          <input type="text" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="WDAY" className={`${inputClass} w-20`} />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-slate-400 mb-1">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Workday" className={`${inputClass} w-full`} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Price</label>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="$114" className={`${inputClass} w-24`} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Closing P&L</label>
          <input type="text" value={closingPnl} onChange={e => setClosingPnl(e.target.value)} placeholder="+15%" className={`${inputClass} w-20`} />
        </div>
        <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-semibold">
          Add
        </button>
      </div>
    </form>
  );
}
