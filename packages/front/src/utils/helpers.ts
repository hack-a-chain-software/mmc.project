import Big from 'big.js';

export const isProd =
  import.meta.env.PROD && window?.location.host.includes("mmc.com");

export const prefix = window?.location.host.includes("play.") ? "" : "/play";

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
  decimals: Big
) {
  return new Big(value).div(decimals).toFixed(2);
}


export const getUTCDate = (timestamp: number = Date.now()) => {
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
