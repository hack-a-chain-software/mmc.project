export const isProd =
  import.meta.env.PROD && window?.location.host.includes("mmc.com");

export const prefix = window?.location.host.includes("play.") ? "" : "/play";

export const loadSceneImage = (url, callback) => {
  const image = new Image();
  image.src = url;
  image.onload = callback;
};
