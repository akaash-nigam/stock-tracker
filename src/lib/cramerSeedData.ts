import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Inverse Cramer — do the opposite of what Jim Cramer recommends on Mad Money
// These are based on famous Cramer calls and their inverse trades

export const SEED_CRAMER_ALERTS: TrackerAlert[] = [
  // Cramer said BUY → We SELL (inverse)
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'COIN', description: 'Coinbase (Cramer was bullish pre-crash)', closingPnl: '+45%', date: '2026-02-28', sector: 'Crypto' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'HOOD', description: 'Robinhood (Cramer pumped at IPO)', closingPnl: '+62%', date: '2026-02-25', sector: 'Fintech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'SNAP', description: 'Snap Inc (Cramer said "great quarter")', closingPnl: '+38%', date: '2026-02-20', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'NFLX', description: 'Netflix (Cramer "stay long" at $700)', closingPnl: '+22%', date: '2026-02-15', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'RIVN', description: 'Rivian (Cramer said "buy the dip")', closingPnl: '+71%', date: '2026-02-10', sector: 'EV' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'SOFI', description: 'SoFi Technologies (Cramer top pick)', closingPnl: '+28%', date: '2026-01-30', sector: 'Fintech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'PLTR', description: 'Palantir (Cramer "too expensive"... then pumped)', closingPnl: '-12%', date: '2026-01-25', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'BYND', description: 'Beyond Meat (Cramer bullish call)', closingPnl: '+85%', date: '2026-01-20', sector: 'Consumer' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'LCID', description: 'Lucid Group (Cramer said "own it")', closingPnl: '+55%', date: '2026-01-15', sector: 'EV' },
  // Cramer said SELL → We BUY (inverse)
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NVDA', description: 'NVIDIA (Cramer said "sell some" at $130)', date: '2026-02-27', sector: 'Semis' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'META', description: 'Meta (Cramer bearish during metaverse pivot)', date: '2026-02-22', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'AAPL', description: 'Apple (Cramer said "take profits")', date: '2026-02-18', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'TSLA', description: 'Tesla (Cramer flip-flopped bearish)', date: '2026-02-12', sector: 'EV' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'AMD', description: 'AMD (Cramer said "NVDA only")', date: '2026-02-05', sector: 'Semis' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'AMZN', description: 'Amazon (Cramer bearish on cloud spend)', date: '2026-01-28', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GOOGL', description: 'Alphabet (Cramer "sell before earnings")', date: '2026-01-22', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'BABA', description: 'Alibaba (Cramer "stay away from China")', date: '2026-01-18', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SMCI', description: 'Super Micro (Cramer said "too risky")', date: '2026-01-10', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'MSTR', description: 'MicroStrategy (Cramer "Bitcoin is dead")', date: '2025-12-20', sector: 'Crypto' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GLD', description: 'Gold ETF (Cramer "gold is a pet rock")', date: '2025-12-15', sector: 'Commodities' },
];

export const SEED_CRAMER_HOLDINGS: TrackerHolding[] = [
  // Short-Term inverse plays
  { id: generateId(), position: '1/3', ticker: 'NVDA', description: 'NVIDIA (inverse sell call)', sector: 'Semis', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'META', description: 'Meta Platforms', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'TSLA', description: 'Tesla (inverse bearish flip)', sector: 'EV', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'AMD', description: 'AMD (inverse NVDA-only call)', sector: 'Semis', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'SMCI', description: 'Super Micro Computer', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'MSTR', description: 'MicroStrategy (inverse BTC bear)', sector: 'Crypto', timeframe: 'short' },
  // Long-Term inverse thesis
  { id: generateId(), position: '1/3', ticker: 'BABA', description: 'Alibaba (inverse China fear)', sector: 'Emerging Markets', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'GLD', description: 'Gold ETF (inverse "pet rock")', sector: 'Commodities', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'SLV', description: 'Silver ETF', sector: 'Commodities', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'GOOGL', description: 'Alphabet (inverse sell call)', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'AMZN', description: 'Amazon (inverse cloud bear)', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'KWEB', description: 'China Internet ETF', sector: 'Emerging Markets', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'IBIT', description: 'iShares Bitcoin Trust', sector: 'Crypto', timeframe: 'long' },
];

export const SEED_CRAMER_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Inverse Cramer — March 2026 Update',
  keyThemes: [
    'CNBC Cramer Index (inverse) up 31% over 12 months vs S&P 15%. Meme strategy continues to work.',
    'Cramer turned bullish on COIN at $280 — classic top signal. We shorted inverse.',
    'His "sell gold" call from 2025 was peak contrarian — GLD up 40% since.',
    'Cramer flip-flopping on Tesla again — bullish signal for inverse longs.',
    'Mad Money Lightning Round: 80% of his "buy buy buy" calls underperform within 3 months.',
    'Cramer CNBC Trust portfolio lagging S&P by 8% YTD. Charitable trust indeed.',
    'His China "stay away" thesis from 2025 was a generational buy signal for BABA/KWEB.',
    'Key rule: when Cramer pounds the table, inverse within 48 hours for best entry.',
    'Cramer bearish on Bitcoin AGAIN — adding to IBIT/MSTR inverse position.',
    'Notable: even broken clocks are right twice — his NVDA call in 2023 was correct.',
  ],
  performance: {
    hc3m: '+12.8%',
    hc12m: '+31.2%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+42.5%',
    hedgeRealized12m: '-8.3%',
  },
  allocation: {
    'Tech': 30,
    'Semis': 20,
    'Crypto': 15,
    'Emerging Markets': 15,
    'Commodities': 10,
    'EV': 5,
    'Fintech': 5,
  },
  notes: '',
};
