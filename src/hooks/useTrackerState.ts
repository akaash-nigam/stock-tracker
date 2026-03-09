import { useState, useCallback, useMemo } from 'react';
import type { TrackerAlert, TrackerHolding, TrackerReport } from '../types';
import * as storage from '../lib/storage';

export interface TrackerState {
  alerts: TrackerAlert[];
  holdings: TrackerHolding[];
  reports: TrackerReport[];
  saveAlerts: (alerts: TrackerAlert[]) => void;
  saveHoldings: (holdings: TrackerHolding[]) => void;
  saveReports: (reports: TrackerReport[]) => void;
  load: (seedAlerts: TrackerAlert[], seedHoldings: TrackerHolding[], seedReport: TrackerReport) => void;
  tickers: string[];
}

export function useTrackerState(storagePrefix: string): TrackerState {
  const [alerts, setAlerts] = useState<TrackerAlert[]>([]);
  const [holdings, setHoldings] = useState<TrackerHolding[]>([]);
  const [reports, setReports] = useState<TrackerReport[]>([]);

  const load = useCallback((seedAlerts: TrackerAlert[], seedHoldings: TrackerHolding[], seedReport: TrackerReport) => {
    let a = storage.getTrackerAlerts(storagePrefix);
    let h = storage.getTrackerHoldings(storagePrefix);
    let r = storage.getTrackerReports(storagePrefix);
    if (a.length === 0 && h.length === 0) {
      storage.saveTrackerAlerts(storagePrefix, seedAlerts);
      storage.saveTrackerHoldings(storagePrefix, seedHoldings);
      storage.saveTrackerReports(storagePrefix, [seedReport]);
      a = seedAlerts;
      h = seedHoldings;
      r = [seedReport];
    }
    setAlerts(a);
    setHoldings(h);
    setReports(r);
  }, [storagePrefix]);

  const saveAlerts = useCallback((newAlerts: TrackerAlert[]) => {
    storage.saveTrackerAlerts(storagePrefix, newAlerts);
    setAlerts(newAlerts);
  }, [storagePrefix]);

  const saveHoldings = useCallback((newHoldings: TrackerHolding[]) => {
    storage.saveTrackerHoldings(storagePrefix, newHoldings);
    setHoldings(newHoldings);
  }, [storagePrefix]);

  const saveReports = useCallback((newReports: TrackerReport[]) => {
    storage.saveTrackerReports(storagePrefix, newReports);
    setReports(newReports);
  }, [storagePrefix]);

  const tickers = useMemo(
    () => [...new Set([...holdings.map(h => h.ticker), ...alerts.slice(0, 20).map(a => a.ticker)])],
    [holdings, alerts]
  );

  return { alerts, holdings, reports, saveAlerts, saveHoldings, saveReports, load, tickers };
}
