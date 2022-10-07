export const isProd =
  import.meta.env.PROD && window?.location.host.includes("mmc.com");

export const prefix = window?.location.host.includes("play.") ? "" : "/play";
