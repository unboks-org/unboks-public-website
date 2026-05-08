import { useEffect, useState } from 'react';

export type Currency = 'XCG' | 'USD' | 'EUR';

export const CURRENCIES: Currency[] = ['XCG', 'USD', 'EUR'];

const SYMBOL: Record<Currency, string> = { XCG: 'XCG', USD: '$', EUR: '€' };

// Fallback: XCG units per 1 unit of source currency. XCG is pegged ~1.79 to USD.
const FALLBACK_XCG_PER_USD = 1.79;
const FALLBACK_XCG_PER_EUR = 2.12;

const LS_RATES = 'unboks_fx_rates_v2';
const LS_CURRENCY = 'unboks_currency';
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

type RateCache = { fetchedAt: number; xcgPerUsd: number; xcgPerEur: number };

export type Rates = { xcgPerUsd: number; xcgPerEur: number; live: boolean };

export function getInitialCurrency(): Currency {
  try {
    const v = localStorage.getItem(LS_CURRENCY);
    if (v === 'XCG' || v === 'USD' || v === 'EUR') return v;
  } catch {}
  return 'XCG';
}

export function saveCurrency(c: Currency) {
  try { localStorage.setItem(LS_CURRENCY, c); } catch {}
}

function readCache(): RateCache | null {
  try {
    const raw = localStorage.getItem(LS_RATES);
    if (!raw) return null;
    const j = JSON.parse(raw) as RateCache;
    if (!j || typeof j.fetchedAt !== 'number') return null;
    if (Date.now() - j.fetchedAt > TTL_MS) return null;
    if (!Number.isFinite(j.xcgPerUsd) || !Number.isFinite(j.xcgPerEur)) return null;
    return j;
  } catch { return null; }
}

function writeCache(c: RateCache) {
  try { localStorage.setItem(LS_RATES, JSON.stringify(c)); } catch {}
}

export function useExchangeRates(): Rates {
  const [rates, setRates] = useState<Rates>(() => {
    const c = readCache();
    if (c) return { xcgPerUsd: c.xcgPerUsd, xcgPerEur: c.xcgPerEur, live: true };
    return { xcgPerUsd: FALLBACK_XCG_PER_USD, xcgPerEur: FALLBACK_XCG_PER_EUR, live: false };
  });

  useEffect(() => {
    if (readCache()) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!r.ok) return;
        const j: any = await r.json();
        const rawXcg = Number(j?.rates?.XCG) || Number(j?.rates?.ANG);
        const eurPerUsd = Number(j?.rates?.EUR);
        if (!Number.isFinite(rawXcg) || rawXcg <= 0) return;
        if (!Number.isFinite(eurPerUsd) || eurPerUsd <= 0) return;
        const xcgPerUsd = rawXcg;
        const xcgPerEur = rawXcg / eurPerUsd;
        if (cancelled) return;
        writeCache({ fetchedAt: Date.now(), xcgPerUsd, xcgPerEur });
        setRates({ xcgPerUsd, xcgPerEur, live: true });
      } catch {
        /* keep fallback silently */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return rates;
}

export function formatPrice(xcg: number, currency: Currency, rates: Rates): string {
  if (currency === 'XCG') {
    return `XCG ${xcg.toLocaleString('en-US')}`;
  }
  const divisor = currency === 'USD' ? rates.xcgPerUsd : rates.xcgPerEur;
  const converted = Math.round(xcg / divisor);
  return `${SYMBOL[currency]}${converted.toLocaleString('en-US')}`;
}

export function formatAddonPrice(xcgPerMonth: number, currency: Currency, rates: Rates, perMonthLabel: string): string {
  return `${formatPrice(xcgPerMonth, currency, rates)}${perMonthLabel}`;
}
