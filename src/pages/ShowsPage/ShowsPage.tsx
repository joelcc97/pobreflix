import { Component, createSignal } from "solid-js";
import styles from "./ShowsPage.module.css";
import { getGlobalStore } from "../../stores";
import { resolveTvShowUrl, markEpisodeRead } from "~/utils";

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
  isWatched?: boolean;
};

type TvShowData = {
  isFollowing?: boolean;
  followNode: Element;
  isFavorite?: boolean;
  favoriteNode: Element;
  isWatchLater?: boolean;
  watchLaterNode: Element;
};

export type PageData = EpisodeData & SeasonData;

const isActive = (node: Element): boolean => {
  return node.className.includes("active");
};

const getTvShowData = (): Option<TvShowData> => {
  const buttonElements = Array.from(
    document.querySelectorAll("div.content-actions > a")
  );

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

const ShowsPage: Component<{ hasContentPlayer: boolean }> = ({
  hasContentPlayer,
}) => {
  const [currentContentData, setCurrentContentData] = createSignal<PageData>();
  const tvShowInfo = getGlobalStore().content;

  const episodesArray = Array.from(
    document.querySelectorAll("div.content-episodes > a")
  );

  const currentSeasonNode = document.querySelector(
    "div#seasons div.list div.open-season"
  );

  const mappedPageData: PageData[] = [];

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentShowStatus = getTvShowData();

        if (currentShowStatus && !currentShowStatus.isFollowing) {
          (
            currentShowStatus?.followNode as unknown as { click: () => void }
          ).click();
        }
      }
    });
  });

  const currentSeasonDataId =
    currentSeasonNode?.getAttribute("data-tvshow-id") || "";

  episodesArray.forEach((episode, index) => {
    const episodeDataNode = episode.querySelector("div.episode");

    if (episodeDataNode) {
      observer.observe(episodeDataNode, { attributes: true });

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
        seasonDataId: currentSeasonDataId,
        isSeasonLastEpisode: index === episodesArray.length - 1,
        isWatched,
      };

      if (data.id && tvShowInfo?.episode && data.id === tvShowInfo.episode) {
        setCurrentContentData(data);
      }

      mappedPageData.push(data);
    }
  });

  const handleNextEpisodeClick = (): void => {
    if (!tvShowInfo || !tvShowInfo.season || !tvShowInfo.episode) {
      return;
    }

    //TODO: handle not having next episode
    if (!currentContentData()?.isSeasonLastEpisode) {
      window.location.href = resolveTvShowUrl({
        showId: tvShowInfo.id,
        season: tvShowInfo.season,
        episode: `${parseInt(tvShowInfo.episode) + 1}`,
      });
    }
  };

  const handleToggleWatched = async (data: PageData): Promise<void> => {
    const success = await markEpisodeRead(data.dataId, data.node);

    if (success) {
      setCurrentContentData((prevState) => {
        if (!prevState) return prevState;

        return {
          ...prevState,
          isWatched: !prevState.isWatched,
        };
      });
    }
  };

  return hasContentPlayer ? (
    <div class={styles.Container}>
      <button
        class={styles.Button}
        onClick={(): void => {
          const contentData = currentContentData();
          if (contentData) {
            handleToggleWatched(contentData);
          }
        }}
      >
        {`${currentContentData()?.isWatched ? "Unwatch" : "Mark watched"}`}
      </button>
      <button class={styles.Button} onClick={handleNextEpisodeClick}>
        Next Episode
      </button>
    </div>
  ) : null;
};

export default ShowsPage;
