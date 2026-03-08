import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { Position, Account, PositionWithMarket, MarketQuote, WatchlistItem, UserName } from './types';
import * as storage from './lib/storage';
import type { Currency } from './lib/storage';
import { getQuotes, getEarningsForSymbols } from './lib/finnhub';
import { checkAlerts, sendBrowserNotification, requestNotificationPermission, isAlertsEnabled, setAlertsEnabled } from './lib/alerts';
import { SEED_POSITIONS, SEED_ACCOUNTS } from './lib/seedData';
import { TRACKER_CONFIGS, ALL_TRACKER_IDS } from './lib/trackerConfig';
import { useTrackerState } from './hooks/useTrackerState';
import PinLogin from './components/PinLogin';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PositionsTable from './components/PositionsTable';
import AddPosition from './components/AddPosition';
import AccountManager from './components/AccountManager';
import Watchlist from './components/Watchlist';
import TradeHistory from './components/TradeHistory';
import CloseTradeModal from './components/CloseTradeModal';
import InvestorTracker from './components/InvestorTracker';
import { CurrencyProvider } from './lib/CurrencyContext';
import { SEED_BTR_ALERTS, SEED_BTR_HOLDINGS, SEED_BTR_REPORT } from './lib/btrSeedData';
import { SEED_CRAMER_ALERTS, SEED_CRAMER_HOLDINGS, SEED_CRAMER_REPORT } from './lib/cramerSeedData';
import { SEED_PELOSI_ALERTS, SEED_PELOSI_HOLDINGS, SEED_PELOSI_REPORT } from './lib/pelosiSeedData';
import { SEED_BURRY_ALERTS, SEED_BURRY_HOLDINGS, SEED_BURRY_REPORT } from './lib/burrySeedData';
import { SEED_PINETREE_ALERTS, SEED_PINETREE_HOLDINGS, SEED_PINETREE_REPORT } from './lib/pinetreeSeedData';

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
  const [currency, setCurrency] = useState<Currency>(storage.getCurrency());
  const navigate = useNavigate();

  // Tracker state via custom hooks
  const beartraps = useTrackerState('btr');
  const cramer = useTrackerState('cramer');
  const pelosi = useTrackerState('pelosi');
  const burry = useTrackerState('burry');
  const pinetree = useTrackerState('pinetree');
  const trackers = { beartraps, cramer, pelosi, burry, pinetree };
  const allTrackerStates = [beartraps, cramer, pelosi, burry, pinetree];

  // Load data from storage
  const loadData = useCallback(() => {
    let pos = storage.getPositions();
    let acc = storage.getAccounts();

    if (acc.length === 0) {
      storage.saveAccounts(SEED_ACCOUNTS);
      acc = SEED_ACCOUNTS;
    }

    setPositions(pos);
    setAccounts(acc);
    setWatchlist(storage.getWatchlist());

    // Load all tracker data with seeds
    beartraps.load(SEED_BTR_ALERTS, SEED_BTR_HOLDINGS, SEED_BTR_REPORT);
    cramer.load(SEED_CRAMER_ALERTS, SEED_CRAMER_HOLDINGS, SEED_CRAMER_REPORT);
    pelosi.load(SEED_PELOSI_ALERTS, SEED_PELOSI_HOLDINGS, SEED_PELOSI_REPORT);
    burry.load(SEED_BURRY_ALERTS, SEED_BURRY_HOLDINGS, SEED_BURRY_REPORT);
    pinetree.load(SEED_PINETREE_ALERTS, SEED_PINETREE_HOLDINGS, SEED_PINETREE_REPORT);
  }, [beartraps.load, cramer.load, pelosi.load, burry.load, pinetree.load]);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    const openPositions = positions.filter(p => p.status === 'open');
    const watchlistTickers = watchlist.map(w => w.ticker);
    const trackerTickers = allTrackerStates.flatMap(t => t.tickers);
    const allSymbols = [...new Set([...openPositions.map(p => p.ticker), ...watchlistTickers, ...trackerTickers])];
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

      // Save portfolio snapshot
      const openPos = positions.filter(p => p.status === 'open');
      const totalInvested = openPos.reduce((s, p) => s + p.entryPrice * p.quantity, 0);
      const totalValue = openPos.reduce((s, p) => {
        const price = newQuotes[p.ticker]?.c;
        return s + (price ? price * p.quantity : p.entryPrice * p.quantity);
      }, 0);
      if (totalInvested > 0) {
        storage.saveSnapshot({
          date: new Date().toISOString().slice(0, 10),
          totalValue,
          totalInvested,
          pnl: totalValue - totalInvested,
        });
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [positions, watchlist, ...allTrackerStates.map(t => t.tickers)]);

  // Initial load
  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  // Fetch market data on load and every 60s
  const hasData = positions.length > 0 || watchlist.length > 0 || allTrackerStates.some(t => t.holdings.length > 0);
  useEffect(() => {
    if (!authenticated || !hasData) return;

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60_000);
    return () => clearInterval(interval);
  }, [authenticated, hasData, fetchMarketData]);

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
    <CurrencyProvider value={currency}>
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
              currency={currency}
              onCurrencyChange={setCurrency}
              onApiKeyChange={fetchMarketData}
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
          {/* Investor Tracker routes */}
          {ALL_TRACKER_IDS.map(id => {
            const tracker = trackers[id];
            const config = TRACKER_CONFIGS[id];
            return (
              <Route
                key={id}
                path={config.route.slice(1)}
                element={
                  <InvestorTracker
                    config={config}
                    alerts={tracker.alerts}
                    holdings={tracker.holdings}
                    reports={tracker.reports}
                    quotes={quotes}
                    onSaveAlerts={tracker.saveAlerts}
                    onSaveHoldings={tracker.saveHoldings}
                    onSaveReports={tracker.saveReports}
                  />
                }
              />
            );
          })}
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
    </CurrencyProvider>
  );
}
