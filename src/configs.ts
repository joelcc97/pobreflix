export type ConfigType = {
  baseUrl: string;
  pages: string[];
  excludedPages: string[];
  tvshowCompleteLinkTemplate: string;
  tvshowSeasonLinkTemplate: string;
  scriptVersion: string;
};

const configs: Readonly<ConfigType> = {
  baseUrl: "https://www3.pobre.wtf/",
  pages: ["movies", "tvshows", "animes"],
  excludedPages: ["play"],
  tvshowCompleteLinkTemplate:
    "https://www3.pobre.wtf/tvshows/${showId}/season/${season}/episode/${episode}#content-player",
  tvshowSeasonLinkTemplate:
    "https://www3.pobre.wtf/tvshows/${showId}/season/${season}",
  scriptVersion: "0.0.8",
};

export default configs;
