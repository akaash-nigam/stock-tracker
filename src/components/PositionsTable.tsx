import { useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Calendar,
  AlertTriangle,
  Search,
  XCircle,
} from 'lucide-react';
import type { PositionWithMarket, Account, Theme, AssetClass, StrategyType, UserName } from '../types';
import { USERS } from '../types';
import { formatCurrency as fc, formatPercent, pnlColor } from '../lib/utils';
import { useCurrency } from '../lib/CurrencyContext';

interface PositionsTableProps {
  positions: PositionWithMarket[];
  accounts: Account[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onClose?: (id: string) => void;
}

type SortKey = 'ticker' | 'pnlPercent' | 'pnl' | 'marketValue' | 'theme' | 'entryPrice' | 'currentPrice';

const STRATEGY_TABS: { label: string; value: StrategyType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Long Term', value: 'Long Term' },
  { label: 'Short Term', value: 'Short Term' },
  { label: 'Swing', value: 'Swing' },
  { label: 'Options', value: 'Options' },
  { label: 'Trend', value: 'Trend Following' },
];

export default function PositionsTable({ positions, accounts, onDelete, onEdit, onClose }: PositionsTableProps) {
  const currency = useCurrency();
  const formatCurrency = (v: number) => fc(v, currency);
  const [sortKey, setSortKey] = useState<SortKey>('ticker');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTheme, setFilterTheme] = useState<Theme | 'all'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'open' | 'closed' | 'all'>('open');
  const [filterAssetClass, setFilterAssetClass] = useState<AssetClass | 'all'>('all');
  const [filterStrategy, setFilterStrategy] = useState<StrategyType | 'all'>('all');
  const [filterUser, setFilterUser] = useState<UserName | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const accountMap = new Map(accounts.map(a => [a.id, a]));

  // Filter
  const q = searchQuery.toLowerCase();
  let filtered = positions.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterTheme !== 'all' && p.theme !== filterTheme) return false;
    if (filterAccount !== 'all' && p.accountId !== filterAccount) return false;
    if (filterAssetClass !== 'all' && p.assetClass !== filterAssetClass) return false;
    if (filterStrategy !== 'all' && p.strategy !== filterStrategy) return false;
    if (filterUser !== 'all' && p.addedBy !== filterUser) return false;
    if (q && !p.ticker.toLowerCase().includes(q) && !p.specificTrend.toLowerCase().includes(q) && !p.rationale.toLowerCase().includes(q)) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'ticker': cmp = a.ticker.localeCompare(b.ticker); break;
      case 'pnlPercent': cmp = (a.pnlPercent ?? 0) - (b.pnlPercent ?? 0); break;
      case 'pnl': cmp = (a.pnl ?? 0) - (b.pnl ?? 0); break;
      case 'marketValue': cmp = (a.marketValue ?? 0) - (b.marketValue ?? 0); break;
      case 'theme': cmp = a.theme.localeCompare(b.theme); break;
      case 'entryPrice': cmp = a.entryPrice - b.entryPrice; break;
      case 'currentPrice': cmp = (a.currentPrice ?? 0) - (b.currentPrice ?? 0); break;
    }
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  const themes: Theme[] = ['AI & Infra', 'Energy & Resources', 'Autonomy & Frontier', 'Socio-Econ', 'Other'];
  const assetClasses: AssetClass[] = ['Equity', 'ETF', 'Option', 'Metals', 'Crypto', 'Other'];

  function SortHeader({ label, sortKeyName, className }: { label: string; sortKeyName: SortKey; className?: string }) {
    return (
      <th
        onClick={() => toggleSort(sortKeyName)}
        className={`px-3 py-2 text-left text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-200 select-none ${className ?? ''}`}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <ArrowUpDown className="w-3 h-3" />
        </span>
      </th>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search ticker, trend, or rationale..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Strategy tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {STRATEGY_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterStrategy(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStrategy === tab.value
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as 'open' | 'closed' | 'all')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filterAssetClass}
          onChange={e => setFilterAssetClass(e.target.value as AssetClass | 'all')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="all">All Assets</option>
          {assetClasses.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterTheme}
          onChange={e => setFilterTheme(e.target.value as Theme | 'all')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="all">All Themes</option>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value as UserName | 'all')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="all">All Users</option>
          {USERS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <span className="text-xs text-slate-500 self-center ml-auto">
          {filtered.length} position{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr>
              <SortHeader label="Ticker" sortKeyName="ticker" />
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">Class</th>
              <SortHeader label="Theme" sortKeyName="theme" className="hidden lg:table-cell" />
              <SortHeader label="Price" sortKeyName="currentPrice" />
              <SortHeader label="Entry" sortKeyName="entryPrice" />
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Qty</th>
              <SortHeader label="Value" sortKeyName="marketValue" />
              <SortHeader label="P&L $" sortKeyName="pnl" />
              <SortHeader label="P&L %" sortKeyName="pnlPercent" />
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">Target</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">Stop</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden lg:table-cell">ER Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden lg:table-cell">Account</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-slate-400 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.map(p => {
              const acc = accountMap.get(p.accountId);
              const isNearStop = p.currentPrice && p.stopLoss
                ? ((p.currentPrice - p.stopLoss) / p.currentPrice) * 100 < 5
                : false;
              const isExpanded = expandedId === p.id;
              const isOption = p.assetClass === 'Option';

              return (
                <tr key={p.id} className="group">
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                    >
                      <span className="font-semibold">{p.ticker}</span>
                      {isOption && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {p.optionType} {p.strikePrice}
                        </span>
                      )}
                      {isNearStop && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                    </button>
                    {isExpanded && (
                      <div className="mt-2 text-xs text-slate-400 space-y-1 max-w-sm">
                        <p><span className="text-slate-500">Trend:</span> {p.specificTrend}</p>
                        <p><span className="text-slate-500">Strategy:</span> {p.strategy}</p>
                        {p.mood && <p><span className="text-slate-500">Mood:</span> {p.mood}</p>}
                        {p.rationale && <p><span className="text-slate-500">Rationale:</span> {p.rationale}</p>}
                        {p.addedBy && <p><span className="text-slate-500">Added by:</span> {p.addedBy}</p>}
                        {isOption && (
                          <>
                            <p><span className="text-slate-500">Type:</span> <span className="text-purple-300">{p.optionType}</span></p>
                            <p><span className="text-slate-500">Strike:</span> ${p.strikePrice?.toFixed(2)}</p>
                            <p><span className="text-slate-500">Expiry:</span> {p.expiryDate}</p>
                            <p><span className="text-slate-500">Premium:</span> ${p.premium?.toFixed(2)} x {p.contracts} contracts</p>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      p.assetClass === 'Equity' ? 'bg-blue-500/10 text-blue-300' :
                      p.assetClass === 'ETF' ? 'bg-emerald-500/10 text-emerald-300' :
                      p.assetClass === 'Option' ? 'bg-purple-500/10 text-purple-300' :
                      p.assetClass === 'Metals' ? 'bg-amber-500/10 text-amber-300' :
                      p.assetClass === 'Crypto' ? 'bg-cyan-500/10 text-cyan-300' :
                      'bg-slate-500/10 text-slate-300'
                    }`}>
                      {p.assetClass}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs hidden lg:table-cell">{p.theme}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {p.currentPrice !== null ? (
                      <div>
                        <span className="text-slate-200">{formatCurrency(p.currentPrice)}</span>
                        {p.changePercent !== null && (
                          <span className={`text-xs ml-1 ${pnlColor(p.changePercent)}`}>
                            {formatPercent(p.changePercent)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-600">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{formatCurrency(p.entryPrice)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {isOption ? `${p.contracts}c` : p.quantity}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">
                    {p.marketValue !== null ? formatCurrency(p.marketValue) : '--'}
                  </td>
                  <td className={`px-3 py-2.5 tabular-nums font-medium ${pnlColor(p.pnl ?? 0)}`}>
                    {p.pnl !== null ? formatCurrency(p.pnl) : '--'}
                  </td>
                  <td className={`px-3 py-2.5 tabular-nums font-medium ${pnlColor(p.pnlPercent ?? 0)}`}>
                    {p.pnlPercent !== null ? formatPercent(p.pnlPercent) : '--'}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400 hidden md:table-cell">
                    {p.targetPrice ? formatCurrency(p.targetPrice) : '--'}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400 hidden md:table-cell">
                    {p.stopLoss ? (
                      <span className={isNearStop ? 'text-amber-400 font-medium' : ''}>
                        {formatCurrency(p.stopLoss)}
                      </span>
                    ) : '--'}
                  </td>
                  <td className="px-3 py-2.5 text-xs hidden lg:table-cell">
                    {p.earningsDate ? (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Calendar className="w-3 h-3" />
                        {p.earningsDate}
                      </span>
                    ) : (
                      <span className="text-slate-600">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-400 hidden lg:table-cell">
                    {acc ? `${acc.name}` : '--'}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.status === 'open' && onClose && (
                        <button
                          onClick={() => onClose(p.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(p.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${p.ticker}?`)) onDelete(p.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={14} className="px-3 py-8 text-center text-slate-500 text-sm">
                  No positions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
