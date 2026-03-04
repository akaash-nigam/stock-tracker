import type { Position, Account } from '../types';
import { generateId } from './utils';

export const SEED_ACCOUNTS: Account[] = [
  { id: 'acc-vishal', name: 'Vishal', type: 'Cash', broker: '', cashBalance: 0, owner: 'Vishal' },
  { id: 'acc-jinesh', name: 'Jinesh', type: 'Cash', broker: '', cashBalance: 0, owner: 'Jinesh' },
  { id: 'acc-hitesh', name: 'Hitesh', type: 'Cash', broker: '', cashBalance: 0, owner: 'Hitesh' },
  { id: 'acc-soham', name: 'Soham', type: 'Cash', broker: '', cashBalance: 0, owner: 'Soham' },
  { id: 'acc-aakash', name: 'Aakash', type: 'Cash', broker: '', cashBalance: 0, owner: 'Aakash' },
  { id: 'acc-sarthak', name: 'Sarthak', type: 'Cash', broker: '', cashBalance: 0, owner: 'Sarthak' },
  { id: 'acc-amrit', name: 'Amrit', type: 'Cash', broker: '', cashBalance: 0, owner: 'Amrit' },
];

export const SEED_POSITIONS: Position[] = [];
