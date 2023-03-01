import configs from "~/configs";

export type EpisodeData = {
  id: string;
  dataId: string;
  number: string;
  season: string;
  seasonDataId: string;
  node: Element;
};

export async function markEpisodeRead(data: EpisodeData): Promise<void> {
  try {
    const result = await fetch(
      `${configs.baseUrl}interaction?content_id=${data.dataId}&content_type=ep&interaction_type=w`,
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
      data.node.classList.toggle("seen");
    } else {
      throw new Error();
    }
  } catch {
    console.error("Episode read status operation failed");
  }
}
