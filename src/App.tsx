import { Component, createSignal, For } from "solid-js";
import config from "./configs";
import { getGlobalStore } from "./stores/global/GlobalStore";
import styles from "./App.module.css";

const App: Component = () => {
  const [content, setContent] = createSignal<Element[]>([]);

  const loadData = async () => {
    const data = await fetch(
      `${config.baseUrl}/profile/${getGlobalStore().username || ""}/t-f`
    );

    const html = await data.text();

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(html, "text/html");

    const following = parsedDocument.querySelectorAll("div#content-listing")[0];

    setContent(Array.from(following.children));
  };

  loadData();

  return (
    <div class={styles.Scroll}>
      <h3 class={styles.Title}>Continue Watching...</h3>
      <div class={styles.List}>
        <For each={content()} fallback={<div>Loading...</div>}>
          {(item) => <div>{item}</div>}
        </For>
      </div>
    </div>
  );
};

export default App;
