import { Component, createEffect, createSignal } from "solid-js";
import styles from "./ShowsPage.module.css";
import { getGlobalStore } from "~/stores";
import {
  resolveTvShowUrl,
  markEpisodeRead,
  updateSeasonStatus,
  extractContentInfoFromHref,
} from "~/utils";
import {
  getTvShowStatus,
  mapEpisodesData,
  PageData,
} from "~/utils/pageMappers";

const ShowsPage: Component<{ hasContentPlayer: boolean }> = ({
  hasContentPlayer,
}) => {
  const [pageDataState, setPageDataState] = createSignal<{
    currentEpisode?: PageData;
    episodesList: PageData[];
  }>();

  const tvShowInfo = getGlobalStore().content;
  // const currentShowStatus = getTvShowStatus();

  const pageData = mapEpisodesData();
  setPageDataState(pageData);

  const playerFrameNode = document.querySelector(
    "div#content-player div.player-frame"
  );

  setTimeout(() => {
    if (window.innerWidth < 768) {
      pageDataState()?.currentEpisode?.node?.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  }, 200);

  const [videoPlayer, setVideoPlayer] =
    createSignal<Option<HTMLVideoElement>>();

  createEffect(() => {
    const videoPlayerState = videoPlayer();

    if (videoPlayerState) {
      videoPlayerState.onpause = () => {
        if (
          videoPlayerState.currentTime === videoPlayerState.duration &&
          document.fullscreenEnabled
        ) {
          document.exitFullscreen();
        }
      };
    }
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentShowStatus = getTvShowStatus();

        if (currentShowStatus && !currentShowStatus.isFollowing) {
          currentShowStatus.followNode.click();
        }

        const newEpisodesData = mapEpisodesData();
        setPageDataState(newEpisodesData);
      } else if (
        mutation.type === "childList" &&
        mutation.target === playerFrameNode
      ) {
        setTimeout(() => {
          const videoIframe =
            (document.querySelector(
              "div.player-frame iframe"
            ) as HTMLIFrameElement) || undefined;

          const videoPlayer =
            (videoIframe?.contentDocument?.querySelector(
              "div#customVideoPlayer video"
            ) as HTMLVideoElement) || undefined;

          setVideoPlayer(videoPlayer);
        }, 500);
      }
    });
  });

  if (playerFrameNode) {
    observer.observe(playerFrameNode, { childList: true });
  }

  pageData.episodesList.forEach((episode) => {
    observer.observe(episode.node, { attributes: true });
  });

  const handleNextEpisodeClick = (): void => {
    if (!tvShowInfo || !tvShowInfo.season || !tvShowInfo.episode) {
      return;
    }

    //TODO: handle not having next episode
    const currentPageDataState = pageDataState();
    if (
      !!currentPageDataState?.currentEpisode &&
      !currentPageDataState.currentEpisode.isSeasonLastEpisode
    ) {
      window.location.href = resolveTvShowUrl({
        showId: tvShowInfo.id,
        season: tvShowInfo.season,
        episode: `${parseInt(tvShowInfo.episode) + 1}`,
      });
    } else if (
      !!currentPageDataState?.currentEpisode &&
      currentPageDataState.currentEpisode.isSeasonLastEpisode &&
      currentPageDataState.currentEpisode.nextSeasonHref
    ) {
      const contentInfo = extractContentInfoFromHref(
        currentPageDataState.currentEpisode.nextSeasonHref
      );
      if (contentInfo) {
        window.location.href = resolveTvShowUrl({
          showId: tvShowInfo.id,
          season: contentInfo.season || "",
          episode: "1",
        });
      }
    }
  };

  const handleToggleWatched = async (data: PageData): Promise<void> => {
    const episodeUpdateSuccess = await markEpisodeRead(data.dataId);
    if (!episodeUpdateSuccess) return;

    data.node.classList.toggle("seen");

    const { currentEpisode, episodesList } = mapEpisodesData();
    if (!currentEpisode) return;

    const seasonUpdateSuccess = await updateSeasonStatus(
      currentEpisode,
      episodesList
    );

    if (!seasonUpdateSuccess || !currentEpisode.seasonNode) return;

    currentEpisode.seasonNode.classList.toggle("seen");
  };

  return hasContentPlayer ? (
    <div class={styles.Container}>
      <button
        class={styles.Button}
        onClick={(): void => {
          const contentData = pageDataState()?.currentEpisode;
          if (contentData) {
            handleToggleWatched(contentData);
          }
        }}
      >
        {`${pageDataState()?.currentEpisode?.isWatched
            ? "Unwatch"
            : "Mark watched"
          }`}
      </button>
      <button class={styles.Button} onClick={handleNextEpisodeClick}>
        Next Episode
      </button>
    </div>
  ) : null;
};

export default ShowsPage;
