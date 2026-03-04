import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { Position, Account, PositionWithMarket, MarketQuote, WatchlistItem, UserName } from './types';
import * as storage from './lib/storage';
import { getQuotes, getEarningsForSymbols } from './lib/finnhub';
import { checkAlerts, sendBrowserNotification, requestNotificationPermission, isAlertsEnabled, setAlertsEnabled } from './lib/alerts';
import { SEED_POSITIONS, SEED_ACCOUNTS } from './lib/seedData';
import PinLogin from './components/PinLogin';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PositionsTable from './components/PositionsTable';
import AddPosition from './components/AddPosition';
import AccountManager from './components/AccountManager';
import Watchlist from './components/Watchlist';
import TradeHistory from './components/TradeHistory';
import CloseTradeModal from './components/CloseTradeModal';

export default function App() {
  const [authenticated, setAuthenticated] = useState(storage.isSessionValid());
  const [currentUser, setCurrentUser] = useState<UserName | null>(storage.getCurrentUser());
  const [positions, setPositions] = useState<Position[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [earnings, setEarnings] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [closeId, setCloseId] = useState<string | null>(null);
  const [alertsOn, setAlertsOn] = useState(isAlertsEnabled());
  const [alertBanner, setAlertBanner] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load data from storage
  const loadData = useCallback(() => {
    let pos = storage.getPositions();
    let acc = storage.getAccounts();

    // Seed accounts on first run
    if (acc.length === 0) {
      storage.saveAccounts(SEED_ACCOUNTS);
      acc = SEED_ACCOUNTS;
    }

    setPositions(pos);
    setAccounts(acc);
    setWatchlist(storage.getWatchlist());
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    const openPositions = positions.filter(p => p.status === 'open');
    const watchlistTickers = watchlist.map(w => w.ticker);
    const allSymbols = [...new Set([...openPositions.map(p => p.ticker), ...watchlistTickers])];
    if (allSymbols.length === 0) return;

    setLoading(true);
    try {
      const [newQuotes, newEarnings] = await Promise.all([
        getQuotes(allSymbols),
        getEarningsForSymbols(allSymbols),
      ]);
      setQuotes(newQuotes);
      setEarnings(prev => ({ ...prev, ...newEarnings }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [positions, watchlist]);

  // Initial load
  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  // Fetch market data on load and every 60s
  useEffect(() => {
    if (!authenticated || (positions.length === 0 && watchlist.length === 0)) return;

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60_000);
    return () => clearInterval(interval);
  }, [authenticated, positions.length, watchlist.length, fetchMarketData]);

  // Toggle alerts
  async function toggleAlerts() {
    if (!alertsOn) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setAlertBanner('Please enable notifications in your browser settings');
        setTimeout(() => setAlertBanner(null), 4000);
        return;
      }
    }
    const newState = !alertsOn;
    setAlertsEnabled(newState);
    setAlertsOn(newState);
  }

  // Check alerts after market data updates
  useEffect(() => {
    if (!alertsOn || Object.keys(quotes).length === 0) return;
    const withMarket: PositionWithMarket[] = positions.map(p => {
      const quote = quotes[p.ticker];
      const currentPrice = quote?.c ?? null;
      const marketValue = currentPrice !== null ? currentPrice * p.quantity : null;
      const pnl = marketValue !== null ? marketValue - p.entryPrice * p.quantity : null;
      const pnlPercent = currentPrice !== null ? ((currentPrice - p.entryPrice) / p.entryPrice) * 100 : null;
      return { ...p, currentPrice, change: quote?.d ?? null, changePercent: quote?.dp ?? null, pnl, pnlPercent, marketValue, earningsDate: null };
    });
    const alerts = checkAlerts(withMarket);
    for (const alert of alerts) {
      sendBrowserNotification(alert);
      setAlertBanner(alert.message);
      setTimeout(() => setAlertBanner(null), 8000);
    }
  }, [quotes, alertsOn, positions]);

  // Merge positions with market data
  const positionsWithMarket: PositionWithMarket[] = positions.map(p => {
    const quote = quotes[p.ticker];
    const currentPrice = quote?.c ?? null;
    const change = quote?.d ?? null;
    const changePercent = quote?.dp ?? null;
    const marketValue = currentPrice !== null ? currentPrice * p.quantity : null;
    const cost = p.entryPrice * p.quantity;
    const pnl = marketValue !== null ? marketValue - cost : null;
    const pnlPercent = currentPrice !== null ? ((currentPrice - p.entryPrice) / p.entryPrice) * 100 : null;
    const earningsDate = earnings[p.ticker] ?? null;

    return { ...p, currentPrice, change, changePercent, pnl, pnlPercent, marketValue, earningsDate };
  });

  // Position CRUD
  function handleSavePosition(position: Position) {
    const existing = positions.find(p => p.id === position.id);
    let updated: Position[];
    if (existing) {
      updated = storage.updatePosition(position.id, position);
    } else {
      updated = storage.addPosition(position);
    }
    setPositions(updated);
    setEditId(null);
  }

  function handleDeletePosition(id: string) {
    const updated = storage.deletePosition(id);
    setPositions(updated);
  }

  function handleEditPosition(id: string) {
    setEditId(id);
    navigate('/add');
  }

  // Close trade
  function handleCloseTrade(exitPrice: number, closeNote: string) {
    if (!closeId) return;
    const updated = storage.updatePosition(closeId, {
      status: 'closed',
      exitPrice,
      closedAt: new Date().toISOString(),
      closeNote,
    });
    setPositions(updated);
    setCloseId(null);
  }

  // Account CRUD
  function handleAddAccount(account: Account) {
    setAccounts(storage.addAccount(account));
  }

  function handleUpdateAccount(id: string, updates: Partial<Account>) {
    setAccounts(storage.updateAccount(id, updates));
  }

  function handleDeleteAccount(id: string) {
    setAccounts(storage.deleteAccount(id));
  }

  // Watchlist CRUD
  function handleAddWatchlistItem(item: WatchlistItem) {
    setWatchlist(storage.addWatchlistItem(item));
  }

  function handleDeleteWatchlistItem(id: string) {
    setWatchlist(storage.deleteWatchlistItem(id));
  }

  if (!authenticated) {
    return <PinLogin onSuccess={(user) => { setCurrentUser(user); setAuthenticated(true); }} />;
  }

  const editPosition = editId ? positions.find(p => p.id === editId) ?? null : null;
  const closePosition = closeId ? positionsWithMarket.find(p => p.id === closeId) ?? null : null;

  return (
    <>
      {/* Close trade modal */}
      {closePosition && (
        <CloseTradeModal
          position={closePosition}
          onClose={() => setCloseId(null)}
          onConfirm={handleCloseTrade}
        />
      )}

      <Routes>
        <Route
          element={
            <Layout
              onLogout={() => { setAuthenticated(false); setCurrentUser(null); }}
              onRefresh={fetchMarketData}
              onDataChange={loadData}
              lastUpdated={lastUpdated}
              loading={loading}
              alertsOn={alertsOn}
              onToggleAlerts={toggleAlerts}
              alertBanner={alertBanner}
              currentUser={currentUser}
            />
          }
        >
          <Route
            index
            element={<Dashboard positions={positionsWithMarket} accounts={accounts} />}
          />
          <Route
            path="positions"
            element={
              <PositionsTable
                positions={positionsWithMarket}
                accounts={accounts}
                onDelete={handleDeletePosition}
                onEdit={handleEditPosition}
                onClose={(id) => setCloseId(id)}
              />
            }
          />
          <Route
            path="add"
            element={
              <AddPosition
                accounts={accounts}
                onSave={handleSavePosition}
                editPosition={editPosition}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="watchlist"
            element={
              <Watchlist
                items={watchlist}
                quotes={quotes}
                onAdd={handleAddWatchlistItem}
                onDelete={handleDeleteWatchlistItem}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="history"
            element={
              <TradeHistory
                positions={positions}
                accounts={accounts}
              />
            }
          />
          <Route
            path="accounts"
            element={
              <AccountManager
                accounts={accounts}
                positions={positionsWithMarket}
                onAdd={handleAddAccount}
                onUpdate={handleUpdateAccount}
                onDelete={handleDeleteAccount}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}
