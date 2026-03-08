import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Cathie Wood / ARK Invest — daily trade emails, most transparent fund manager
// Known for: disruptive innovation, genomics, AI, robotics, fintech, space

export const SEED_ARK_ALERTS: TrackerAlert[] = [
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'TSLA', description: 'Tesla — Robotaxi & AI thesis', date: '2026-03-05', sector: 'AI/Robotics' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'COIN', description: 'Coinbase — Crypto infrastructure', date: '2026-03-04', sector: 'Fintech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'NVDA', description: 'NVIDIA — Trimming into strength', closingPnl: '+120%', date: '2026-03-03', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'ROKU', description: 'Roku — Connected TV platform', date: '2026-03-01', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'PATH', description: 'UiPath — AI automation', date: '2026-02-28', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'CRSP', description: 'CRISPR Therapeutics — Gene editing', date: '2026-02-25', sector: 'Genomics' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'PLTR', description: 'Palantir — Taking profits', closingPnl: '+85%', date: '2026-02-22', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'RKLB', description: 'Rocket Lab — Space economy', date: '2026-02-20', sector: 'Space' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SQ', description: 'Block (Square) — Fintech + Bitcoin', date: '2026-02-18', sector: 'Fintech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'DKNG', description: 'DraftKings — Exiting position', closingPnl: '+22%', date: '2026-02-15', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'TWLO', description: 'Twilio — AI communications', date: '2026-02-12', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'ZM', description: 'Zoom — AI workplace pivot', date: '2026-02-08', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'BEAM', description: 'Beam Therapeutics — Base editing', date: '2026-02-05', sector: 'Genomics' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'TER', description: 'Teradyne — Robotics testing', date: '2026-01-30', sector: 'Robotics' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'U', description: 'Unity Software — Reducing position', closingPnl: '-15%', date: '2026-01-25', sector: 'Tech' },
];

export const SEED_ARK_HOLDINGS: TrackerHolding[] = [
  { id: generateId(), position: '3/3', ticker: 'TSLA', description: 'Tesla (top holding ~10%)', sector: 'AI/Robotics', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'COIN', description: 'Coinbase', sector: 'Fintech', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'ROKU', description: 'Roku', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'PATH', description: 'UiPath', sector: 'AI', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'SQ', description: 'Block (Square)', sector: 'Fintech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'RKLB', description: 'Rocket Lab', sector: 'Space', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'CRSP', description: 'CRISPR Therapeutics', sector: 'Genomics', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'BEAM', description: 'Beam Therapeutics', sector: 'Genomics', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'TWLO', description: 'Twilio', sector: 'AI', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'ZM', description: 'Zoom Video', sector: 'AI', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'TER', description: 'Teradyne', sector: 'Robotics', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'HOOD', description: 'Robinhood', sector: 'Fintech', timeframe: 'short' },
];

export const SEED_ARK_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'ARK Invest — March 2026 Monthly Update',
  keyThemes: [
    'Tesla remains #1 conviction: Robotaxi launch, FSD v13, $2T+ price target by 2030.',
    'ARKK up 45% YTD — innovation names rebounding hard after 2022-2024 drawdown.',
    'Genomics inflection: CRISPR-based therapies getting FDA approvals. CRSP + BEAM core positions.',
    'AI is deflationary — will create $200T in value over next decade. Software + AI = biggest opportunity.',
    'Bitcoin heading to $1M by 2030. Coinbase and Block are crypto infrastructure picks.',
    'Space economy: Rocket Lab winning government contracts. Space is the next trillion-dollar market.',
    'Trimming NVDA — hardware commoditizes, software captures value. Prefer PATH, TWLO.',
    'Autonomous logistics, drone delivery, robotic surgery — all converging in 2026-2028.',
    'ARKK 5-year CAGR target: 40%+. Short-term volatility is the price of long-term outperformance.',
  ],
  performance: {
    hc3m: '+18.5%',
    hc12m: '+45.2%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+52.3%',
    hedgeRealized12m: '-8.5%',
  },
  allocation: {
    'AI/Robotics': 28,
    'Fintech': 22,
    'Genomics': 18,
    'Tech': 12,
    'Space': 8,
    'Crypto': 7,
    'Robotics': 5,
  },
  notes: '',
};
