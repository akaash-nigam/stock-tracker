import type { Position, Account } from '../types';
import { generateId } from './utils';

export const SEED_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'Main Trading', type: 'Margin', broker: 'IBKR', cashBalance: 10000, owner: 'Shared' },
  { id: 'acc-2', name: 'TFSA', type: 'TFSA', broker: 'Wealthsimple', cashBalance: 5000, owner: 'Shared' },
  { id: 'acc-3', name: 'RRSP', type: 'RRSP', broker: 'TD', cashBalance: 3000, owner: 'Shared' },
];

export const SEED_POSITIONS: Position[] = [
  // AI & Infra
  { id: generateId(), ticker: 'FORM', theme: 'AI & Infra', specificTrend: 'Memory Manufacturing & Photonics', strategy: 'Trend Following', entryPrice: 94.70, targetPrice: 125, stopLoss: 88.35, quantity: 52, accountId: 'acc-1', rationale: 'Strong industry catalyst', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'VRT', theme: 'AI & Infra', specificTrend: 'Data Center Cooling', strategy: 'Trend Following', entryPrice: 207.40, targetPrice: 350, stopLoss: 170, quantity: 24, accountId: 'acc-1', rationale: 'Market leader in DC cooling', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'AMKR', theme: 'AI & Infra', specificTrend: 'Chip Fab', strategy: 'Trend Following', entryPrice: 50, targetPrice: 75, stopLoss: 40, quantity: 98, accountId: 'acc-1', rationale: 'Domestic Chip Packaging Leader', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'PANW', theme: 'AI & Infra', specificTrend: 'Cybersecurity', strategy: 'Trend Following', entryPrice: 166.04, targetPrice: 200, stopLoss: 150, quantity: 30, accountId: 'acc-2', rationale: 'Cybersecurity leader', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'CRWD', theme: 'AI & Infra', specificTrend: 'Cybersecurity', strategy: 'Trend Following', entryPrice: 409.12, targetPrice: 500, stopLoss: 390, quantity: 12, accountId: 'acc-2', rationale: 'Cloud security dominance', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'CIEN', theme: 'AI & Infra', specificTrend: 'Pure Play Fibre', strategy: 'Trend Following', entryPrice: 294.88, targetPrice: 320, stopLoss: 280, quantity: 17, accountId: 'acc-1', rationale: 'Fibre networking backbone', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  // Energy & Resources
  { id: generateId(), ticker: 'ENS', theme: 'Energy & Resources', specificTrend: 'Energy Storage', strategy: 'Trend Following', entryPrice: 176.47, targetPrice: 210, stopLoss: 150, quantity: 30, accountId: 'acc-3', rationale: 'Bedrock for data center developments', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'DOW', theme: 'Energy & Resources', specificTrend: 'Chemicals', strategy: 'Trend Following', entryPrice: 32.10, targetPrice: 50, stopLoss: 28, quantity: 150, accountId: 'acc-3', rationale: 'Chemicals for core economic dev', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  { id: generateId(), ticker: 'URA', theme: 'Energy & Resources', specificTrend: 'Nuclear Play', strategy: 'Trend Following', entryPrice: 54.25, targetPrice: 60, stopLoss: 49.11, quantity: 92, accountId: 'acc-1', rationale: 'Broad based nuclear energy play', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  // Autonomy & Frontier
  { id: generateId(), ticker: 'OSS', theme: 'Autonomy & Frontier', specificTrend: 'Edge Computing', strategy: 'Trend Following', entryPrice: 9.79, targetPrice: 15, stopLoss: 8, quantity: 508, accountId: 'acc-1', rationale: 'Edge computing modules for AI workflows', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
  // Socio-Econ
  { id: generateId(), ticker: 'GLDD', theme: 'Socio-Econ', specificTrend: 'Infrastructure', strategy: 'Trend Following', entryPrice: 16.17, targetPrice: 25, stopLoss: 13, quantity: 309, accountId: 'acc-2', rationale: 'Infrastructure buildout play', mood: 'Calm', status: 'open', createdAt: new Date().toISOString() },
];
