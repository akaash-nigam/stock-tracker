import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import type { Position, Account, Theme, PositionStatus, AssetClass, StrategyType, OptionType, UserName } from '../types';
import { generateId } from '../lib/utils';

interface AddPositionProps {
  accounts: Account[];
  onSave: (position: Position) => void;
  editPosition?: Position | null;
  currentUser?: UserName | null;
}

const THEMES: Theme[] = ['AI & Infra', 'Energy & Resources', 'Autonomy & Frontier', 'Socio-Econ', 'Other'];
const ASSET_CLASSES: AssetClass[] = ['Equity', 'ETF', 'Option', 'Metals', 'Crypto', 'Other'];
const STRATEGIES: StrategyType[] = ['Long Term', 'Short Term', 'Swing', 'Options', 'Trend Following', 'Other'];

export default function AddPosition({ accounts, onSave, editPosition, currentUser }: AddPositionProps) {
  const navigate = useNavigate();
  const isEdit = !!editPosition;

  const [ticker, setTicker] = useState(editPosition?.ticker ?? '');
  const [theme, setTheme] = useState<Theme>(editPosition?.theme ?? 'AI & Infra');
  const [assetClass, setAssetClass] = useState<AssetClass>(editPosition?.assetClass ?? 'Equity');
  const [specificTrend, setSpecificTrend] = useState(editPosition?.specificTrend ?? '');
  const [strategy, setStrategy] = useState<StrategyType>(editPosition?.strategy ?? 'Trend Following');
  const [entryPrice, setEntryPrice] = useState(editPosition?.entryPrice?.toString() ?? '');
  const [targetPrice, setTargetPrice] = useState(editPosition?.targetPrice?.toString() ?? '');
  const [stopLoss, setStopLoss] = useState(editPosition?.stopLoss?.toString() ?? '');
  const [quantity, setQuantity] = useState(editPosition?.quantity?.toString() ?? '');
  const [accountId, setAccountId] = useState(editPosition?.accountId ?? accounts[0]?.id ?? '');
  const [rationale, setRationale] = useState(editPosition?.rationale ?? '');
  const [mood, setMood] = useState(editPosition?.mood ?? '');
  const [status, setStatus] = useState<PositionStatus>(editPosition?.status ?? 'open');

  // Options fields
  const [optionType, setOptionType] = useState<OptionType>(editPosition?.optionType ?? 'Call');
  const [strikePrice, setStrikePrice] = useState(editPosition?.strikePrice?.toString() ?? '');
  const [expiryDate, setExpiryDate] = useState(editPosition?.expiryDate ?? '');
  const [premium, setPremium] = useState(editPosition?.premium?.toString() ?? '');
  const [contracts, setContracts] = useState(editPosition?.contracts?.toString() ?? '');

  const isOption = assetClass === 'Option';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticker || !entryPrice || (!isOption && !quantity) || (isOption && !contracts)) return;

    const position: Position = {
      id: editPosition?.id ?? generateId(),
      ticker: ticker.toUpperCase().trim(),
      theme,
      assetClass,
      specificTrend,
      strategy: isOption ? 'Options' : strategy,
      entryPrice: parseFloat(entryPrice),
      targetPrice: parseFloat(targetPrice) || 0,
      stopLoss: parseFloat(stopLoss) || 0,
      quantity: isOption ? (parseInt(contracts, 10) || 1) * 100 : parseInt(quantity, 10),
      accountId,
      rationale,
      mood,
      status,
      createdAt: editPosition?.createdAt ?? new Date().toISOString(),
      addedBy: editPosition?.addedBy ?? currentUser ?? undefined,
      ...(isOption && {
        optionType,
        strikePrice: parseFloat(strikePrice) || 0,
        expiryDate,
        premium: parseFloat(premium) || 0,
        contracts: parseInt(contracts, 10) || 1,
      }),
    };

    onSave(position);
    navigate('/positions');
  }

  const entry = parseFloat(entryPrice) || 0;
  const target = parseFloat(targetPrice) || 0;
  const stop = parseFloat(stopLoss) || 0;
  const qty = isOption ? (parseInt(contracts, 10) || 0) * 100 : parseInt(quantity, 10) || 0;
  const prem = parseFloat(premium) || 0;

  const riskReward = entry && target && stop && (entry - stop) > 0
    ? ((target - entry) / (entry - stop)).toFixed(2)
    : '--';
  const totalCapital = isOption
    ? (prem && parseInt(contracts, 10) ? (prem * parseInt(contracts, 10) * 100).toFixed(2) : '--')
    : (entry && qty ? (entry * qty).toFixed(2) : '--');
  const maxRisk = isOption
    ? totalCapital
    : (entry && stop && qty ? ((entry - stop) * qty).toFixed(2) : '--');

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-100">
          {isEdit ? 'Edit Position' : 'Add New Position'}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Position Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ticker *</label>
              <input type="text" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="AAPL" required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Asset Class</label>
              <select value={assetClass} onChange={e => setAssetClass(e.target.value as AssetClass)} className={inputClass}>
                {ASSET_CLASSES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value as Theme)} className={inputClass}>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Strategy</label>
              <select value={isOption ? 'Options' : strategy} onChange={e => setStrategy(e.target.value as StrategyType)} disabled={isOption} className={`${inputClass} ${isOption ? 'opacity-50' : ''}`}>
                {STRATEGIES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Specific Trend</label>
              <input type="text" value={specificTrend} onChange={e => setSpecificTrend(e.target.value)} placeholder="e.g. Data Center Cooling" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Account</label>
              <select value={accountId} onChange={e => setAccountId(e.target.value)} className={inputClass}>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as PositionStatus)} className={inputClass}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options-specific fields */}
        {isOption && (
          <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-purple-300">Options Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Type</label>
                <select value={optionType} onChange={e => setOptionType(e.target.value as OptionType)} className={inputClass}>
                  <option value="Call">Call</option>
                  <option value="Put">Put</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Strike Price *</label>
                <input type="number" step="0.01" value={strikePrice} onChange={e => setStrikePrice(e.target.value)} className={`${inputClass} tabular-nums`} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Expiry Date *</label>
                <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Premium (per share) *</label>
                <input type="number" step="0.01" value={premium} onChange={e => setPremium(e.target.value)} className={`${inputClass} tabular-nums`} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contracts *</label>
                <input type="number" value={contracts} onChange={e => setContracts(e.target.value)} placeholder="1 contract = 100 shares" className={`${inputClass} tabular-nums`} />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{isOption ? 'Underlying Price' : 'Entry Price *'}</label>
              <input type="number" step="0.01" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} required className={`${inputClass} tabular-nums`} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Target Price</label>
              <input type="number" step="0.01" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} className={`${inputClass} tabular-nums`} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Stop Loss</label>
              <input type="number" step="0.01" value={stopLoss} onChange={e => setStopLoss(e.target.value)} className={`${inputClass} tabular-nums`} />
            </div>
            {!isOption && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Quantity *</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required className={`${inputClass} tabular-nums`} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-500">Risk/Reward</p>
              <p className="text-sm font-semibold text-slate-200 tabular-nums">{riskReward}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Capital</p>
              <p className="text-sm font-semibold text-slate-200 tabular-nums">${totalCapital}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Max Risk</p>
              <p className="text-sm font-semibold text-amber-400 tabular-nums">${maxRisk}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Journal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Mood</label>
              <input type="text" value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. Calm, Excited, Fearful" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Rationale (Why buy/sell?)</label>
              <textarea value={rationale} onChange={e => setRationale(e.target.value)} rows={3} placeholder="Why are you entering this trade?" className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Position' : 'Add Position'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 text-sm font-semibold transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
