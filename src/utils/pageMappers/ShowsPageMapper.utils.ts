import { getGlobalStore } from "~/stores";

type TvShowData = {
  isFollowing?: boolean;
  followNode: HTMLAnchorElement;
  isFavorite?: boolean;
  favoriteNode: HTMLAnchorElement;
  isWatchLater?: boolean;
  watchLaterNode: HTMLAnchorElement;
};

const isActive = (node: Element): boolean => {
  return node.className.includes("active");
};

export const getTvShowStatus = (): Option<TvShowData> => {
  const buttonElements = Array.from(
    document.querySelectorAll("div.content-actions > a")
  ) as HTMLAnchorElement[];

  const followNode = buttonElements.find(
    (element) => element.getAttribute("data-interaction-type") === "f"
  );
  const favoriteNode = buttonElements.find(
    (element) => element.getAttribute("data-interaction-type") === "l"
  );
  const watchLaterNode = buttonElements.find(
    (element) => element.getAttribute("data-interaction-type") === "wl"
  );

  if (!followNode || !favoriteNode || !watchLaterNode) {
    return undefined;
  }

  return {
    isFollowing: isActive(followNode),
    followNode,
    isFavorite: isActive(favoriteNode),
    favoriteNode,
    isWatchLater: isActive(watchLaterNode),
    watchLaterNode,
  };
};

type EpisodeData = {
  id: string;
  dataId: string;
  number: string;
  node: Element;
  isSeasonLastEpisode?: boolean;
  isWatched?: boolean;
};

type SeasonData = {
  season: string;
  seasonDataId: string;
  isTvShowLastSeason?: boolean;
  isSeasonWatched?: boolean;
  seasonNode?: Element;
  nextSeasonHref?: string;
};

export type PageData = EpisodeData & SeasonData;

export const mapEpisodesData = (): {
  currentEpisode?: PageData;
  episodesList: PageData[];
} => {
  let currentEpisode: Option<PageData> = undefined;
  const episodesList: PageData[] = [];

  const tvShowInfo = getGlobalStore().content;

  const episodesArray = Array.from(
    document.querySelectorAll("div.content-episodes > a")
  );

  const seasonList = Array.from(
    document.querySelector("div#seasons div.list")?.children || []
  ).filter(
    (element) =>
      element.className.includes("season") ||
      element.className.includes("open-season")
  );

  const currentSeasonIndex = seasonList.findIndex((element) =>
    element.className.includes("open-season")
  );

  const currentSeasonNode =
    currentSeasonIndex >= 0 ? seasonList[currentSeasonIndex] : undefined;

  const seasonDataId = currentSeasonNode?.getAttribute("data-tvshow-id") || "";
  const isSeasonWatched = currentSeasonNode?.className.includes("seen");

  const nextSeasonHref = currentSeasonNode
    ? seasonList[currentSeasonIndex + 1]?.getAttribute("href") || ""
    : undefined;

  episodesArray.forEach((episode, index) => {
    const episodeDataNode = episode.querySelector("div.episode");

    if (episodeDataNode) {
      const id = episodeDataNode.getAttribute("data-episode-number") || "";
      const dataId = episodeDataNode.getAttribute("data-episode-id") || "";
      const season = episodeDataNode.getAttribute("data-season-id") || "";

      const isWatched = episodeDataNode.className.includes("seen");

      const data = {
        id,
        dataId,
        number: id,
        season,
        node: episodeDataNode,
        seasonDataId,
        isSeasonLastEpisode: index === episodesArray.length - 1,
        isWatched,
        isSeasonWatched,
        seasonNode: currentSeasonNode,
        nextSeasonHref,
      };

      if (data.id && tvShowInfo?.episode && data.id === tvShowInfo.episode) {
        currentEpisode = data;
      }

      episodesList.push(data);
    }
  });

  return {
    currentEpisode,
    episodesList,
  };
};
