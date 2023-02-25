/* @refresh reload */
import { render } from "solid-js/web";
import {
  extractContentInfoFromPath,
  getLoggedInUser,
  initialStorageLoad,
  TypeOfContentEnum,
} from "~/utils";
import { setGlobalStore } from "~/stores/GlobalStore";

import "./index.css";
import HomePage from "~/pages/HomePage";
import ShowsPage from "~/pages/ShowsPage";

localStorage.setItem("adsVideo", new Date().toString());
initialStorageLoad();

document.querySelectorAll("section#banner")[0]?.remove();
document.querySelectorAll("script#recaptchaScript")[0].remove();

const content = extractContentInfoFromPath(window.location.pathname);

setGlobalStore({
  username: getLoggedInUser(),
  content,
});

const homeContentSection = document.querySelectorAll("section#home-content")[0];

if (homeContentSection) {
  render(
    () => <HomePage />,
    (() => {
      const app = document.createElement("section");
      app.id = "enhanced_pobretv";

      document.body.insertBefore(app, homeContentSection);
      return app;
    })()
  );
}

if (
  content &&
  (content.type === TypeOfContentEnum.SHOWS ||
    content.type === TypeOfContentEnum.ANIMES)
) {
  const contentWatchSection = document.querySelectorAll(
    "section#content-watch"
  )[0];
  const contentPlayer = document.querySelectorAll("div#content-player")[0];

  render(
    () => <ShowsPage hasContentPlayer={!!contentPlayer} />,
    (() => {
      const section = document.createElement("section");
      section.id = "enhanced_pobretv";

      contentWatchSection.insertBefore(section, contentPlayer);
      return section;
    })()
  );
}
