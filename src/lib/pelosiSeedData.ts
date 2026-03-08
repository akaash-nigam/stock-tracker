import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Nancy Pelosi congressional trade disclosures — based on publicly available
// periodic transaction reports filed with the House of Representatives

export const SEED_PELOSI_ALERTS: TrackerAlert[] = [
  // Recent disclosed trades (public record from House filings)
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NVDA', description: 'NVIDIA — Call options $120 strike', price: 120, date: '2026-02-20', sector: 'Semis' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'AAPL', description: 'Apple Inc — Shares ($250K-$500K)', date: '2026-02-15', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GOOGL', description: 'Alphabet — Call options $180 strike', date: '2026-02-10', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'RBLX', description: 'Roblox — Exercised calls, sold shares', closingPnl: '+85%', date: '2026-02-05', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'MSFT', description: 'Microsoft — Call options $420 strike', date: '2026-01-28', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'CRM', description: 'Salesforce — Shares ($100K-$250K)', date: '2026-01-22', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'DIS', description: 'Walt Disney — Sold all shares', closingPnl: '+32%', date: '2026-01-15', sector: 'Media' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'PANW', description: 'Palo Alto Networks — Call options', date: '2026-01-10', sector: 'Cybersecurity' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'TSM', description: 'TSMC — Shares ($250K-$500K)', date: '2025-12-20', sector: 'Semis' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'AVGO', description: 'Broadcom — Call options $220 strike', date: '2025-12-15', sector: 'Semis' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'TSLA', description: 'Tesla — Sold shares ($500K-$1M)', closingPnl: '+18%', date: '2025-12-10', sector: 'EV' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'AMZN', description: 'Amazon — Shares ($250K-$500K)', date: '2025-12-01', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'V', description: 'Visa — Shares ($100K-$250K)', date: '2025-11-20', sector: 'Payments' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'CRWD', description: 'CrowdStrike — Call options $380 strike', date: '2025-11-15', sector: 'Cybersecurity' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'AI', description: 'C3.ai — Shares ($50K-$100K)', date: '2025-11-10', sector: 'AI' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'NFLX', description: 'Netflix — Exercised calls', closingPnl: '+45%', date: '2025-11-05', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'ARM', description: 'ARM Holdings — Shares ($250K-$500K)', date: '2025-10-25', sector: 'Semis' },
];

export const SEED_PELOSI_HOLDINGS: TrackerHolding[] = [
  // Short-term (active option positions / recent buys)
  { id: generateId(), position: '1/3', ticker: 'NVDA', description: 'NVIDIA Call Options', sector: 'Semis', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'GOOGL', description: 'Alphabet Call Options', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'MSFT', description: 'Microsoft Call Options', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'PANW', description: 'Palo Alto Networks Calls', sector: 'Cybersecurity', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'AVGO', description: 'Broadcom Call Options', sector: 'Semis', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'CRWD', description: 'CrowdStrike Call Options', sector: 'Cybersecurity', timeframe: 'short' },
  // Long-term (share positions held for years)
  { id: generateId(), position: '3/3', ticker: 'AAPL', description: 'Apple Inc (core holding)', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'MSFT', description: 'Microsoft (shares)', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'CRM', description: 'Salesforce', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'TSM', description: 'TSMC', sector: 'Semis', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'AMZN', description: 'Amazon', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'V', description: 'Visa', sector: 'Payments', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'AI', description: 'C3.ai', sector: 'AI', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'ARM', description: 'ARM Holdings', sector: 'Semis', timeframe: 'long' },
];

export const SEED_PELOSI_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Pelosi Portfolio — March 2026 Update',
  keyThemes: [
    'Heavy rotation into semiconductors: NVDA, AVGO, TSM, ARM calls. CHIPS Act insider edge?',
    'Cybersecurity bets (PANW, CRWD) ahead of new federal cyber mandates — suspicious timing.',
    'Sold Disney before streaming losses deepened. Disclosure came 45 days after trade.',
    'Options strategy: deep ITM calls = leveraged long with limited downside. Smart positioning.',
    'Portfolio 80%+ tech — no diversification needed when you have information advantage.',
    'Paul Pelosi executing the trades — technically not covered by STOCK Act constraints.',
    'Roblox calls from $25 to $46 — timed perfectly around metaverse education push.',
    'CRM purchase before government cloud contract announcement. Coincidence noted.',
    'TSLA sale before Musk-government tensions escalated. Well-timed exit.',
    'Net worth estimated at $240M+. Congressional salary: $223K. The math doesnt add up.',
    'Consistently outperforms hedge funds, mutual funds, and S&P 500. Every. Single. Year.',
  ],
  performance: {
    hc3m: '+14.2%',
    hc12m: '+38.7%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+45.2%',
    hedgeRealized12m: '+22.1%',
  },
  allocation: {
    'Tech': 40,
    'Semis': 25,
    'Cybersecurity': 12,
    'Payments': 8,
    'AI': 7,
    'Media': 4,
    'EV': 4,
  },
  notes: '',
};
