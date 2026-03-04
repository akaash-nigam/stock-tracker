import { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import type { WatchlistItem, MarketQuote, Theme, UserName } from '../types';
import { generateId, formatCurrency, formatPercent, pnlColor } from '../lib/utils';

interface WatchlistProps {
  items: WatchlistItem[];
  quotes: Record<string, MarketQuote>;
  onAdd: (item: WatchlistItem) => void;
  onDelete: (id: string) => void;
  currentUser?: UserName | null;
}

const THEMES: Theme[] = ['AI & Infra', 'Energy & Resources', 'Autonomy & Frontier', 'Socio-Econ', 'Other'];

export default function Watchlist({ items, quotes, onAdd, onDelete, currentUser }: WatchlistProps) {
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState('');
  const [theme, setTheme] = useState<Theme>('AI & Infra');
  const [note, setNote] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!ticker.trim()) return;
    onAdd({
      id: generateId(),
      ticker: ticker.toUpperCase().trim(),
      theme,
      note,
      addedAt: new Date().toISOString(),
      addedBy: currentUser ?? undefined,
    });
    setTicker('');
    setNote('');
    setShowForm(false);
  }

  // Group by theme
  const grouped = new Map<string, WatchlistItem[]>();
  for (const item of items) {
    const list = grouped.get(item.theme) ?? [];
    list.push(item);
    grouped.set(item.theme, list);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Watchlist</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Ticker
          </button>
        )}
      </div>

      {/* Quick add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ticker</label>
              <input
                type="text"
                value={ticker}
                onChange={e => setTicker(e.target.value)}
                placeholder="AAPL"
                autoFocus
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Theme</label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value as Theme)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-slate-400 mb-1">Note</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Why watching this?"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold">
              Add
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Watchlist grid */}
      {items.length > 0 ? (
        [...grouped.entries()].map(([themeName, themeItems]) => (
          <div key={themeName}>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{themeName}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {themeItems.map(item => {
                const quote = quotes[item.ticker];
                const price = quote?.c ?? null;
                const change = quote?.d ?? null;
                const changePct = quote?.dp ?? null;
                return (
                  <div key={item.id} className="rounded-xl bg-slate-900 border border-slate-800 p-3 group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-slate-100">{item.ticker}</span>
                        {changePct !== null && (
                          <span className={`ml-2 text-xs ${pnlColor(changePct)}`}>
                            {changePct >= 0 ? <TrendingUp className="w-3 h-3 inline mr-0.5" /> : <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                            {formatPercent(changePct)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold tabular-nums text-slate-200">
                        {price !== null ? formatCurrency(price) : '--'}
                      </span>
                      {change !== null && (
                        <span className={`text-xs tabular-nums ${pnlColor(change)}`}>
                          {change >= 0 ? '+' : ''}{formatCurrency(change)}
                        </span>
                      )}
                    </div>
                    {quote && (
                      <div className="flex gap-3 mt-1 text-[10px] text-slate-500 tabular-nums">
                        <span>H: {formatCurrency(quote.h)}</span>
                        <span>L: {formatCurrency(quote.l)}</span>
                        <span>O: {formatCurrency(quote.o)}</span>
                      </div>
                    )}
                    {item.note && (
                      <p className="text-xs text-slate-500 mt-2 truncate">{item.note}</p>
                    )}
                    {item.addedBy && (
                      <p className="text-[10px] text-slate-600 mt-1">Added by {item.addedBy}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-slate-500">
          <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tickers on your watchlist yet.</p>
        </div>
      )}
    </div>
  );
}
