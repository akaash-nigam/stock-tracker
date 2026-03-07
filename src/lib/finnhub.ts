import type { MarketQuote } from '../types';
import { getFinnhubApiKey } from './storage';

function getApiKey(): string | undefined {
  return getFinnhubApiKey() ?? (import.meta.env.VITE_FINNHUB_API_KEY as string | undefined) ?? undefined;
}

const BASE_URL = 'https://finnhub.io/api/v1';

// Simple rate limiter: max 55 calls/min (leave buffer from 60 limit)
let callTimestamps: number[] = [];

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  callTimestamps = callTimestamps.filter(t => now - t < 60_000);
  if (callTimestamps.length >= 55) {
    const waitUntil = callTimestamps[0]! + 60_000;
    await new Promise(r => setTimeout(r, waitUntil - now + 100));
  }
  callTimestamps.push(Date.now());
  return fetch(url);
}

export async function getQuote(symbol: string): Promise<MarketQuote | null> {
  const key = getApiKey();
  if (!key) return null;
  try {
    const res = await rateLimitedFetch(`${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Finnhub returns c=0 for invalid symbols
    if (data.c === 0 && data.d === null) return null;
    return data as MarketQuote;
  } catch {
    return null;
  }
}

export async function getQuotes(symbols: string[]): Promise<Record<string, MarketQuote>> {
  const results: Record<string, MarketQuote> = {};
  // Fetch in batches of 10 to stay within rate limits
  const batchSize = 10;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(async (symbol) => {
      const quote = await getQuote(symbol);
      if (quote) results[symbol] = quote;
    });
    await Promise.all(promises);
  }
  return results;
}

interface EarningsCalendarResponse {
  earningsCalendar: Array<{
    symbol: string;
    date: string;
    hour: string;
    epsEstimate: number | null;
    epsActual: number | null;
    revenueEstimate: number | null;
    revenueActual: number | null;
  }>;
}

export async function getEarningsCalendar(
  from: string,
  to: string
): Promise<Record<string, string>> {
  const key = getApiKey();
  if (!key) return {};
  try {
    const res = await rateLimitedFetch(
      `${BASE_URL}/calendar/earnings?from=${from}&to=${to}&token=${key}`
    );
    if (!res.ok) return {};
    const data: EarningsCalendarResponse = await res.json();
    const map: Record<string, string> = {};
    for (const e of data.earningsCalendar) {
      // Keep the earliest upcoming date per symbol
      if (!map[e.symbol] || e.date < map[e.symbol]!) {
        map[e.symbol] = e.date;
      }
    }
    return map;
  } catch {
    return {};
  }
}

// Fetch earnings for specific symbols (uses per-symbol endpoint)
export async function getEarningsForSymbols(symbols: string[]): Promise<Record<string, string>> {
  if (!getApiKey()) return {};
  // Use calendar endpoint with date range (more efficient — 1 call)
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + 90);
  const to = futureDate.toISOString().slice(0, 10);

  const allEarnings = await getEarningsCalendar(from, to);

  // Filter to only requested symbols
  const result: Record<string, string> = {};
  const symbolSet = new Set(symbols.map(s => s.toUpperCase()));
  for (const [symbol, date] of Object.entries(allEarnings)) {
    if (symbolSet.has(symbol.toUpperCase())) {
      result[symbol] = date;
    }
  }
  return result;
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}
