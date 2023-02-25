import config from "../configs";
import { getGlobalStore } from "../stores/global/GlobalStore";

export type FollowingContentType = {
  id: string;
  item: Element;
  href: string;
};

export const loadFollowingContent = async (): Promise<
  FollowingContentType[]
> => {
  const data = await fetch(
    `${config.baseUrl}/profile/${getGlobalStore().username || ""}/t-f`
  );

  const html = await data.text();

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(html, "text/html");

  const following = parsedDocument.querySelectorAll(
    "div#content-listing > a.item-poster"
  );

  const continueWatchingContent = Array.from(following).map((item) => {
    const href = item.getAttribute("href") || "";
    const refSplit = href.split("/");
    const id = refSplit[refSplit.length - 1];

    return {
      id,
      item,
      href,
    };
  });

  return continueWatchingContent;
};
