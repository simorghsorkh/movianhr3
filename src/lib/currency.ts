import type { Language } from '@/lib/types';

export type Currency = 'toman' | 'rial' | 'usd' | 'eur';

export interface CurrencyRates {
  /** 1 USD = how many Toman */
  usdToToman: number;
  /** 1 EUR = how many Toman */
  eurToToman: number;
}

export const DEFAULT_CURRENCY_RATES: CurrencyRates = {
  usdToToman: 60000,
  eurToToman: 65000,
};

export const CURRENCIES: Currency[] = ['toman', 'rial', 'usd', 'eur'];

/** Default currency to display based on the active site language. */
export function defaultCurrencyForLang(lang: Language): Currency {
  if (lang === 'fa') return 'toman';
  if (lang === 'nl') return 'eur';
  return 'usd';
}

export function currencyLabel(currency: Currency, lang: Language): string {
  const fa = lang === 'fa';
  const nl = lang === 'nl';
  switch (currency) {
    case 'toman': return fa ? 'تومان' : nl ? 'Toman' : 'Toman';
    case 'rial': return fa ? 'ریال' : nl ? 'Rial' : 'Rial';
    case 'usd': return fa ? 'دلار' : nl ? 'Dollar' : 'Dollar';
    case 'eur': return fa ? 'یورو' : nl ? 'Euro' : 'Euro';
  }
}

/** Convert an amount expressed in Toman (the app's base unit) to the target currency. */
export function convertFromToman(amountToman: number, currency: Currency, rates: CurrencyRates): number {
  switch (currency) {
    case 'toman': return amountToman;
    case 'rial': return amountToman * 10;
    case 'usd': return rates.usdToToman > 0 ? amountToman / rates.usdToToman : 0;
    case 'eur': return rates.eurToToman > 0 ? amountToman / rates.eurToToman : 0;
  }
}

/** Format a Toman amount as a localized price string in the given currency. */
export function formatPrice(amountToman: number, currency: Currency, rates: CurrencyRates, lang: Language): string {
  const value = convertFromToman(amountToman, currency, rates);
  const fa = lang === 'fa';
  const locale = fa ? 'fa-IR' : undefined;

  switch (currency) {
    case 'toman':
    case 'rial':
      return `${Math.round(value).toLocaleString(locale)} ${currencyLabel(currency, lang)}`;
    case 'usd':
      return `$${value.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
    case 'eur':
      return `€${value.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
  }
}
