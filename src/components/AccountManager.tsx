import { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Wallet } from 'lucide-react';
import type { Account, AccountType, PositionWithMarket } from '../types';
import { generateId, formatCurrency, pnlColor } from '../lib/utils';

interface AccountManagerProps {
  accounts: Account[];
  positions: PositionWithMarket[];
  onAdd: (account: Account) => void;
  onUpdate: (id: string, updates: Partial<Account>) => void;
  onDelete: (id: string) => void;
}

const ACCOUNT_TYPES: AccountType[] = ['TFSA', 'RRSP', 'Margin', 'Cash', 'Other'];

export default function AccountManager({ accounts, positions, onAdd, onUpdate, onDelete }: AccountManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('TFSA');
  const [broker, setBroker] = useState('');
  const [cashBalance, setCashBalance] = useState('');
  const [owner, setOwner] = useState('');

  function resetForm() {
    setName('');
    setType('TFSA');
    setBroker('');
    setCashBalance('');
    setOwner('');
    setShowForm(false);
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    if (editingId) {
      onUpdate(editingId, {
        name,
        type,
        broker,
        cashBalance: parseFloat(cashBalance) || 0,
        owner,
      });
    } else {
      onAdd({
        id: generateId(),
        name,
        type,
        broker,
        cashBalance: parseFloat(cashBalance) || 0,
        owner,
      });
    }
    resetForm();
  }

  function startEdit(account: Account) {
    setEditingId(account.id);
    setName(account.name);
    setType(account.type);
    setBroker(account.broker);
    setCashBalance(account.cashBalance.toString());
    setOwner(account.owner);
    setShowForm(true);
  }

  // Calculate per-account stats
  function getAccountStats(accountId: string) {
    const accPositions = positions.filter(p => p.accountId === accountId && p.status === 'open');
    const invested = accPositions.reduce((s, p) => s + p.entryPrice * p.quantity, 0);
    const current = accPositions.reduce((s, p) => s + (p.marketValue ?? p.entryPrice * p.quantity), 0);
    const pnl = current - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
    return { count: accPositions.length, invested, current, pnl, pnlPct };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Accounts</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">
              {editingId ? 'Edit Account' : 'New Account'}
            </h2>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. My TFSA"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AccountType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Broker</label>
              <input
                type="text"
                value={broker}
                onChange={e => setBroker(e.target.value)}
                placeholder="e.g. Wealthsimple, IBKR"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cash Balance</label>
              <input
                type="number"
                step="0.01"
                value={cashBalance}
                onChange={e => setCashBalance(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Owner</label>
              <input
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Your name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingId ? 'Update' : 'Add Account'}
          </button>
        </form>
      )}

      {/* Account cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => {
          const stats = getAccountStats(account.id);
          return (
            <div key={account.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Wallet className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm">{account.name}</h3>
                    <p className="text-xs text-slate-500">{account.type} · {account.broker || 'No broker'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(account)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${account.name}?`)) onDelete(account.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {account.owner && (
                <p className="text-xs text-slate-500 mb-3">Owner: {account.owner}</p>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Cash</p>
                  <p className="text-slate-200 font-semibold tabular-nums">{formatCurrency(account.cashBalance)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Positions</p>
                  <p className="text-slate-200 font-semibold">{stats.count}</p>
                </div>
                <div>
                  <p className="text-slate-500">Invested</p>
                  <p className="text-slate-200 font-semibold tabular-nums">{formatCurrency(stats.invested)}</p>
                </div>
                <div>
                  <p className="text-slate-500">P&L</p>
                  <p className={`font-semibold tabular-nums ${pnlColor(stats.pnl)}`}>
                    {formatCurrency(stats.pnl)} ({stats.pnlPct.toFixed(1)}%)
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-500">Total Value (Cash + Positions)</p>
                <p className="text-sm font-bold text-slate-100 tabular-nums">
                  {formatCurrency(account.cashBalance + stats.current)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && !showForm && (
        <div className="text-center py-12 text-slate-500">
          <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No accounts yet. Add one to get started.</p>
        </div>
      )}
    </div>
  );
}
