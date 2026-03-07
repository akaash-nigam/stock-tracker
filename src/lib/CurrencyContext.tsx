import { createContext, useContext } from 'react';
import type { Currency } from './storage';

const CurrencyContext = createContext<Currency>('USD');

export const CurrencyProvider = CurrencyContext.Provider;

export function useCurrency(): Currency {
  return useContext(CurrencyContext);
}
