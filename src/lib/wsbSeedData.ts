import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// WallStreetBets Sentiment Tracker — Reddit r/wallstreetbets
// Meme stocks, YOLO plays, short squeezes, degenerate options
// Track the sentiment, ride or inverse the momentum

export const SEED_WSB_ALERTS: TrackerAlert[] = [
  { id: generateId(), action: 'Buy', size: 'All', ticker: 'GME', description: 'GameStop — DFV tweet, squeeze potential', date: '2026-03-05', sector: 'Meme' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'AMC', description: 'AMC — "Apes together strong" rally', date: '2026-03-03', sector: 'Meme' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'BBBY', description: 'Bed Bath successor — meme revival', date: '2026-03-01', sector: 'Meme' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NVDA', description: 'NVIDIA — "literally free money" consensus', date: '2026-02-27', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: 'All', ticker: 'TSLA', description: 'Tesla — Elon tweeted, 0DTE calls', date: '2026-02-25', sector: 'EV' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'PLTR', description: 'Palantir — "I paperhanded at +200%"', closingPnl: '+200%', date: '2026-02-22', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SMCI', description: 'Super Micro — WSB AI darling', date: '2026-02-18', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: 'All', ticker: 'MSTR', description: 'MicroStrategy — leveraged BTC bet', date: '2026-02-15', sector: 'Crypto' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'RIVN', description: 'Rivian — "loss porn, sold at -65%"', closingPnl: '-65%', date: '2026-02-10', sector: 'EV' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'SOFI', description: 'SoFi — "next fintech squeeze"', date: '2026-02-05', sector: 'Fintech' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'HOOD', description: 'Robinhood — ironic, buying the broker', date: '2026-01-30', sector: 'Fintech' },
  { id: generateId(), action: 'Buy', size: 'All', ticker: 'SPY', description: 'SPY 0DTE puts — "recession tomorrow"', date: '2026-01-25', sector: 'Index' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'IONQ', description: 'IonQ — quantum computing YOLO', date: '2026-01-20', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'COIN', description: 'Coinbase — sold the top (for once)', closingPnl: '+85%', date: '2026-01-15', sector: 'Crypto' },
  { id: generateId(), action: 'Buy', size: 'All', ticker: 'RDDT', description: 'Reddit — WSB buying its own platform', date: '2026-01-10', sector: 'Tech' },
];

export const SEED_WSB_HOLDINGS: TrackerHolding[] = [
  // "Diamond hands" positions (meme conviction)
  { id: generateId(), position: '3/3', ticker: 'GME', description: 'GameStop (forever hold)', sector: 'Meme', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'AMC', description: 'AMC Entertainment', sector: 'Meme', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'RDDT', description: 'Reddit', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'MSTR', description: 'MicroStrategy', sector: 'Crypto', timeframe: 'long' },
  // Current momentum plays (short-term YOLO)
  { id: generateId(), position: '1/3', ticker: 'NVDA', description: 'NVIDIA (consensus long)', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'TSLA', description: 'Tesla (Elon cult)', sector: 'EV', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'SMCI', description: 'Super Micro Computer', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'SOFI', description: 'SoFi Technologies', sector: 'Fintech', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'IONQ', description: 'IonQ (quantum meme)', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'HOOD', description: 'Robinhood', sector: 'Fintech', timeframe: 'short' },
];

export const SEED_WSB_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'WSB Sentiment — March 2026 Ape Report',
  keyThemes: [
    'GME is eternal. DFV (Roaring Kitty) tweeted again — sub went nuclear. Short interest back to 25%.',
    'NVDA is the one stock WSB and institutions agree on. "Even my wife\'s boyfriend owns NVDA."',
    '0DTE options volume at all-time highs. SPY 0DTE is now 50%+ of all options volume.',
    'Tesla cult remains strong. Every Elon tweet = 500 new YOLO posts. 0DTE calls printing.',
    'Loss porn is at record levels. One user lost $420K on RIVN puts. "At least I have the karma."',
    'Quantum computing is the new meme sector: IONQ, RGTI, QUBT. "It either works or it doesn\'t = 50/50."',
    'MSTR is WSB\'s leveraged Bitcoin play. "Why buy BTC when you can buy 2x BTC with Saylor?"',
    'Reddit IPO: WSB buying shares of the platform that hosts their loss porn. Peak meta.',
    'Inverse WSB strategy still works: top 10 most-mentioned tickers underperform by 15% over 6 months.',
    'Key WSB indicator: when "recession" mentions spike, market bottoms within 2 weeks.',
    'Sir, this is a Wendy\'s. But the Wendy\'s has a Bloomberg terminal now.',
  ],
  performance: {
    hc3m: '-8.5%',
    hc12m: '+5.2%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+42.0%',
    hedgeRealized12m: '-55.0%',
  },
  allocation: {
    'Meme': 30,
    'Tech': 25,
    'EV': 12,
    'Crypto': 12,
    'Fintech': 10,
    'Index': 6,
    'Quantum': 5,
  },
  notes: '',
};
