import { Component, createSignal, For } from "solid-js";
import styles from "./HomePage.module.css";
// import { resolveTvShowUrl } from "~/utils";
import {
  FollowingContentType,
  loadFollowingContent,
} from "~/scrapers/followingContentScraper";

const HomePage: Component = () => {
  const [content, setContent] = createSignal<FollowingContentType[]>([]);

  loadFollowingContent().then((data) => setContent(data));

  const clickHijack = (e: MouseEvent, item: FollowingContentType): void => {
    e.preventDefault();

    // window.location.href = resolveTvShowUrl({
    //   showId: item.id,
    //   season: "1",
    // });
    window.location.href = item.href;
  };

  return (
    <div class={styles.Scroll}>
      <h3 class={styles.Title}>Continue Watching...</h3>
      <div class={styles.List}>
        <For each={content()} fallback={<div>Loading...</div>}>
          {(contentItem) => (
            <div
              class={styles.Snap}
              onClick={(e) => clickHijack(e, contentItem)}
            >
              {contentItem.item}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default HomePage;
