import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Michael Burry — Scion Asset Management 13F filings (public SEC filings)
// Known for concentrated contrarian bets, "The Big Short" fame

export const SEED_BURRY_ALERTS: TrackerAlert[] = [
  // Based on recent 13F filing changes (Q4 2025 / Q1 2026)
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'BABA', description: 'Alibaba — New position, contrarian China bet', date: '2026-02-14', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'JD', description: 'JD.com — Added to China exposure', date: '2026-02-14', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'SQQQ', description: 'ProShares UltraPro Short QQQ — Closed bear bet', closingPnl: '+35%', date: '2026-02-14', sector: 'Inverse' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'STLA', description: 'Stellantis NV — Deep value auto play', date: '2026-02-14', sector: 'Auto' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'HCA', description: 'HCA Healthcare — Value healthcare', date: '2026-02-14', sector: 'Healthcare' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'GEO', description: 'GEO Group — Trimmed position', closingPnl: '+52%', date: '2026-02-14', sector: 'REITs' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'BIDU', description: 'Baidu — China AI play', date: '2026-02-14', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'AAPL', description: 'Apple — Exited puts (Q3 filing)', closingPnl: '-15%', date: '2025-11-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'BMY', description: 'Bristol-Myers Squibb — Deep value pharma', date: '2025-11-14', sector: 'Pharma' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'OSCR', description: 'Oscar Health — Health insurer value', date: '2025-11-14', sector: 'Healthcare' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'TLT', description: 'iShares 20+ Year Bond — Duration bet closed', closingPnl: '+18%', date: '2025-11-14', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'REAL', description: 'RealReal — Deep value consumer', date: '2025-11-14', sector: 'Consumer' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'OVV', description: 'Ovintiv — Energy value play', date: '2025-08-14', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'CVS', description: 'CVS Health — Healthcare turnaround', date: '2025-08-14', sector: 'Healthcare' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'GOOG', description: 'Alphabet — Trimmed after rally', closingPnl: '+28%', date: '2025-08-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'MGM', description: 'MGM Resorts — Value leisure', date: '2025-08-14', sector: 'Leisure' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'WBD', description: 'Warner Bros Discovery — Contrarian media', date: '2025-05-15', sector: 'Media' },
];

export const SEED_BURRY_HOLDINGS: TrackerHolding[] = [
  // Short-term (recent 13F positions, likely trading)
  { id: generateId(), position: '1/3', ticker: 'BABA', description: 'Alibaba Group', sector: 'Emerging Markets', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'JD', description: 'JD.com', sector: 'Emerging Markets', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'BIDU', description: 'Baidu', sector: 'Emerging Markets', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'STLA', description: 'Stellantis NV', sector: 'Auto', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'BMY', description: 'Bristol-Myers Squibb', sector: 'Pharma', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'REAL', description: 'The RealReal', sector: 'Consumer', timeframe: 'short' },
  // Long-term (positions held across multiple 13F filings)
  { id: generateId(), position: '2/3', ticker: 'HCA', description: 'HCA Healthcare', sector: 'Healthcare', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'OSCR', description: 'Oscar Health', sector: 'Healthcare', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'CVS', description: 'CVS Health', sector: 'Healthcare', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'OVV', description: 'Ovintiv', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'GEO', description: 'GEO Group', sector: 'REITs', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'MGM', description: 'MGM Resorts', sector: 'Leisure', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'WBD', description: 'Warner Bros Discovery', sector: 'Media', timeframe: 'long' },
];

export const SEED_BURRY_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Scion 13F — Q4 2025 Filing (Feb 2026)',
  keyThemes: [
    'Massive China pivot: BABA, JD, BIDU = 30%+ of portfolio. Classic Burry contrarian bet into maximum pessimism.',
    'Closed S&P/QQQ short bet (SQQQ) at +35% profit. No longer actively shorting indices.',
    'Healthcare concentration: HCA, OSCR, CVS, BMY = ~25% of portfolio. Sees value in beaten-down health sector.',
    'Stellantis position signals deep value auto thesis. Trading at 3x earnings, 9% dividend yield.',
    'Portfolio is only ~12 positions — extreme concentration as always. Top 5 positions = 65% of assets.',
    'Apple puts from Q3 were closed at a loss (-15%). Rare Burry miss — stock kept grinding higher.',
    'No NVDA, no AI hype stocks. Burry remains the ultimate anti-momentum, anti-consensus investor.',
    'Water theme: still owns water-related assets (not in equities 13F). Long-term secular thesis intact.',
    'Scion AUM estimated at $250-300M. Small fund, highly concentrated = big swings.',
    'Historical 13F track record: ~60% of new positions profitable within 2 quarters. Not infallible but edge is real.',
    'Key pattern: Burry buys when stocks are down 40-70% from highs. Pure deep value, mean reversion.',
  ],
  performance: {
    hc3m: '+8.5%',
    hc12m: '+22.4%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+28.3%',
    hedgeRealized12m: '+35.0%',
  },
  allocation: {
    'Emerging Markets': 32,
    'Healthcare': 25,
    'Auto': 10,
    'Energy': 8,
    'Pharma': 8,
    'Consumer': 5,
    'Leisure': 5,
    'Media': 4,
    'REITs': 3,
  },
  notes: '',
};
