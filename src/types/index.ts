export const USERS = ['Vishal', 'Jinesh', 'Hitesh', 'Soham', 'Aakash', 'Sarthak', 'Amrit'] as const;
export type UserName = (typeof USERS)[number];

export type AccountType = 'TFSA' | 'RRSP' | 'Margin' | 'Cash' | 'Other';
export type Theme = 'AI & Infra' | 'Energy & Resources' | 'Autonomy & Frontier' | 'Socio-Econ' | 'Other';
export type PositionStatus = 'open' | 'closed';
export type AssetClass = 'Equity' | 'ETF' | 'Option' | 'Metals' | 'Crypto' | 'Other';
export type OptionType = 'Call' | 'Put';
export type StrategyType = 'Long Term' | 'Short Term' | 'Swing' | 'Options' | 'Trend Following' | 'Other';

export interface Position {
  id: string;
  ticker: string;
  theme: Theme;
  specificTrend: string;
  strategy: StrategyType;
  assetClass: AssetClass;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  quantity: number;
  accountId: string;
  rationale: string;
  mood: string;
  status: PositionStatus;
  createdAt: string;
  // Options fields
  optionType?: OptionType;
  strikePrice?: number;
  expiryDate?: string;
  premium?: number;
  contracts?: number;
  // Close trade fields
  exitPrice?: number;
  closedAt?: string;
  closeNote?: string;
  // User tracking
  addedBy?: UserName;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  theme: Theme;
  note: string;
  addedAt: string;
  addedBy?: UserName;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  broker: string;
  cashBalance: number;
  owner: string;
}

export interface MarketQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous close
  t: number;   // timestamp
}

export interface EarningsEvent {
  symbol: string;
  date: string;
  hour: string; // 'bmo' | 'amc' | ''
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
}

export interface PositionWithMarket extends Position {
  currentPrice: number | null;
  change: number | null;
  changePercent: number | null;
  pnl: number | null;
  pnlPercent: number | null;
  marketValue: number | null;
  earningsDate: string | null;
}

// --- Generic Investor Tracker ---

export type TrackerId = 'beartraps' | 'cramer' | 'pelosi' | 'burry' | 'pinetree' | 'ark' | 'buffett' | 'fftt' | 'druckenmiller' | 'congress' | 'wsb';
export type TrackerAction = 'Buy' | 'Sell';
export type TrackerTimeframe = 'short' | 'long';

export interface TrackerAlert {
  id: string;
  action: TrackerAction;
  size: string;
  ticker: string;
  description: string;
  price?: number;
  closingPnl?: string;
  date: string;
  sector: string;
}

export interface TrackerHolding {
  id: string;
  position: string;
  ticker: string;
  description: string;
  sector: string;
  timeframe: TrackerTimeframe;
}

export interface TrackerReport {
  id: string;
  date: string;
  title: string;
  keyThemes: string[];
  performance: {
    hc3m: string;
    hc12m: string;
    sp3m: string;
    sp12m: string;
    realizedSells12m: string;
    hedgeRealized12m: string;
  };
  allocation: Record<string, number>;
  notes: string;
}

// Backward compat aliases
export type BtrAction = TrackerAction;
export type BtrTimeframe = TrackerTimeframe;
export type BtrAlert = TrackerAlert;
export type BtrHolding = TrackerHolding;
export type BtrReport = TrackerReport;

export interface AppState {
  positions: Position[];
  accounts: Account[];
  quotes: Record<string, MarketQuote>;
  earnings: Record<string, string>;
  lastUpdated: string | null;
  loading: boolean;
}
