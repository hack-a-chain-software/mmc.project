import Big from 'big.js';

export const loadSceneImage = (url, callback) => {
  const image = new Image();
  image.src = url;
  image.onload = callback;
};

export function getDecimals(decimals: number | undefined) {
  return Big(10).pow(decimals || 1);
}

export function formatBigNumberWithDecimals(
  value: string | number | Big,
  decimals: Big,
) {
  return new Big(value).div(decimals).toFixed(2);
}


export const getUTCDate = (timestamp: number = Date.now()): Date => {
  const date = new Date(timestamp);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};

export const getPages = (total, limit) => {
  const base = Number(total) / limit;

  if (!base || base < 1) {
    return 1;
  }

  if (base % 1 !== 0) {
    return base + 1;
  }

  return base;
};
