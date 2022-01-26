import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import utils from "./mixins/utils";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import "./assets/css/main.css";
import "cal-sans";

const app = createApp(App).use(store).use(router).use(i18n).mixin(utils);

app.config.globalProperties.$name = process.env.VUE_APP_NAME || "AppName";
app.config.globalProperties.$subname = process.env.VUE_APP_SUBNAME || "SubName";

const requireComponent = require.context("@/components", true, /[\w-]+\.vue$/);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, "").replace(/\.\w+$/, ""))
  );
  app.component(componentName, componentConfig.default || componentConfig);
});

app.mount("#app");
