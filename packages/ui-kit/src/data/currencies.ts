/**
 * Currency definitions — shared with the web kit.
 * Used by CurrencyInput.
 */

export type Currency = {
  code: string;
  symbol?: string;
  decimals: number;
  name?: string;
};

export const CURRENCIES: Record<string, Currency> = {
  EUR: { code: 'EUR', symbol: '€', decimals: 2, name: 'Euro' },
  USD: { code: 'USD', symbol: '$', decimals: 2, name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', decimals: 2, name: 'British Pound' },
  MAD: { code: 'MAD', decimals: 2, name: 'Moroccan Dirham' },
  TND: { code: 'TND', decimals: 3, name: 'Tunisian Dinar' },
  DZD: { code: 'DZD', decimals: 2, name: 'Algerian Dinar' },
  EGP: { code: 'EGP', symbol: 'ج.م', decimals: 2, name: 'Egyptian Pound' },
  CHF: { code: 'CHF', decimals: 2, name: 'Swiss Franc' },
  CAD: { code: 'CAD', symbol: '$', decimals: 2, name: 'Canadian Dollar' },
  JPY: { code: 'JPY', symbol: '¥', decimals: 0, name: 'Japanese Yen' },
  XOF: { code: 'XOF', decimals: 0, name: 'West African CFA Franc' },
  XAF: { code: 'XAF', decimals: 0, name: 'Central African CFA Franc' },
};

export const HR_COMMON_CURRENCIES: Currency[] = [
  CURRENCIES.EUR,
  CURRENCIES.USD,
  CURRENCIES.GBP,
  CURRENCIES.MAD,
  CURRENCIES.TND,
  CURRENCIES.DZD,
  CURRENCIES.CHF,
];
