import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Wallet,
  Activity,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { PositionWithMarket, Account } from '../types';
import { formatCurrency, formatPercent, pnlColor, pnlBg } from '../lib/utils';

interface DashboardProps {
  positions: PositionWithMarket[];
  accounts: Account[];
}

const THEME_COLORS: Record<string, string> = {
  'AI & Infra': '#60a5fa',
  'Energy & Resources': '#f59e0b',
  'Autonomy & Frontier': '#c084fc',
  'Socio-Econ': '#34d399',
  'Other': '#94a3b8',
};

const PIE_COLORS = ['#60a5fa', '#f59e0b', '#c084fc', '#34d399', '#94a3b8'];

export default function Dashboard({ positions, accounts }: DashboardProps) {
  const openPositions = positions.filter(p => p.status === 'open');

  // Summary calculations
  const totalInvested = openPositions.reduce((sum, p) => sum + p.entryPrice * p.quantity, 0);
  const totalMarketValue = openPositions.reduce((sum, p) => sum + (p.marketValue ?? p.entryPrice * p.quantity), 0);
  const totalPnl = totalMarketValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const totalCash = accounts.reduce((sum, a) => sum + a.cashBalance, 0);
  const dayChange = openPositions.reduce((sum, p) => {
    if (p.change !== null && p.quantity) return sum + p.change * p.quantity;
    return sum;
  }, 0);

  // Theme exposure data
  const themeMap = new Map<string, number>();
  for (const p of openPositions) {
    const val = p.marketValue ?? p.entryPrice * p.quantity;
    themeMap.set(p.theme, (themeMap.get(p.theme) ?? 0) + val);
  }
  const themeData = [...themeMap.entries()].map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: THEME_COLORS[name] ?? '#94a3b8',
  }));

  // Account breakdown data
  const accountMap = new Map<string, { invested: number; current: number; cash: number; type: string }>();
  for (const acc of accounts) {
    accountMap.set(acc.id, { invested: 0, current: 0, cash: acc.cashBalance, type: `${acc.name} (${acc.type})` });
  }
  for (const p of openPositions) {
    const entry = accountMap.get(p.accountId);
    if (entry) {
      entry.invested += p.entryPrice * p.quantity;
      entry.current += p.marketValue ?? p.entryPrice * p.quantity;
    }
  }
  const accountData = [...accountMap.entries()].map(([, v]) => ({
    name: v.type,
    invested: Math.round(v.invested),
    current: Math.round(v.current),
    cash: Math.round(v.cash),
  }));

  // Top movers
  const movers = [...openPositions]
    .filter(p => p.pnlPercent !== null)
    .sort((a, b) => Math.abs(b.pnlPercent ?? 0) - Math.abs(a.pnlPercent ?? 0))
    .slice(0, 5);

  const cards = [
    {
      label: 'Total Invested',
      value: formatCurrency(totalInvested),
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Market Value',
      value: formatCurrency(totalMarketValue),
      icon: BarChart3,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total P&L',
      value: `${formatCurrency(totalPnl)} (${formatPercent(totalPnlPercent)})`,
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
      color: totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400',
      bg: totalPnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Day Change',
      value: formatCurrency(dayChange),
      icon: Activity,
      color: dayChange >= 0 ? 'text-emerald-400' : 'text-red-400',
      bg: dayChange >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Cash Available',
      value: formatCurrency(totalCash),
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Open Positions',
      value: openPositions.length.toString(),
      icon: BarChart3,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(card => (
          <div
            key={card.label}
            className="rounded-xl bg-slate-900 border border-slate-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-sm font-semibold tabular-nums ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Theme Exposure */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">
            Exposure by Theme
          </h2>
          {themeData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={themeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {themeData.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {themeData.map(t => (
                  <div key={t.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-slate-300">{t.name}</span>
                    <span className="text-slate-500 ml-auto tabular-nums">
                      {formatCurrency(t.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No positions yet</p>
          )}
        </div>

        {/* Account Breakdown */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">
            Account Breakdown
          </h2>
          {accountData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={accountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="invested" name="Invested" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" name="Current" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cash" name="Cash" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">No accounts yet</p>
          )}
        </div>
      </div>

      {/* Asset Class Breakdown */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">
          Exposure by Asset Class
        </h2>
        {(() => {
          const classMap = new Map<string, number>();
          for (const p of openPositions) {
            const val = p.marketValue ?? p.entryPrice * p.quantity;
            const cls = p.assetClass ?? 'Equity';
            classMap.set(cls, (classMap.get(cls) ?? 0) + val);
          }
          const classColors: Record<string, string> = {
            'Equity': '#60a5fa', 'ETF': '#34d399', 'Option': '#c084fc',
            'Metals': '#fbbf24', 'Crypto': '#22d3ee', 'Other': '#94a3b8',
          };
          const classData = [...classMap.entries()].map(([name, value]) => ({
            name, value: Math.round(value), color: classColors[name] ?? '#94a3b8',
          }));
          if (classData.length === 0) return <p className="text-slate-500 text-sm">No positions yet</p>;
          const total = classData.reduce((s, d) => s + d.value, 0);
          return (
            <div className="space-y-2">
              {classData.map(d => (
                <div key={d.name} className="flex items-center gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 w-16">{d.name}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
                    />
                  </div>
                  <span className="text-slate-400 tabular-nums w-20 text-right">{formatCurrency(d.value)}</span>
                  <span className="text-slate-500 tabular-nums w-12 text-right">{((d.value / total) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Top Movers */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">
          Top Movers (by P&L %)
        </h2>
        {movers.length > 0 ? (
          <div className="grid sm:grid-cols-5 gap-3">
            {movers.map(p => (
              <div
                key={p.id}
                className={`rounded-lg p-3 ${pnlBg(p.pnlPercent ?? 0)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{p.ticker}</span>
                  {(p.pnlPercent ?? 0) >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                </div>
                <p className="text-lg font-bold tabular-nums">
                  {formatPercent(p.pnlPercent ?? 0)}
                </p>
                <p className="text-xs opacity-70 tabular-nums">
                  {formatCurrency(p.pnl ?? 0)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Add positions to see movers</p>
        )}
      </div>

      {/* Positions near stop loss */}
      {openPositions.filter(p => {
        if (!p.currentPrice || !p.stopLoss) return false;
        const distancePercent = ((p.currentPrice - p.stopLoss) / p.currentPrice) * 100;
        return distancePercent < 5 && distancePercent > 0;
      }).length > 0 && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
          <h2 className="text-sm font-semibold text-amber-400 mb-3">
            Near Stop Loss (within 5%)
          </h2>
          <div className="space-y-2">
            {openPositions
              .filter(p => {
                if (!p.currentPrice || !p.stopLoss) return false;
                const dist = ((p.currentPrice - p.stopLoss) / p.currentPrice) * 100;
                return dist < 5 && dist > 0;
              })
              .map(p => {
                const dist = p.currentPrice
                  ? ((p.currentPrice - p.stopLoss) / p.currentPrice) * 100
                  : 0;
                return (
                  <div key={p.id} className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-amber-300 w-16">{p.ticker}</span>
                    <span className="text-slate-300 tabular-nums">
                      Price: {formatCurrency(p.currentPrice ?? 0)}
                    </span>
                    <span className="text-slate-400 tabular-nums">
                      Stop: {formatCurrency(p.stopLoss)}
                    </span>
                    <span className="text-amber-400 tabular-nums">
                      {dist.toFixed(1)}% away
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
