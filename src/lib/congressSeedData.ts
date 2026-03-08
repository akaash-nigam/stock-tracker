import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Congress Tracker — Unusual Whales data, top congressional traders
// Beyond just Pelosi: Tuberville, Crenshaw, Fallon, etc.
// Based on STOCK Act periodic transaction reports

export const SEED_CONGRESS_ALERTS: TrackerAlert[] = [
  // Tommy Tuberville (R-AL) — most active trader in Senate
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'RTX', description: '[Tuberville] Raytheon — defense committee member', date: '2026-03-02', sector: 'Defense' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'LMT', description: '[Tuberville] Lockheed Martin — ahead of budget vote', date: '2026-02-25', sector: 'Defense' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'TSLA', description: '[Tuberville] Tesla — sold before EV subsidy debate', closingPnl: '+22%', date: '2026-02-20', sector: 'EV' },
  // Dan Crenshaw (R-TX)
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'XOM', description: '[Crenshaw] Exxon Mobil — Texas energy rep', date: '2026-02-18', sector: 'Energy' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'FANG', description: '[Crenshaw] Diamondback Energy — Permian Basin', date: '2026-02-15', sector: 'Energy' },
  // Pat Fallon (R-TX)
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NVDA', description: '[Fallon] NVIDIA — ahead of CHIPS Act extension', date: '2026-02-12', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'MSFT', description: '[Fallon] Microsoft — defense cloud contract', date: '2026-02-08', sector: 'Tech' },
  // Mark Green (R-TN) — Homeland Security Chair
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'PANW', description: '[Green] Palo Alto Networks — cyber hearing week', date: '2026-02-05', sector: 'Cybersecurity' },
  // Ro Khanna (D-CA) — tech district
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GOOGL', description: '[Khanna] Alphabet — Silicon Valley rep', date: '2026-01-28', sector: 'Tech' },
  // Bipartisan pattern
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'GD', description: '[Multiple] General Dynamics — defense hawks', date: '2026-01-22', sector: 'Defense' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'PFE', description: '[Multiple] Pfizer — before FDA hearing', closingPnl: '-8%', date: '2026-01-15', sector: 'Pharma' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'PLTR', description: '[Multiple] Palantir — government AI contracts', date: '2026-01-10', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NOC', description: '[Tuberville] Northrop Grumman — B-21 program', date: '2025-12-15', sector: 'Defense' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'BABA', description: '[Multiple] Alibaba — China tensions vote', closingPnl: '+12%', date: '2025-12-10', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'UNH', description: '[Multiple] UnitedHealth — healthcare committee', date: '2025-12-05', sector: 'Healthcare' },
];

export const SEED_CONGRESS_HOLDINGS: TrackerHolding[] = [
  // Top congressional holdings (aggregate across members)
  { id: generateId(), position: '3/3', ticker: 'NVDA', description: 'NVIDIA (most bought by Congress)', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '2/3', ticker: 'MSFT', description: 'Microsoft', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'PANW', description: 'Palo Alto Networks', sector: 'Cybersecurity', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'PLTR', description: 'Palantir', sector: 'Tech', timeframe: 'short' },
  // Defense sector (bipartisan favorite)
  { id: generateId(), position: '2/3', ticker: 'RTX', description: 'Raytheon', sector: 'Defense', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'LMT', description: 'Lockheed Martin', sector: 'Defense', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'GD', description: 'General Dynamics', sector: 'Defense', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'NOC', description: 'Northrop Grumman', sector: 'Defense', timeframe: 'long' },
  // Energy (Republican lean)
  { id: generateId(), position: '1/3', ticker: 'XOM', description: 'Exxon Mobil', sector: 'Energy', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'FANG', description: 'Diamondback Energy', sector: 'Energy', timeframe: 'long' },
  // Healthcare
  { id: generateId(), position: '1/3', ticker: 'UNH', description: 'UnitedHealth Group', sector: 'Healthcare', timeframe: 'long' },
];

export const SEED_CONGRESS_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Congressional Trading — March 2026 Aggregate',
  keyThemes: [
    'Defense stocks remain #1 bipartisan buy: RTX, LMT, GD, NOC. Both parties on Armed Services committees buying.',
    'NVDA most-purchased stock by Congress in 2025-2026. Suspicious timing around CHIPS Act votes.',
    'Tuberville: 130+ trades disclosed in 2025. Most active senator despite sitting on Armed Services committee.',
    'Pattern: Congress buys 30-45 days before favorable legislation. Sells 15-30 days before negative news.',
    'Cybersecurity buys (PANW, CRWD) spike before federal cyber mandate announcements. Coincidence?',
    'STOCK Act has no teeth: max penalty $200 for late disclosure. Zero criminal prosecutions since 2012.',
    'Congressional portfolios outperform S&P by 12-15% annually. Better than 96% of hedge funds.',
    'Energy buys by Texas/Oklahoma reps: XOM, FANG, OXY. Energy policy meets portfolio construction.',
    'Pelosi family still the gold standard: NVDA calls from 2023 now up 400%+. Paul Pelosi is the GOAT.',
    'Bipartisan consensus: both parties buy defense, tech, and healthcare. Political theater, shared portfolio.',
    'Ban congressional trading petition at 10M+ signatures. Bill introduced but will never pass (foxes guarding henhouse).',
  ],
  performance: {
    hc3m: '+11.5%',
    hc12m: '+32.1%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+36.8%',
    hedgeRealized12m: '+19.5%',
  },
  allocation: {
    'Defense': 28,
    'Tech': 25,
    'Energy': 15,
    'Cybersecurity': 10,
    'Healthcare': 8,
    'Pharma': 5,
    'Emerging Markets': 5,
    'EV': 4,
  },
  notes: '',
};
