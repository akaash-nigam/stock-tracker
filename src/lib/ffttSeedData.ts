import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Luke Gromen / FFTT — Forest for the Trees
// Known for: fiscal dominance thesis, USD debasement, gold/oil/BTC framework,
// sovereign debt crisis, energy as monetary asset

export const SEED_FFTT_ALERTS: TrackerAlert[] = [
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GLD', description: 'Gold ETF — Fiscal dominance = gold breakout', date: '2026-03-01', sector: 'Precious Metals' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'IBIT', description: 'Bitcoin ETF — Digital gold thesis', date: '2026-02-28', sector: 'Crypto' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'XLE', description: 'Energy SPDR — Energy as monetary asset', date: '2026-02-22', sector: 'Energy' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'TLT', description: 'Long bonds — Fiscal spiral makes long duration toxic', closingPnl: '+14%', date: '2026-02-18', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GDX', description: 'Gold Miners ETF — Leveraged gold play', date: '2026-02-15', sector: 'Precious Metals' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'OXY', description: 'Occidental Petroleum — Energy sovereignty', date: '2026-02-10', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'BTC-USD', description: 'Bitcoin spot — Sovereign debt hedge', date: '2026-02-05', sector: 'Crypto' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'UUP', description: 'Dollar Bull Fund — USD losing reserve status slowly', closingPnl: '+5%', date: '2026-01-30', sector: 'FX' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SLV', description: 'Silver ETF — Monetary + industrial demand', date: '2026-01-25', sector: 'Precious Metals' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'URA', description: 'Uranium ETF — Energy security imperative', date: '2026-01-20', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'COPX', description: 'Copper Miners — Electrification + constrained supply', date: '2026-01-15', sector: 'Commodities' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'IEF', description: '7-10yr Treasuries — Yield curve steepening bet', closingPnl: '+7%', date: '2026-01-10', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'FCG', description: 'Natural Gas ETF — LNG export buildout', date: '2025-12-15', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'EWZ', description: 'Brazil ETF — EM commodity exposure', date: '2025-12-05', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'GDXJ', description: 'Junior Gold Miners — Max leverage to gold', date: '2025-11-20', sector: 'Precious Metals' },
];

export const SEED_FFTT_HOLDINGS: TrackerHolding[] = [
  // Short-term (tactical macro trades)
  { id: generateId(), position: '1/3', ticker: 'GDX', description: 'Gold Miners ETF', sector: 'Precious Metals', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'SLV', description: 'Silver ETF', sector: 'Precious Metals', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'GDXJ', description: 'Junior Gold Miners', sector: 'Precious Metals', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'FCG', description: 'Natural Gas ETF', sector: 'Energy', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'EWZ', description: 'Brazil ETF', sector: 'Emerging Markets', timeframe: 'short' },
  // Long-term (core FFTT thesis positions)
  { id: generateId(), position: '3/3', ticker: 'GLD', description: 'Gold ETF (core thesis)', sector: 'Precious Metals', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'IBIT', description: 'Bitcoin ETF (digital gold)', sector: 'Crypto', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'XLE', description: 'Energy Select SPDR', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'OXY', description: 'Occidental Petroleum', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'URA', description: 'Uranium ETF', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'COPX', description: 'Copper Miners ETF', sector: 'Commodities', timeframe: 'long' },
];

export const SEED_FFTT_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'FFTT — Forest for the Trees, March 2026',
  keyThemes: [
    'THE thesis: US fiscal deficit is now structurally unfundable without Fed monetization. This is fiscal dominance.',
    'Gold/Oil ratio is THE chart to watch. When gold outperforms oil, the sovereign debt market is screaming.',
    'US interest expense now exceeds defense spending. Government MUST inflate or default. They will inflate.',
    'Bitcoin is the "call option on the sovereign debt crisis." Asymmetric payoff if FFTT thesis plays out.',
    'Energy is not just a commodity — it is a monetary asset in a world of fiscal dominance.',
    'Dollar losing reserve status: BRICS+ settlements bypassing SWIFT. Not overnight, but the trend is clear.',
    'Gold breaking all-time highs: central banks bought 1,100t in 2025. They see what retail doesn\'t.',
    'Yield curve steepening is the canary. Long bonds are toxic when governments print to fund deficits.',
    'Copper is the new oil: electrification, AI data centers, EVs all need copper. Supply deficit widening.',
    'Nuclear renaissance: energy security > climate policy. Uranium demand outstripping mine supply by 2x.',
    'Framework: own things that governments cannot print (gold, BTC, energy, commodities). Avoid long-duration fixed income.',
    'The endgame: US either restructures entitlements (politically impossible) or debases currency (historically certain).',
  ],
  performance: {
    hc3m: '+13.7%',
    hc12m: '+34.5%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+21.8%',
    hedgeRealized12m: '+14.0%',
  },
  allocation: {
    'Precious Metals': 35,
    'Energy': 25,
    'Crypto': 15,
    'Commodities': 10,
    'Emerging Markets': 8,
    'FX': 4,
    'Fixed Income': 3,
  },
  notes: '',
};
