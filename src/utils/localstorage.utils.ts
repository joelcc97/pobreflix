export const STORE_KEY = "pobreflix";

type ShowCommonType = {
  number: number;
  href?: string;
  watched: boolean;
};

export type ShowEpisodeType = ShowCommonType & {
  seasonNumber: number;
  episodeDataId: string;
};

export type ShowSeasonType = ShowCommonType & {
  episodes: ShowEpisodeType[];
  dataTvShowId?: string;
};

export type ShowStorageType = {
  id: string;
  href?: string;
  seasons: ShowSeasonType[];
};

export type LocalStorageType = {
  shows?: Map<string, ShowStorageType>;
};

export function getLocalStorage(): Option<LocalStorageType> {
  const rawData = localStorage.getItem(STORE_KEY);
  if (!rawData) return undefined;
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
    setLocalStorage({});
    return {};
  }

  return localStorageData;
}
