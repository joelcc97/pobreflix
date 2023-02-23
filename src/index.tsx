/* @refresh reload */
import { render } from "solid-js/web";
import { extractContentInfoFromPath, getLoggedInUser } from "./utils";
import { setGlobalStore } from "./stores/global/GlobalStore";

import "./index.css";
import App from "./App";

localStorage.setItem("adsVideo", new Date().toString());

document.querySelectorAll("section#banner")[0]?.remove();
document.querySelectorAll("script#recaptchaScript")[0].remove();

setGlobalStore({
  username: getLoggedInUser(),
  content: extractContentInfoFromPath(window.location.pathname),
});

const homeContentSection = document.querySelectorAll("section#home-content")[0];

if (homeContentSection) {
  render(
    () => <App />,
    (() => {
      const app = document.createElement("section");
      app.id = "enhanced_pobretv";

      document.body.insertBefore(app, homeContentSection);
      return app;
    })()
  );
}
