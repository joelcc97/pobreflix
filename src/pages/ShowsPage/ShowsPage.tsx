import { Component } from "solid-js";
import styles from "./ShowsPage.module.css";
import { getGlobalStore } from "../../stores";
import { resolveTvShowUrl, EpisodeData, markEpisodeRead } from "~/utils";

const ShowsPage: Component<{ hasContentPlayer: boolean }> = ({
  hasContentPlayer,
}) => {
  const tvShowInfo = getGlobalStore().content;

  const episodesArray = Array.from(
    document.querySelectorAll("div.content-episodes > a")
  );

  const currentSeasonNode = document.querySelector(
    "div#seasons div.list div.open-season"
  );

  const mappedEpisodeData: EpisodeData[] = [];

  let currentEpisodeData: Option<EpisodeData>;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        console.log("TODO - sync local storage with new information");
      }
    });
  });

  const currentSeasonDataId = currentSeasonNode?.getAttribute("data-tvshow-id");

  episodesArray.forEach((episode) => {
    const episodeDataNode = episode.querySelector("div.episode");

    if (episodeDataNode) {
      observer.observe(episodeDataNode, { attributes: true });

      const id = episodeDataNode.getAttribute("data-episode-number") || "";
      const dataId = episodeDataNode.getAttribute("data-episode-id") || "";
      const season = episodeDataNode.getAttribute("data-season-id") || "";

      const data = {
        id,
        dataId,
        number: id,
        season,
        node: episodeDataNode,
        seasonDataId: currentSeasonDataId || "",
      };

      if (data.id && tvShowInfo?.episode && data.id === tvShowInfo.episode) {
        currentEpisodeData = data;
      }

      mappedEpisodeData.push(data);
    }
  });

  const handleNextEpisodeClick = (): void => {
    if (!tvShowInfo || !tvShowInfo.season || !tvShowInfo.episode) {
      return;
    }

    //TODO: handle not having next episode

    window.location.href = resolveTvShowUrl({
      showId: tvShowInfo.id,
      season: tvShowInfo.season,
      episode: `${parseInt(tvShowInfo.episode) + 1}`,
    });
  };

  return hasContentPlayer ? (
    <div class={styles.Container}>
      <button
        class={styles.Button}
        onClick={(): void => {
          if (currentEpisodeData) {
            markEpisodeRead(currentEpisodeData);
          }
        }}
      >
        Mark watched
      </button>
      <button class={styles.Button} onClick={handleNextEpisodeClick}>
        Next Episode
      </button>
    </div>
  ) : null;
};

export default ShowsPage;
