import type { Position, Account, WatchlistItem, UserName } from '../types';

const API_KEY_KEY = 'st_finnhub_api_key';
const CURRENCY_KEY = 'st_currency';
const SNAPSHOTS_KEY = 'st_portfolio_snapshots';
const POSITIONS_KEY = 'st_positions';
const ACCOUNTS_KEY = 'st_accounts';
const WATCHLIST_KEY = 'st_watchlist';
const PIN_HASH_KEY = 'st_pin_hash';
const SESSION_KEY = 'st_session';

// --- Positions ---

export function getPositions(): Position[] {
  const raw = localStorage.getItem(POSITIONS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function savePositions(positions: Position[]): void {
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
}

export function addPosition(position: Position): Position[] {
  const positions = getPositions();
  positions.push(position);
  savePositions(positions);
  return positions;
}

export function updatePosition(id: string, updates: Partial<Position>): Position[] {
  const positions = getPositions().map(p =>
    p.id === id ? { ...p, ...updates } : p
  );
  savePositions(positions);
  return positions;
}

export function deletePosition(id: string): Position[] {
  const positions = getPositions().filter(p => p.id !== id);
  savePositions(positions);
  return positions;
}

// --- Accounts ---

export function getAccounts(): Account[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function addAccount(account: Account): Account[] {
  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);
  return accounts;
}

export function updateAccount(id: string, updates: Partial<Account>): Account[] {
  const accounts = getAccounts().map(a =>
    a.id === id ? { ...a, ...updates } : a
  );
  saveAccounts(accounts);
  return accounts;
}

export function deleteAccount(id: string): Account[] {
  const accounts = getAccounts().filter(a => a.id !== id);
  saveAccounts(accounts);
  return accounts;
}

// --- PIN Auth ---

export function getPinHash(): string | null {
  return localStorage.getItem(PIN_HASH_KEY);
}

export function setPinHash(hash: string): void {
  localStorage.setItem(PIN_HASH_KEY, hash);
}

export function isSessionValid(): boolean {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;
  try {
    const { expiresAt } = JSON.parse(session);
    return Date.now() < expiresAt;
  } catch { return false; }
}

export function getCurrentUser(): UserName | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const { user } = JSON.parse(session);
    return user ?? null;
  } catch { return null; }
}

export function setSession(user: UserName): void {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt, user }));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// --- Watchlist ---

export function getWatchlist(): WatchlistItem[] {
  const raw = localStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveWatchlist(items: WatchlistItem[]): void {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function addWatchlistItem(item: WatchlistItem): WatchlistItem[] {
  const items = getWatchlist();
  items.push(item);
  saveWatchlist(items);
  return items;
}

export function deleteWatchlistItem(id: string): WatchlistItem[] {
  const items = getWatchlist().filter(w => w.id !== id);
  saveWatchlist(items);
  return items;
}

// --- API Key ---

export function getFinnhubApiKey(): string | null {
  return localStorage.getItem(API_KEY_KEY);
}

export function setFinnhubApiKey(key: string): void {
  localStorage.setItem(API_KEY_KEY, key);
}

// --- Currency ---

export type Currency = 'USD' | 'CAD';

export function getCurrency(): Currency {
  return (localStorage.getItem(CURRENCY_KEY) as Currency) ?? 'USD';
}

export function setCurrency(currency: Currency): void {
  localStorage.setItem(CURRENCY_KEY, currency);
}

// --- Portfolio Snapshots ---

export interface PortfolioSnapshot {
  date: string; // YYYY-MM-DD
  totalValue: number;
  totalInvested: number;
  pnl: number;
}

export function getSnapshots(): PortfolioSnapshot[] {
  const raw = localStorage.getItem(SNAPSHOTS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveSnapshot(snapshot: PortfolioSnapshot): void {
  const snapshots = getSnapshots();
  // Replace if same date exists, otherwise append
  const idx = snapshots.findIndex(s => s.date === snapshot.date);
  if (idx >= 0) {
    snapshots[idx] = snapshot;
  } else {
    snapshots.push(snapshot);
  }
  // Keep last 365 days
  const trimmed = snapshots.slice(-365);
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(trimmed));
}

// --- Import / Export (for sharing between friends) ---

export function exportData(): string {
  return JSON.stringify({
    positions: getPositions(),
    accounts: getAccounts(),
    watchlist: getWatchlist(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): { positions: Position[]; accounts: Account[] } {
  const data = JSON.parse(json);
  if (data.positions) savePositions(data.positions);
  if (data.accounts) saveAccounts(data.accounts);
  if (data.watchlist) saveWatchlist(data.watchlist);
  return { positions: data.positions ?? [], accounts: data.accounts ?? [] };
}
