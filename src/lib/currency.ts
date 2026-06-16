import type { Language } from '@/lib/types';

export type Currency = 'toman' | 'rial' | 'usd' | 'eur';

/** A price expressed independently in each supported currency (admin enters each value directly). */
export interface PriceSet {
  rial: number;
  usd: number;
  eur: number;
}

export const EMPTY_PRICE: PriceSet = { rial: 0, usd: 0, eur: 0 };

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

export function isZeroPrice(price: PriceSet): boolean {
  return price.rial === 0 && price.usd === 0 && price.eur === 0;
}

export function addPrices(a: PriceSet, b: PriceSet): PriceSet {
  return { rial: a.rial + b.rial, usd: a.usd + b.usd, eur: a.eur + b.eur };
}

export function scalePrice(price: PriceSet, factor: number): PriceSet {
  return { rial: price.rial * factor, usd: price.usd * factor, eur: price.eur * factor };
}

/** Format a PriceSet's value for the given currency as a localized price string. */
export function formatPrice(price: PriceSet, currency: Currency, lang: Language): string {
  const fa = lang === 'fa';
  const locale = fa ? 'fa-IR' : undefined;

  switch (currency) {
    case 'rial':
      return `${Math.round(price.rial).toLocaleString(locale)} ${currencyLabel('rial', lang)}`;
    case 'toman':
      return `${Math.round(price.rial / 10).toLocaleString(locale)} ${currencyLabel('toman', lang)}`;
    case 'usd':
      return `$${price.usd.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
    case 'eur':
      return `€${price.eur.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
  }
}
