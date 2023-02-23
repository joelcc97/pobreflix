export type ConfigType = {
  baseUrl: string;
  pages: string[];
  excludedPages: string[];
};

const configs: Readonly<ConfigType> = {
  baseUrl: "https://www3.pobre.wtf",
  pages: ["movies", "tvshows", "animes"],
  excludedPages: ["play"],
};

export default configs;
