import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Warren Buffett — Berkshire Hathaway 13F filings (public SEC filings)
// Known for: value investing, moats, long-term compounding, "be greedy when others are fearful"

export const SEED_BUFFETT_ALERTS: TrackerAlert[] = [
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'AAPL', description: 'Apple — Trimmed massive position (tax reasons)', closingPnl: '+800%', date: '2026-02-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'OXY', description: 'Occidental Petroleum — Adding more', date: '2026-02-14', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'CB', description: 'Chubb — Insurance value play', date: '2026-02-14', sector: 'Insurance' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'CVX', description: 'Chevron — Reduced position', closingPnl: '+35%', date: '2026-02-14', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'SIRI', description: 'Sirius XM — Deep value media', date: '2026-02-14', sector: 'Media' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'HPQ', description: 'HP Inc — Trimming', closingPnl: '+15%', date: '2025-11-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'KO', description: 'Coca-Cola — Eternal holding, dividend reinvest', date: '2025-11-14', sector: 'Consumer' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'MCO', description: 'Moodys — Ratings monopoly', date: '2025-11-14', sector: 'Financials' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'GM', description: 'General Motors — Exiting auto', closingPnl: '+8%', date: '2025-08-14', sector: 'Auto' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'BAC', description: 'Bank of America — Banking franchise', date: '2025-08-14', sector: 'Banking' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'AXP', description: 'American Express — Premium consumer', date: '2025-08-14', sector: 'Financials' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'DVA', description: 'DaVita — Healthcare services', date: '2025-05-15', sector: 'Healthcare' },
];

export const SEED_BUFFETT_HOLDINGS: TrackerHolding[] = [
  // Core long-term positions (decades-long holds)
  { id: generateId(), position: '3/3', ticker: 'AAPL', description: 'Apple (~40% of portfolio)', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '3/3', ticker: 'BAC', description: 'Bank of America', sector: 'Banking', timeframe: 'long' },
  { id: generateId(), position: '3/3', ticker: 'AXP', description: 'American Express', sector: 'Financials', timeframe: 'long' },
  { id: generateId(), position: '3/3', ticker: 'KO', description: 'Coca-Cola (since 1988)', sector: 'Consumer', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'OXY', description: 'Occidental Petroleum', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'CVX', description: 'Chevron', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'MCO', description: 'Moodys Corp', sector: 'Financials', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'KHC', description: 'Kraft Heinz', sector: 'Consumer', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'DVA', description: 'DaVita', sector: 'Healthcare', timeframe: 'long' },
  // Shorter-term / newer positions
  { id: generateId(), position: '1/3', ticker: 'CB', description: 'Chubb Ltd', sector: 'Insurance', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'SIRI', description: 'Sirius XM', sector: 'Media', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'HPQ', description: 'HP Inc', sector: 'Tech', timeframe: 'short' },
];

export const SEED_BUFFETT_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Berkshire Hathaway — Q4 2025 13F Review',
  keyThemes: [
    'Apple trimming continues — sold another $20B in 2025. Still #1 position at ~40% of equity portfolio.',
    'Cash pile at record $325B. Buffett sees nothing worth buying at current valuations.',
    'OXY accumulation: now at 28% ownership. Approaching regulatory threshold for full acquisition.',
    'Chubb is the new mystery position — insurance company with global diversification.',
    'Berkshire operating earnings up 25% YoY — insurance float + BNSF + energy utilities.',
    'No tech buys beyond Apple. Buffett still uncomfortable with AI/innovation names.',
    'Japanese trading houses (Itochu, Mitsubishi, etc.) — non-13F but disclosed. Playing Japan value.',
    '"Be fearful when others are greedy" — massive cash position signals Buffett expects a correction.',
    'Succession: Greg Abel ready. Investment portfolio will be managed by Ted + Todd.',
    'BRK.B outperforming S&P over 3, 5, 10, and 20 year periods. Compounding machine.',
  ],
  performance: {
    hc3m: '+5.2%',
    hc12m: '+18.9%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+142.0%',
    hedgeRealized12m: '+25.0%',
  },
  allocation: {
    'Tech': 42,
    'Banking': 15,
    'Financials': 12,
    'Energy': 11,
    'Consumer': 8,
    'Insurance': 5,
    'Healthcare': 4,
    'Media': 3,
  },
  notes: '',
};
