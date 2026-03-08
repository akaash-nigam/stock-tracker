import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { generateId } from './utils';

// Stanley Druckenmiller — Duquesne Family Office 13F filings
// Known for: macro legend, Soros's right hand, concentrated bets, "home runs"
// Style: top-down macro with bottom-up stock picking

export const SEED_DRUCK_ALERTS: TrackerAlert[] = [
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NVDA', description: 'NVIDIA — AI infrastructure pick', date: '2026-02-14', sector: 'AI' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'MSFT', description: 'Microsoft — AI + cloud dominance', date: '2026-02-14', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'GOOGL', description: 'Alphabet — AI search disruption risk', closingPnl: '+22%', date: '2026-02-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'MELI', description: 'MercadoLibre — LatAm ecommerce + fintech', date: '2026-02-14', sector: 'Emerging Markets' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'NFLX', description: 'Netflix — Ad tier monetization', date: '2026-02-14', sector: 'Tech' },
  { id: generateId(), action: 'Sell', size: 'All', ticker: 'TLT', description: 'Long bonds — Bearish on duration', closingPnl: '+18%', date: '2026-02-14', sector: 'Fixed Income' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'LLY', description: 'Eli Lilly — GLP-1 obesity drugs', date: '2025-11-14', sector: 'Pharma' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'IBIT', description: 'Bitcoin ETF — Crypto macro hedge', date: '2025-11-14', sector: 'Crypto' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'AMZN', description: 'Amazon — Trimming after run-up', closingPnl: '+40%', date: '2025-11-14', sector: 'Tech' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'CELH', description: 'Celsius Holdings — Consumer growth', date: '2025-08-14', sector: 'Consumer' },
  { id: generateId(), action: 'Buy', size: '1/4', ticker: 'TECK', description: 'Teck Resources — Copper exposure', date: '2025-08-14', sector: 'Commodities' },
  { id: generateId(), action: 'Buy', size: '1/3', ticker: 'WYNN', description: 'Wynn Resorts — Macao recovery', date: '2025-08-14', sector: 'Leisure' },
  { id: generateId(), action: 'Sell', size: '1/3', ticker: 'META', description: 'Meta — Reducing after doubling', closingPnl: '+95%', date: '2025-08-14', sector: 'Tech' },
];

export const SEED_DRUCK_HOLDINGS: TrackerHolding[] = [
  // Short-term (tactical macro)
  { id: generateId(), position: '2/3', ticker: 'NVDA', description: 'NVIDIA (top position)', sector: 'AI', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'NFLX', description: 'Netflix', sector: 'Tech', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'CELH', description: 'Celsius Holdings', sector: 'Consumer', timeframe: 'short' },
  { id: generateId(), position: '1/3', ticker: 'WYNN', description: 'Wynn Resorts', sector: 'Leisure', timeframe: 'short' },
  { id: generateId(), position: '1/4', ticker: 'TECK', description: 'Teck Resources', sector: 'Commodities', timeframe: 'short' },
  // Long-term (high conviction)
  { id: generateId(), position: '2/3', ticker: 'MSFT', description: 'Microsoft', sector: 'Tech', timeframe: 'long' },
  { id: generateId(), position: '2/3', ticker: 'MELI', description: 'MercadoLibre', sector: 'Emerging Markets', timeframe: 'long' },
  { id: generateId(), position: '1/4', ticker: 'LLY', description: 'Eli Lilly', sector: 'Pharma', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'IBIT', description: 'iShares Bitcoin Trust', sector: 'Crypto', timeframe: 'long' },
  { id: generateId(), position: '1/3', ticker: 'AMZN', description: 'Amazon (reduced)', sector: 'Tech', timeframe: 'long' },
];

export const SEED_DRUCK_REPORT: TrackerReport = {
  id: generateId(),
  date: '2026-03-01',
  title: 'Duquesne Family Office — Q4 2025 13F Review',
  keyThemes: [
    'NVIDIA is top position: "AI is as big as the internet. NVDA is the toll booth." Classic Druck concentration.',
    'Microsoft: "best positioned mega-cap for AI monetization." Copilot + Azure = compounding machine.',
    'Sold long bonds: "You cannot own duration when the government is running 7% deficits in an expansion."',
    'MercadoLibre: "Amazon + PayPal of Latin America at a fraction of the valuation." Secular EM winner.',
    'GLP-1 revolution: Eli Lilly position reflects conviction that obesity drugs are $100B+ market.',
    'Bitcoin position via IBIT: "I got it wrong initially. BTC is digital gold for millennials."',
    'Reduced GOOGL: "AI threatens search monopoly. Microsoft is the AI winner, not Google."',
    'Key Druck principle: "The way to build long-term returns is through big concentrated bets."',
    'Portfolio is ~15 positions — extreme concentration. Top 5 = 60%+ of portfolio.',
    'Macro view: "Soft landing worked. But the fiscal problem is not solved — it is delayed."',
  ],
  performance: {
    hc3m: '+9.8%',
    hc12m: '+28.5%',
    sp3m: '+1.0%',
    sp12m: '+15.4%',
    realizedSells12m: '+38.7%',
    hedgeRealized12m: '+18.0%',
  },
  allocation: {
    'AI': 25,
    'Tech': 22,
    'Emerging Markets': 15,
    'Pharma': 10,
    'Crypto': 8,
    'Consumer': 7,
    'Commodities': 5,
    'Leisure': 5,
    'Fixed Income': 3,
  },
  notes: '',
};
