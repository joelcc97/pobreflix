export const STORE_KEY = "pobreflix";

export type ShowWatchConfigType = {
  introDuration: number;
  outroDuration: number;
  autoSkipIntro: boolean;
  autoPlay: boolean;
  autoMarkWatched: boolean;
};

export type ShowEpisodeType = {
  episodeNumber: number;
  seasonNumber: number;
  episodeDataId: string;
  watched: boolean;
};

export type ShowSeasonType = {
  seasonNumber: number;
  episodes: ShowEpisodeType[];
  seasonDataId?: string;
  watched: boolean;
};

export type ShowStorageType = {
  id: string;
  seasons: ShowSeasonType[];
  watchConfig?: ShowWatchConfigType;
};

export type LocalStorageType = {
  shows?: Map<string, ShowStorageType>;
};

export function getLocalStorage(): Option<LocalStorageType> {
  const rawData = localStorage.getItem(STORE_KEY);
  if (!rawData || rawData === "{}") return undefined;
  try {
    const parsedData = JSON.parse(rawData) as LocalStorageType;
    return parsedData;
  } catch {
    return undefined;
  }
}

export function setLocalStorage(newData: LocalStorageType): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(newData));
}

export function initialStorageLoad(): LocalStorageType {
  const localStorageData = getLocalStorage();

  if (!localStorageData) {
    const initialStorage = { shows: new Map<string, ShowStorageType>() };
    setLocalStorage(initialStorage);
    return initialStorage;
  }

  return localStorageData;
}
