import { History, TrendingUp, TrendingDown } from 'lucide-react';
import type { Position, Account } from '../types';
import { formatCurrency, formatPercent, pnlColor, pnlBg } from '../lib/utils';

interface TradeHistoryProps {
  positions: Position[];
  accounts: Account[];
}

export default function TradeHistory({ positions, accounts }: TradeHistoryProps) {
  const closedTrades = positions
    .filter(p => p.status === 'closed')
    .sort((a, b) => (b.closedAt ?? b.createdAt).localeCompare(a.closedAt ?? a.createdAt));

  const accountMap = new Map(accounts.map(a => [a.id, a]));

  // Summary stats
  const totalRealizedPnl = closedTrades.reduce((sum, p) => {
    if (!p.exitPrice) return sum;
    return sum + (p.exitPrice - p.entryPrice) * p.quantity;
  }, 0);
  const winners = closedTrades.filter(p => p.exitPrice && p.exitPrice > p.entryPrice).length;
  const losers = closedTrades.filter(p => p.exitPrice && p.exitPrice < p.entryPrice).length;
  const winRate = closedTrades.length > 0 ? (winners / closedTrades.length) * 100 : 0;

  const avgWin = winners > 0
    ? closedTrades.filter(p => p.exitPrice && p.exitPrice > p.entryPrice)
        .reduce((s, p) => s + ((p.exitPrice! - p.entryPrice) / p.entryPrice) * 100, 0) / winners
    : 0;
  const avgLoss = losers > 0
    ? closedTrades.filter(p => p.exitPrice && p.exitPrice < p.entryPrice)
        .reduce((s, p) => s + ((p.exitPrice! - p.entryPrice) / p.entryPrice) * 100, 0) / losers
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-100">Trade History</h1>

      {/* Summary cards */}
      {closedTrades.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-1">Closed Trades</p>
            <p className="text-lg font-bold text-slate-100">{closedTrades.length}</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-1">Realized P&L</p>
            <p className={`text-lg font-bold tabular-nums ${pnlColor(totalRealizedPnl)}`}>
              {formatCurrency(totalRealizedPnl)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-1">Win Rate</p>
            <p className={`text-lg font-bold tabular-nums ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
              {winRate.toFixed(0)}%
            </p>
            <p className="text-[10px] text-slate-500">{winners}W / {losers}L</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-1">Avg Win</p>
            <p className="text-lg font-bold tabular-nums text-emerald-400">{formatPercent(avgWin)}</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-1">Avg Loss</p>
            <p className="text-lg font-bold tabular-nums text-red-400">{formatPercent(avgLoss)}</p>
          </div>
        </div>
      )}

      {/* Closed trades list */}
      {closedTrades.length > 0 ? (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Ticker</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Entry</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Exit</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Qty</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">P&L $</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">P&L %</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">Account</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">Closed</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden md:table-cell">By</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 hidden lg:table-cell">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {closedTrades.map(p => {
                const pnl = p.exitPrice ? (p.exitPrice - p.entryPrice) * p.quantity : 0;
                const pnlPct = p.exitPrice ? ((p.exitPrice - p.entryPrice) / p.entryPrice) * 100 : 0;
                const acc = accountMap.get(p.accountId);
                return (
                  <tr key={p.id}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{p.ticker}</span>
                        <span className={`p-0.5 rounded ${pnlBg(pnl)}`}>
                          {pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-300">{formatCurrency(p.entryPrice)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-300">{p.exitPrice ? formatCurrency(p.exitPrice) : '--'}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-400">{p.quantity}</td>
                    <td className={`px-3 py-2.5 tabular-nums font-medium ${pnlColor(pnl)}`}>{formatCurrency(pnl)}</td>
                    <td className={`px-3 py-2.5 tabular-nums font-medium ${pnlColor(pnlPct)}`}>{formatPercent(pnlPct)}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-400 hidden md:table-cell">{acc?.name ?? '--'}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 hidden md:table-cell">
                      {p.closedAt ? new Date(p.closedAt).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-400 hidden md:table-cell">{p.addedBy ?? '--'}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 hidden lg:table-cell max-w-[200px] truncate">
                      {p.closeNote ?? '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No closed trades yet. Close a position to see it here.</p>
        </div>
      )}
    </div>
  );
}
