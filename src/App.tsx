import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { Position, Account, PositionWithMarket, MarketQuote } from './types';
import * as storage from './lib/storage';
import { getQuotes, getEarningsForSymbols } from './lib/finnhub';
import { SEED_POSITIONS, SEED_ACCOUNTS } from './lib/seedData';
import PinLogin from './components/PinLogin';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PositionsTable from './components/PositionsTable';
import AddPosition from './components/AddPosition';
import AccountManager from './components/AccountManager';

export default function App() {
  const [authenticated, setAuthenticated] = useState(storage.isSessionValid());
  const [positions, setPositions] = useState<Position[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [earnings, setEarnings] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load data from storage
  const loadData = useCallback(() => {
    let pos = storage.getPositions();
    let acc = storage.getAccounts();

    // Seed data on first run
    if (pos.length === 0 && acc.length === 0) {
      storage.savePositions(SEED_POSITIONS);
      storage.saveAccounts(SEED_ACCOUNTS);
      pos = SEED_POSITIONS;
      acc = SEED_ACCOUNTS;
    }

    setPositions(pos);
    setAccounts(acc);
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    const openPositions = positions.filter(p => p.status === 'open');
    if (openPositions.length === 0) return;

    setLoading(true);
    try {
      const symbols = [...new Set(openPositions.map(p => p.ticker))];
      const [newQuotes, newEarnings] = await Promise.all([
        getQuotes(symbols),
        getEarningsForSymbols(symbols),
      ]);
      setQuotes(newQuotes);
      setEarnings(prev => ({ ...prev, ...newEarnings }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      // Silently fail — quotes just won't update
    } finally {
      setLoading(false);
    }
  }, [positions]);

  // Initial load
  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  // Fetch market data on load and every 60s
  useEffect(() => {
    if (!authenticated || positions.length === 0) return;

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60_000);
    return () => clearInterval(interval);
  }, [authenticated, positions.length, fetchMarketData]);

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

  if (!authenticated) {
    return <PinLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const editPosition = editId ? positions.find(p => p.id === editId) ?? null : null;

  return (
    <Routes>
      <Route
        element={
          <Layout
            onLogout={() => setAuthenticated(false)}
            onRefresh={fetchMarketData}
            onDataChange={loadData}
            lastUpdated={lastUpdated}
            loading={loading}
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
  );
}
