import { FileText, Tv, Landmark, Eye, TreePine, Rocket, Shield, Globe, Crosshair, Scale, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TrackerId } from '../types';

export interface TrackerConfig {
  id: TrackerId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
  accentHex: string;
  route: string;
  navLabel: string;
  storagePrefix: string;
  performanceLabels: {
    primary3m: string;
    primary12m: string;
    benchmark3mLabel: string;
    benchmark12mLabel: string;
    realizedLabel: string;
    hedgeLabel: string;
  };
}

export const COLOR_CLASSES: Record<string, {
  bgLight: string;
  text: string;
  bgSolid: string;
  bgSolidHover: string;
  focusRing: string;
  border: string;
}> = {
  amber: {
    bgLight: 'bg-amber-500/10',
    text: 'text-amber-400',
    bgSolid: 'bg-amber-600',
    bgSolidHover: 'hover:bg-amber-500',
    focusRing: 'focus:ring-amber-500/50',
    border: 'border-amber-500/20',
  },
  blue: {
    bgLight: 'bg-blue-500/10',
    text: 'text-blue-400',
    bgSolid: 'bg-blue-600',
    bgSolidHover: 'hover:bg-blue-500',
    focusRing: 'focus:ring-blue-500/50',
    border: 'border-blue-500/20',
  },
  violet: {
    bgLight: 'bg-violet-500/10',
    text: 'text-violet-400',
    bgSolid: 'bg-violet-600',
    bgSolidHover: 'hover:bg-violet-500',
    focusRing: 'focus:ring-violet-500/50',
    border: 'border-violet-500/20',
  },
  orange: {
    bgLight: 'bg-orange-500/10',
    text: 'text-orange-400',
    bgSolid: 'bg-orange-600',
    bgSolidHover: 'hover:bg-orange-500',
    focusRing: 'focus:ring-orange-500/50',
    border: 'border-orange-500/20',
  },
  emerald: {
    bgLight: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    bgSolid: 'bg-emerald-500',
    bgSolidHover: 'hover:bg-emerald-400',
    focusRing: 'focus:ring-emerald-500/50',
    border: 'border-emerald-500/20',
  },
  rose: {
    bgLight: 'bg-rose-500/10',
    text: 'text-rose-400',
    bgSolid: 'bg-rose-500',
    bgSolidHover: 'hover:bg-rose-400',
    focusRing: 'focus:ring-rose-500/50',
    border: 'border-rose-500/20',
  },
  cyan: {
    bgLight: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    bgSolid: 'bg-cyan-500',
    bgSolidHover: 'hover:bg-cyan-400',
    focusRing: 'focus:ring-cyan-500/50',
    border: 'border-cyan-500/20',
  },
  pink: {
    bgLight: 'bg-pink-500/10',
    text: 'text-pink-400',
    bgSolid: 'bg-pink-500',
    bgSolidHover: 'hover:bg-pink-400',
    focusRing: 'focus:ring-pink-500/50',
    border: 'border-pink-500/20',
  },
  indigo: {
    bgLight: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    bgSolid: 'bg-indigo-500',
    bgSolidHover: 'hover:bg-indigo-400',
    focusRing: 'focus:ring-indigo-500/50',
    border: 'border-indigo-500/20',
  },
  red: {
    bgLight: 'bg-red-500/10',
    text: 'text-red-400',
    bgSolid: 'bg-red-500',
    bgSolidHover: 'hover:bg-red-400',
    focusRing: 'focus:ring-red-500/50',
    border: 'border-red-500/20',
  },
  purple: {
    bgLight: 'bg-purple-500/10',
    text: 'text-purple-400',
    bgSolid: 'bg-purple-500',
    bgSolidHover: 'hover:bg-purple-400',
    focusRing: 'focus:ring-purple-500/50',
    border: 'border-purple-500/20',
  },
};

export const TRACKER_CONFIGS: Record<TrackerId, TrackerConfig> = {
  beartraps: {
    id: 'beartraps',
    title: 'Bear Traps Report',
    subtitle: "Larry McDonald's Turning Point — Weekly Tracker",
    icon: FileText,
    accentColor: 'amber',
    accentHex: '#f59e0b',
    route: '/beartraps',
    navLabel: 'Bear Traps',
    storagePrefix: 'btr',
    performanceLabels: {
      primary3m: 'HC 3-Month',
      primary12m: 'HC 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Sells 12m',
      hedgeLabel: 'Hedge',
    },
  },
  cramer: {
    id: 'cramer',
    title: 'Reverse Cramer Tracker',
    subtitle: 'Inverse Jim Cramer — Do the Opposite of Mad Money',
    icon: Tv,
    accentColor: 'blue',
    accentHex: '#3b82f6',
    route: '/cramer',
    navLabel: 'Cramer',
    storagePrefix: 'cramer',
    performanceLabels: {
      primary3m: 'Inverse 3-Month',
      primary12m: 'Inverse 12-Month',
      benchmark3mLabel: 'Cramer Pick',
      benchmark12mLabel: 'Cramer Pick',
      realizedLabel: 'Realized Inverse 12m',
      hedgeLabel: 'Cramer Avg',
    },
  },
  pelosi: {
    id: 'pelosi',
    title: 'Pelosi Tracker',
    subtitle: 'Nancy Pelosi — Congressional Trade Disclosures',
    icon: Landmark,
    accentColor: 'violet',
    accentHex: '#8b5cf6',
    route: '/pelosi',
    navLabel: 'Pelosi',
    storagePrefix: 'pelosi',
    performanceLabels: {
      primary3m: 'Portfolio 3-Month',
      primary12m: 'Portfolio 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Trades 12m',
      hedgeLabel: 'Sector Avg',
    },
  },
  burry: {
    id: 'burry',
    title: 'Burry Tracker',
    subtitle: 'Michael Burry — Scion Asset Management 13F Filings',
    icon: Eye,
    accentColor: 'orange',
    accentHex: '#f97316',
    route: '/burry',
    navLabel: 'Burry',
    storagePrefix: 'burry',
    performanceLabels: {
      primary3m: '13F 3-Month',
      primary12m: '13F 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Positions 12m',
      hedgeLabel: 'Short Book',
    },
  },
  pinetree: {
    id: 'pinetree',
    title: 'PineTree Macro',
    subtitle: "Ritesh Jain — Global Macro & India Insights",
    icon: TreePine,
    accentColor: 'emerald',
    accentHex: '#10b981',
    route: '/pinetree',
    navLabel: 'PineTree',
    storagePrefix: 'pinetree',
    performanceLabels: {
      primary3m: 'Macro 3-Month',
      primary12m: 'Macro 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Calls 12m',
      hedgeLabel: 'India Index',
    },
  },
  ark: {
    id: 'ark',
    title: 'ARK Invest Tracker',
    subtitle: "Cathie Wood — Daily Trades & Disruptive Innovation",
    icon: Rocket,
    accentColor: 'rose',
    accentHex: '#f43f5e',
    route: '/ark',
    navLabel: 'ARK',
    storagePrefix: 'ark',
    performanceLabels: {
      primary3m: 'ARKK 3-Month',
      primary12m: 'ARKK 12-Month',
      benchmark3mLabel: 'vs QQQ',
      benchmark12mLabel: 'vs QQQ',
      realizedLabel: 'Realized Trades 12m',
      hedgeLabel: 'Innovation Avg',
    },
  },
  buffett: {
    id: 'buffett',
    title: 'Buffett Tracker',
    subtitle: "Warren Buffett — Berkshire Hathaway 13F Filings",
    icon: Shield,
    accentColor: 'cyan',
    accentHex: '#06b6d4',
    route: '/buffett',
    navLabel: 'Buffett',
    storagePrefix: 'buffett',
    performanceLabels: {
      primary3m: 'BRK 3-Month',
      primary12m: 'BRK 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Positions 12m',
      hedgeLabel: 'Book Value',
    },
  },
  fftt: {
    id: 'fftt',
    title: 'FFTT Report',
    subtitle: "Luke Gromen — Fiscal/Macro/Energy/USD Framework",
    icon: Globe,
    accentColor: 'pink',
    accentHex: '#ec4899',
    route: '/fftt',
    navLabel: 'FFTT',
    storagePrefix: 'fftt',
    performanceLabels: {
      primary3m: 'Thesis 3-Month',
      primary12m: 'Thesis 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Calls 12m',
      hedgeLabel: 'Gold/Oil Ratio',
    },
  },
  druckenmiller: {
    id: 'druckenmiller',
    title: 'Druckenmiller Tracker',
    subtitle: "Stanley Druckenmiller — Duquesne Family Office 13F",
    icon: Crosshair,
    accentColor: 'indigo',
    accentHex: '#6366f1',
    route: '/druckenmiller',
    navLabel: 'Druck',
    storagePrefix: 'druck',
    performanceLabels: {
      primary3m: '13F 3-Month',
      primary12m: '13F 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Positions 12m',
      hedgeLabel: 'Macro Avg',
    },
  },
  congress: {
    id: 'congress',
    title: 'Congress Tracker',
    subtitle: "Unusual Whales — Top Congressional Stock Trades",
    icon: Scale,
    accentColor: 'red',
    accentHex: '#ef4444',
    route: '/congress',
    navLabel: 'Congress',
    storagePrefix: 'congress',
    performanceLabels: {
      primary3m: 'Congress 3-Month',
      primary12m: 'Congress 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'Realized Trades 12m',
      hedgeLabel: 'Avg Member',
    },
  },
  wsb: {
    id: 'wsb',
    title: 'WSB Sentiment',
    subtitle: "WallStreetBets — Reddit Meme Stock Momentum",
    icon: Flame,
    accentColor: 'purple',
    accentHex: '#a855f7',
    route: '/wsb',
    navLabel: 'WSB',
    storagePrefix: 'wsb',
    performanceLabels: {
      primary3m: 'Meme 3-Month',
      primary12m: 'Meme 12-Month',
      benchmark3mLabel: 'vs S&P',
      benchmark12mLabel: 'vs S&P',
      realizedLabel: 'YOLO Avg 12m',
      hedgeLabel: 'Loss Porn',
    },
  },
};

export const ALL_TRACKER_IDS: TrackerId[] = [
  'beartraps', 'cramer', 'pelosi', 'burry', 'pinetree',
  'ark', 'buffett', 'fftt', 'druckenmiller', 'congress', 'wsb',
];
