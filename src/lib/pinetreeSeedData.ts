import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// PineTree Macro — Ritesh Jain's global macro research
// Known for: global macro calls, India market insights, commodity cycles,
// central bank analysis, credit/liquidity frameworks

export const SEED_PINETREE_ALERTS: TrackerAlert[] = [
  // Recent macro-driven trade calls
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GLD', description: 'Gold ETF — Central bank buying accelerating', date: '2026-03-01', sector: 'Precious Metals' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SLV', description: 'Silver ETF — Industrial + monetary demand convergence', date: '2026-02-28', sector: 'Precious Metals' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'TLT', description: 'Long bonds — Fiscal dominance, sell the rally', closingPnl: '+12%', date: '2026-02-25', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'INDA', description: 'iShares MSCI India — Structural growth story', date: '2026-02-20', sector: 'India' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'DBA', description: 'Agriculture ETF — Food inflation cycle', date: '2026-02-18', sector: 'Commodities' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'UUP', description: 'US Dollar Bull Fund — Dollar smile fading', closingPnl: '+8%', date: '2026-02-15', sector: 'FX' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'EWZ', description: 'Brazil ETF — EM value + commodities', date: '2026-02-12', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'FCG', description: 'Natural Gas ETF — Energy security thesis', date: '2026-02-08', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'COPX', description: 'Copper Miners ETF — Electrification supercycle', date: '2026-02-05', sector: 'Commodities' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'IEF', description: '7-10 Year Treasury — Yield curve steepening bet', closingPnl: '+6%', date: '2026-01-30', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'EPI', description: 'WisdomTree India Earnings — India capex boom', date: '2026-01-25', sector: 'India' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'URA', description: 'Uranium ETF — Nuclear renaissance thesis', date: '2026-01-20', sector: 'Energy' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'FXI', description: 'China Large Cap — Deflation trap risk', closingPnl: '-5%', date: '2026-01-15', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'XLE', description: 'Energy Select SPDR — Undervalued vs commodities', date: '2026-01-10', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'GDXJ', description: 'Junior Gold Miners — Leverage to gold breakout', date: '2025-12-20', sector: 'Precious Metals' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'EWJ', description: 'Japan ETF — BOJ yield curve control exit', date: '2025-12-15', sector: 'Developed Markets' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'SPY', description: 'S&P 500 — Overvalued on CAPE, trim exposure', closingPnl: '+3%', date: '2025-12-10', sector: 'US Equity' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'VALE', description: 'Vale SA — Iron ore + nickel + Brazil macro', date: '2025-12-05', sector: 'Commodities' },
];

export const SEED_PINETREE_HOLDINGS: TrackerHolding[] = [
  // Short-term (tactical macro trades)
  { id: generateId(), position: '1/3', ticker: 'GLD', description: 'Gold ETF (CB buying)', sector: 'Precious Metals', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'SLV', description: 'Silver ETF', sector: 'Precious Metals', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'DBA', description: 'Agriculture ETF', sector: 'Commodities', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'FCG', description: 'Natural Gas ETF', sector: 'Energy', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'EWZ', description: 'Brazil ETF', sector: 'Emerging Markets', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'EWJ', description: 'Japan ETF', sector: 'Developed Markets', timeframe: 'short' },
  // Long-term (structural macro positions)
  { id: generateId(), position: '2/3', ticker: 'INDA', description: 'iShares MSCI India', sector: 'India', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'EPI', description: 'WisdomTree India Earnings', sector: 'India', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'COPX', description: 'Copper Miners ETF', sector: 'Commodities', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'URA', description: 'Uranium ETF', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'GDXJ', description: 'Junior Gold Miners', sector: 'Precious Metals', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'XLE', description: 'Energy Select SPDR', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'VALE', description: 'Vale SA', sector: 'Commodities', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'FCX', description: 'Freeport-McMoRan (copper)', sector: 'Commodities', timeframe: 'long' },
];

export const SEED_PINETREE_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'PineTree Macro — March 2026 Global Update',
  keyThemes: [
    'Fiscal dominance is THE macro theme for 2026. Governments cannot afford higher rates — financial repression ahead.',
    'Gold breaking $2,400 — central banks bought 1,100 tonnes in 2025. De-dollarization is not a meme, it is a trend.',
    'India capex cycle is real: infrastructure spend +30% YoY, manufacturing PLI schemes attracting global supply chains.',
    'Commodity supercycle intact: copper deficit widening (electrification + AI data centers), uranium demand outstripping supply.',
    'US fiscal deficit at 7% of GDP in expansion — historically unprecedented. Bond vigilantes will eventually wake up.',
    'China deflation trap: PPI negative for 18 months, property sector restructuring far from over. Avoid FXI.',
    'Japan BOJ policy normalization — yield curve control exit creates global rates volatility. Long JGB shorts.',
    'India vs China: capital flows rotating from China to India. INDA/EPI outperforming FXI by 40% over 12 months.',
    'Agricultural commodities bottoming: El Niño impact, geopolitical disruptions (Black Sea, Red Sea shipping).',
    'Silver industrial demand (solar panels + EVs) + monetary demand = most undervalued precious metal.',
    'EM currencies: Brazil real and Indian rupee best positioned. Avoid Turkish lira, Argentine peso.',
    'Energy security > energy transition: nuclear renaissance, natural gas as bridge fuel, LNG infrastructure buildout.',
    'Global debt-to-GDP at 336% — any meaningful rate hikes will break something. Stay long real assets.',
  ],
  performance: {
    hc3m: '+11.3%',
    hc12m: '+26.8%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+18.7%',
    hedgeRealized12m: '+14.2%',
  },
  allocation: {
    'Precious Metals': 25,
    'India': 20,
    'Energy': 18,
    'Commodities': 15,
    'Emerging Markets': 10,
    'Developed Markets': 7,
    'Fixed Income': 3,
    'FX': 2,
  },
  notes: '',
};
