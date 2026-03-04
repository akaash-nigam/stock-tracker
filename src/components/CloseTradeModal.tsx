import { useState } from 'react';
import { X } from 'lucide-react';
import type { PositionWithMarket } from '../types';
import { formatCurrency, formatPercent, pnlColor } from '../lib/utils';

interface CloseTradeModalProps {
  position: PositionWithMarket;
  onClose: () => void;
  onConfirm: (exitPrice: number, closeNote: string) => void;
}

export default function CloseTradeModal({ position, onClose, onConfirm }: CloseTradeModalProps) {
  const [exitPrice, setExitPrice] = useState(position.currentPrice?.toString() ?? '');
  const [closeNote, setCloseNote] = useState('');

  const exit = parseFloat(exitPrice) || 0;
  const pnl = exit ? (exit - position.entryPrice) * position.quantity : 0;
  const pnlPct = exit ? ((exit - position.entryPrice) / position.entryPrice) * 100 : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!exit) return;
    onConfirm(exit, closeNote);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Close {position.ticker}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Position summary */}
          <div className="grid grid-cols-3 gap-3 text-xs bg-slate-800/50 rounded-lg p-3">
            <div>
              <p className="text-slate-500">Entry</p>
              <p className="text-slate-200 font-semibold tabular-nums">{formatCurrency(position.entryPrice)}</p>
            </div>
            <div>
              <p className="text-slate-500">Qty</p>
              <p className="text-slate-200 font-semibold">{position.quantity}</p>
            </div>
            <div>
              <p className="text-slate-500">Cost</p>
              <p className="text-slate-200 font-semibold tabular-nums">{formatCurrency(position.entryPrice * position.quantity)}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Exit Price *</label>
            <input
              type="number"
              step="0.01"
              value={exitPrice}
              onChange={e => setExitPrice(e.target.value)}
              autoFocus
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Live P&L preview */}
          {exit > 0 && (
            <div className={`rounded-lg p-3 ${pnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Realized P&L</span>
                <span className={`text-lg font-bold tabular-nums ${pnlColor(pnl)}`}>
                  {formatCurrency(pnl)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-400">Return</span>
                <span className={`text-sm font-semibold tabular-nums ${pnlColor(pnlPct)}`}>
                  {formatPercent(pnlPct)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1">Close Note</label>
            <textarea
              value={closeNote}
              onChange={e => setCloseNote(e.target.value)}
              rows={2}
              placeholder="Why closing? Hit target, stop loss, changed thesis..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                pnl >= 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              Close Position ({pnl >= 0 ? 'Profit' : 'Loss'})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
