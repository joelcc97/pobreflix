import configs from "~/configs";

export type ContentType = "ep" | "s";

export async function markEpisodeRead(
  dataId: string,
  nodeToUpdate: Element,
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
      nodeToUpdate.classList.toggle("seen");
      return true;
    } else {
      throw new Error();
    }
  } catch {
    console.error("Episode read status operation failed");
    return false;
  }
}
