import type { PositionWithMarket } from '../types';

const ALERTS_DISMISSED_KEY = 'st_alerts_dismissed';
const ALERTS_ENABLED_KEY = 'st_alerts_enabled';

export function isAlertsEnabled(): boolean {
  return localStorage.getItem(ALERTS_ENABLED_KEY) === 'true';
}

export function setAlertsEnabled(enabled: boolean): void {
  localStorage.setItem(ALERTS_ENABLED_KEY, enabled ? 'true' : 'false');
}

function getDismissedAlerts(): Set<string> {
  const raw = localStorage.getItem(ALERTS_DISMISSED_KEY);
  if (!raw) return new Set();
  try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
}

function dismissAlert(key: string): void {
  const dismissed = getDismissedAlerts();
  dismissed.add(key);
  localStorage.setItem(ALERTS_DISMISSED_KEY, JSON.stringify([...dismissed]));
  // Auto-clear old dismissals after 24h
  setTimeout(() => {
    const current = getDismissedAlerts();
    current.delete(key);
    localStorage.setItem(ALERTS_DISMISSED_KEY, JSON.stringify([...current]));
  }, 24 * 60 * 60 * 1000);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export interface AlertEvent {
  ticker: string;
  type: 'stop_loss' | 'target_hit' | 'near_stop';
  message: string;
  price: number;
  threshold: number;
}

export function checkAlerts(positions: PositionWithMarket[]): AlertEvent[] {
  if (!isAlertsEnabled()) return [];

  const dismissed = getDismissedAlerts();
  const alerts: AlertEvent[] = [];

  for (const p of positions) {
    if (p.status !== 'open' || p.currentPrice === null) continue;

    // Stop loss hit
    if (p.stopLoss > 0 && p.currentPrice <= p.stopLoss) {
      const key = `stop_${p.ticker}_${p.stopLoss}`;
      if (!dismissed.has(key)) {
        alerts.push({
          ticker: p.ticker,
          type: 'stop_loss',
          message: `${p.ticker} hit stop loss at $${p.stopLoss.toFixed(2)}! Current: $${p.currentPrice.toFixed(2)}`,
          price: p.currentPrice,
          threshold: p.stopLoss,
        });
        dismissAlert(key);
      }
    }

    // Target hit
    if (p.targetPrice > 0 && p.currentPrice >= p.targetPrice) {
      const key = `target_${p.ticker}_${p.targetPrice}`;
      if (!dismissed.has(key)) {
        alerts.push({
          ticker: p.ticker,
          type: 'target_hit',
          message: `${p.ticker} hit target at $${p.targetPrice.toFixed(2)}! Current: $${p.currentPrice.toFixed(2)}`,
          price: p.currentPrice,
          threshold: p.targetPrice,
        });
        dismissAlert(key);
      }
    }

    // Near stop loss (within 3%)
    if (p.stopLoss > 0 && p.currentPrice > p.stopLoss) {
      const distPct = ((p.currentPrice - p.stopLoss) / p.currentPrice) * 100;
      if (distPct < 3) {
        const key = `near_${p.ticker}_${Math.floor(Date.now() / (4 * 3600_000))}`; // re-alert every 4 hours
        if (!dismissed.has(key)) {
          alerts.push({
            ticker: p.ticker,
            type: 'near_stop',
            message: `${p.ticker} is ${distPct.toFixed(1)}% from stop loss ($${p.stopLoss.toFixed(2)})`,
            price: p.currentPrice,
            threshold: p.stopLoss,
          });
          dismissAlert(key);
        }
      }
    }
  }

  return alerts;
}

export function sendBrowserNotification(alert: AlertEvent): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const icon = alert.type === 'target_hit' ? '🎯' : alert.type === 'stop_loss' ? '🛑' : '⚠️';
  const title = alert.type === 'target_hit'
    ? `Target Hit: ${alert.ticker}`
    : alert.type === 'stop_loss'
    ? `Stop Loss: ${alert.ticker}`
    : `Warning: ${alert.ticker}`;

  new Notification(`${icon} ${title}`, {
    body: alert.message,
    tag: `${alert.ticker}-${alert.type}`,
  });
}
