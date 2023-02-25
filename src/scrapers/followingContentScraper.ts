import config from "~/configs";
import { getGlobalStore } from "~/stores";
import { getParsedDocumentFromUrl } from "~/utils";

export type FollowingContentType = {
  id: string;
  item: Element;
  href: string;
};

export const loadFollowingContent = async (): Promise<
  FollowingContentType[]
> => {
  const parsedDocument = await getParsedDocumentFromUrl(
    `${config.baseUrl}profile/${getGlobalStore().username || ""}/t-f`
  );

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
