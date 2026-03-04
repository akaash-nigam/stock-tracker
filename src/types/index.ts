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

export interface AppState {
  positions: Position[];
  accounts: Account[];
  quotes: Record<string, MarketQuote>;
  earnings: Record<string, string>;
  lastUpdated: string | null;
  loading: boolean;
}
