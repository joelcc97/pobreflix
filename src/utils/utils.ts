import configs from "../configs";

export enum TypeOfContentEnum {
  MOVIES = "movies",
  SHOWS = "tvshows",
  ANIMES = "animes",
}

export type ContentPlayingType = {
  id: string;
  type: TypeOfContentEnum;
  season?: string;
  episode?: string;
};

export const extractContentInfoFromPath = (
  path: string
): Option<ContentPlayingType> => {
  const cleanUrl = path.split("#")[0].slice(1);

  const info = cleanUrl.split("/");

  const type = Object.values(TypeOfContentEnum).find(
    (value) => value === info[0]
  );

  if (!type || info.length < 2) return undefined;

  return {
    id: info[1],
    type,
    season: info[3],
    episode: info[5],
  };
};

export const getLoggedInUser = (): Option<string> => {
  const userInfo = document.querySelectorAll(
    "div.user div.menu div.username"
  )[0];

  if (!userInfo) return undefined;

  return userInfo.textContent || "";
};

export const resolveTvShowUrl = ({
  showId,
  season,
  episode,
}: {
  showId: string;
  season: string;
  episode?: string;
}): string => {
  if (!episode) {
    return configs.tvshowSeasonLinkTemplate
      .replace("${showId}", showId)
      .replace("${season}", season);
  }

  return configs.tvshowCompleteLinkTemplate
    .replace("${showId}", showId)
    .replace("${season}", season)
    .replace("${episode}", episode);
};
