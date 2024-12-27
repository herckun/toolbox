import { PASTE_PATH, YOUTUBE_DOWNLOADER_PATH } from "./paths";

export const APP_NAME = "herc's toolbox";
export const APP_NAME_LOGO = "|tool Box";

export const APP_DESCRIPTION = "PasteBin alternative";

export const CREATOR_NAME = "herc";
export const CREATOR_URL = "https://herckun.me";
export const CREATOR_GITHUB = "";
export const CREATOR_TWITTER = "";

export const ENABLED_TOOLS = [
  {
    title: "Paste",
    icon: "mdi:content-paste",
    link: `${PASTE_PATH}`,
  },
  {
    title: "YT Downloader",
    icon: "mdi:youtube",
    link: `${YOUTUBE_DOWNLOADER_PATH}`,
  },
];
