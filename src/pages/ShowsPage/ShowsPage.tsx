import { Component } from "solid-js";
import styles from "./ShowsPage.module.css";

const ShowsPage: Component<{ hasContentPlayer: boolean }> = ({
  hasContentPlayer,
}) => {
  const episodesArray = Array.from(
    document.querySelectorAll("div.content-episodes > a")
  );

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

  episodesArray.forEach((episode) => {
    const episodeDataNode = episode.querySelector("div.episode");

    if (episodeDataNode) {
      observer.observe(episodeDataNode, { attributes: true });
    }
  });

  return hasContentPlayer ? <div class={styles.Container}></div> : null;
};

export default ShowsPage;
