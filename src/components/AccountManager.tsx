import { Wallet } from 'lucide-react';
import type { Account, PositionWithMarket } from '../types';
import { formatCurrency as fc, pnlColor } from '../lib/utils';
import { useCurrency } from '../lib/CurrencyContext';

interface AccountManagerProps {
  accounts: Account[];
  positions: PositionWithMarket[];
  onAdd: (account: Account) => void;
  onUpdate: (id: string, updates: Partial<Account>) => void;
  onDelete: (id: string) => void;
}

const USER_COLORS: Record<string, string> = {
  Vishal: 'border-blue-500/30',
  Jinesh: 'border-emerald-500/30',
  Hitesh: 'border-purple-500/30',
  Soham: 'border-amber-500/30',
  Aakash: 'border-cyan-500/30',
  Sarthak: 'border-rose-500/30',
  Amrit: 'border-indigo-500/30',
};

export default function AccountManager({ accounts, positions }: AccountManagerProps) {
  const currency = useCurrency();
  const formatCurrency = (v: number) => fc(v, currency);
  function getAccountStats(accountId: string) {
    const accPositions = positions.filter(p => p.accountId === accountId && p.status === 'open');
    const closedPositions = positions.filter(p => p.accountId === accountId && p.status === 'closed');
    const invested = accPositions.reduce((s, p) => s + p.entryPrice * p.quantity, 0);
    const current = accPositions.reduce((s, p) => s + (p.marketValue ?? p.entryPrice * p.quantity), 0);
    const pnl = current - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
    const realizedPnl = closedPositions.reduce((s, p) => {
      if (!p.exitPrice) return s;
      return s + (p.exitPrice - p.entryPrice) * p.quantity;
    }, 0);
    return { openCount: accPositions.length, closedCount: closedPositions.length, invested, current, pnl, pnlPct, realizedPnl };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-100">Portfolios</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => {
          const stats = getAccountStats(account.id);
          return (
            <div key={account.id} className={`rounded-xl bg-slate-900 border ${USER_COLORS[account.owner] ?? 'border-slate-800'} p-4`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{account.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Open Positions</p>
                  <p className="text-slate-200 font-semibold text-sm">{stats.openCount}</p>
                </div>
                <div>
                  <p className="text-slate-500">Closed Trades</p>
                  <p className="text-slate-200 font-semibold text-sm">{stats.closedCount}</p>
                </div>
                <div>
                  <p className="text-slate-500">Invested</p>
                  <p className="text-slate-200 font-semibold tabular-nums text-sm">{formatCurrency(stats.invested)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Current Value</p>
                  <p className="text-slate-200 font-semibold tabular-nums text-sm">{formatCurrency(stats.current)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Unrealized P&L</p>
                  <p className={`font-semibold tabular-nums text-sm ${pnlColor(stats.pnl)}`}>
                    {formatCurrency(stats.pnl)} ({stats.pnlPct.toFixed(1)}%)
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Realized P&L</p>
                  <p className={`font-semibold tabular-nums text-sm ${pnlColor(stats.realizedPnl)}`}>
                    {formatCurrency(stats.realizedPnl)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No portfolios yet.</p>
        </div>
      )}
    </div>
  );
}
