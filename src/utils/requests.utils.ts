import configs from "~/configs";
import { PageData } from "~/utils/pageMappers";

export type ContentType = "ep" | "s-s";

export async function markEpisodeRead(
  dataId: string,
  contentType: ContentType = "ep"
): Promise<boolean> {
  try {
    const result = await fetch(
      `${configs.baseUrl}interaction?content_id=${dataId}&content_type=${contentType}&interaction_type=w`,
      {
        method: "POST",
        headers: {
          "x-requested-with": "XMLHttpRequest",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "application/json, text/javascript, */*; q=0.01",
        },
      }
    );

    const responseJson = await result.json();

    if (responseJson.success) {
      return true;
    } else {
      throw new Error();
    }
  } catch {
    console.error("Episode read status operation failed");
    return false;
  }
}

export async function updateSeasonStatus(
  currentEpisode: PageData,
  episodesList: PageData[]
): Promise<boolean> {
  try {
    const unwatchedEpisodes = episodesList.filter(
      (episode) => !episode.isWatched
    );

    if (
      (unwatchedEpisodes.length === 0 && !currentEpisode.isSeasonWatched) ||
      (unwatchedEpisodes.length === 1 && currentEpisode.isSeasonWatched)
    ) {
      const seasonUpdateSuccess = await markEpisodeRead(
        `${currentEpisode.seasonDataId}-${currentEpisode.season}`,
        "s-s"
      );

      if (seasonUpdateSuccess) {
        return true;
      } else {
        throw new Error();
      }
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
