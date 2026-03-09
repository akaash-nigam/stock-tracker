import type { Position, Account, WatchlistItem, UserName, BtrAlert, BtrHolding, BtrReport, TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import { ALL_TRACKER_IDS, TRACKER_CONFIGS } from './trackerConfig';
import { clearCloudAccessDenied, hasCompletedCloudMigration, isCloudAccessDenied, isCloudAvailable, loadCloudPayload, markCloudMigrationComplete, saveCloudPayload } from './cloudStorage';

const API_KEY_KEY = 'st_finnhub_api_key';
const CURRENCY_KEY = 'st_currency';
const SNAPSHOTS_KEY = 'st_portfolio_snapshots';
const POSITIONS_KEY = 'st_positions';
const ACCOUNTS_KEY = 'st_accounts';
const WATCHLIST_KEY = 'st_watchlist';
const PIN_HASH_KEY = 'st_pin_hash';
const SESSION_KEY = 'st_session';

let syncTimer: number | null = null;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTrackerCloudData(): Record<string, { alerts: TrackerAlert[]; holdings: TrackerHolding[]; reports: TrackerReport[] }> {
  const trackers: Record<string, { alerts: TrackerAlert[]; holdings: TrackerHolding[]; reports: TrackerReport[] }> = {};
  for (const id of ALL_TRACKER_IDS) {
    const prefix = TRACKER_CONFIGS[id].storagePrefix;
    trackers[prefix] = {
      alerts: getTrackerAlerts(prefix),
      holdings: getTrackerHoldings(prefix),
      reports: getTrackerReports(prefix),
    };
  }
  return trackers;
}

async function syncAllToCloud(): Promise<void> {
  if (!isCloudAvailable()) return;
  await saveCloudPayload({
    positions: getPositions(),
    accounts: getAccounts(),
    watchlist: getWatchlist(),
    snapshots: getSnapshots(),
    currency: getCurrency(),
    trackers: getTrackerCloudData(),
  });
}

function scheduleCloudSync(): void {
  if (!isCloudAvailable()) return;
  if (syncTimer !== null) {
    window.clearTimeout(syncTimer);
  }
  syncTimer = window.setTimeout(() => {
    syncTimer = null;
    void syncAllToCloud();
  }, 400);
}

export type CloudHydrateStatus = 'disabled' | 'loaded' | 'skipped' | 'denied';

export async function hydrateFromCloud(): Promise<CloudHydrateStatus> {
  if (!isCloudAvailable()) return 'disabled';

  const payload = await loadCloudPayload();
  if (!payload) {
    if (isCloudAccessDenied()) return 'denied';
    if (!hasCompletedCloudMigration()) {
      await syncAllToCloud();
      if (isCloudAccessDenied()) return 'denied';
      markCloudMigrationComplete();
      clearCloudAccessDenied();
      return 'loaded';
    }
    return 'skipped';
  }

  if (payload.positions) writeJson(POSITIONS_KEY, payload.positions);
  if (payload.accounts) writeJson(ACCOUNTS_KEY, payload.accounts);
  if (payload.watchlist) writeJson(WATCHLIST_KEY, payload.watchlist);
  if (payload.snapshots) writeJson(SNAPSHOTS_KEY, payload.snapshots);
  if (payload.currency) localStorage.setItem(CURRENCY_KEY, payload.currency);

  if (payload.trackers) {
    for (const [prefix, tracker] of Object.entries(payload.trackers)) {
      writeJson(`st_${prefix}_alerts`, tracker.alerts ?? []);
      writeJson(`st_${prefix}_holdings`, tracker.holdings ?? []);
      writeJson(`st_${prefix}_reports`, tracker.reports ?? []);
    }
  }

  clearCloudAccessDenied();
  markCloudMigrationComplete();
  return 'loaded';
}

// --- Positions ---

export function getPositions(): Position[] {
  return readJson<Position[]>(POSITIONS_KEY, []);
}

export function savePositions(positions: Position[]): void {
  writeJson(POSITIONS_KEY, positions);
  scheduleCloudSync();
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
  return readJson<Account[]>(ACCOUNTS_KEY, []);
}

export function saveAccounts(accounts: Account[]): void {
  writeJson(ACCOUNTS_KEY, accounts);
  scheduleCloudSync();
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
  return readJson<WatchlistItem[]>(WATCHLIST_KEY, []);
}

export function saveWatchlist(items: WatchlistItem[]): void {
  writeJson(WATCHLIST_KEY, items);
  scheduleCloudSync();
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
  scheduleCloudSync();
}

// --- Portfolio Snapshots ---

export interface PortfolioSnapshot {
  date: string; // YYYY-MM-DD
  totalValue: number;
  totalInvested: number;
  pnl: number;
}

export function getSnapshots(): PortfolioSnapshot[] {
  return readJson<PortfolioSnapshot[]>(SNAPSHOTS_KEY, []);
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
  writeJson(SNAPSHOTS_KEY, trimmed);
  scheduleCloudSync();
}

// --- Bear Traps ---

const BTR_ALERTS_KEY = 'st_btr_alerts';
const BTR_HOLDINGS_KEY = 'st_btr_holdings';
const BTR_REPORTS_KEY = 'st_btr_reports';

export function getBtrAlerts(): BtrAlert[] {
  return readJson<BtrAlert[]>(BTR_ALERTS_KEY, []);
}

export function saveBtrAlerts(alerts: BtrAlert[]): void {
  writeJson(BTR_ALERTS_KEY, alerts);
  scheduleCloudSync();
}

export function getBtrHoldings(): BtrHolding[] {
  return readJson<BtrHolding[]>(BTR_HOLDINGS_KEY, []);
}

export function saveBtrHoldings(holdings: BtrHolding[]): void {
  writeJson(BTR_HOLDINGS_KEY, holdings);
  scheduleCloudSync();
}

export function getBtrReports(): BtrReport[] {
  return readJson<BtrReport[]>(BTR_REPORTS_KEY, []);
}

export function saveBtrReports(reports: BtrReport[]): void {
  writeJson(BTR_REPORTS_KEY, reports);
  scheduleCloudSync();
}

// --- Generic Tracker Storage ---

export function getTrackerAlerts(prefix: string): TrackerAlert[] {
  return readJson<TrackerAlert[]>(`st_${prefix}_alerts`, []);
}

export function saveTrackerAlerts(prefix: string, alerts: TrackerAlert[]): void {
  writeJson(`st_${prefix}_alerts`, alerts);
  scheduleCloudSync();
}

export function getTrackerHoldings(prefix: string): TrackerHolding[] {
  return readJson<TrackerHolding[]>(`st_${prefix}_holdings`, []);
}

export function saveTrackerHoldings(prefix: string, holdings: TrackerHolding[]): void {
  writeJson(`st_${prefix}_holdings`, holdings);
  scheduleCloudSync();
}

export function getTrackerReports(prefix: string): TrackerReport[] {
  return readJson<TrackerReport[]>(`st_${prefix}_reports`, []);
}

export function saveTrackerReports(prefix: string, reports: TrackerReport[]): void {
  writeJson(`st_${prefix}_reports`, reports);
  scheduleCloudSync();
}

// --- Import / Export (for sharing between friends) ---

export function exportData(): string {
  const data: Record<string, unknown> = {
    positions: getPositions(),
    accounts: getAccounts(),
    watchlist: getWatchlist(),
    exportedAt: new Date().toISOString(),
  };
  for (const id of ALL_TRACKER_IDS) {
    const prefix = TRACKER_CONFIGS[id].storagePrefix;
    data[`${prefix}_alerts`] = getTrackerAlerts(prefix);
    data[`${prefix}_holdings`] = getTrackerHoldings(prefix);
    data[`${prefix}_reports`] = getTrackerReports(prefix);
  }
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): { positions: Position[]; accounts: Account[] } {
  const data = JSON.parse(json);
  if (data.positions) savePositions(data.positions);
  if (data.accounts) saveAccounts(data.accounts);
  if (data.watchlist) saveWatchlist(data.watchlist);
  for (const id of ALL_TRACKER_IDS) {
    const prefix = TRACKER_CONFIGS[id].storagePrefix;
    if (data[`${prefix}_alerts`]) saveTrackerAlerts(prefix, data[`${prefix}_alerts`]);
    if (data[`${prefix}_holdings`]) saveTrackerHoldings(prefix, data[`${prefix}_holdings`]);
    if (data[`${prefix}_reports`]) saveTrackerReports(prefix, data[`${prefix}_reports`]);
  }
  scheduleCloudSync();
  return { positions: data.positions ?? [], accounts: data.accounts ?? [] };
}
