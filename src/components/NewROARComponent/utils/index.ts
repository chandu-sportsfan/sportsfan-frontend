export const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
