import { FileText, Tv, Landmark, Eye } from 'lucide-react';
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
};

export const ALL_TRACKER_IDS: TrackerId[] = ['beartraps', 'cramer', 'pelosi', 'burry'];
