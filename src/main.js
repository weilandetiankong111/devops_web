import { createApp } from "vue";
import App from "./App.vue";
// import axios from "axios";
import axios from "./api/http";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import locale from "element-plus/dist/locale/zh-cn.mjs";

const app = createApp(App).use(router);

for (const iconName in ElementPlusIconsVue) {
  app.component(iconName, ElementPlusIconsVue[iconName]);
}

// axios.defaults.baseURL='http://www.devops.cn';
// axios.defaults.timeout = 5000;
app.config.globalProperties.$http = axios;
app.mount("#app");
app.use(ElementPlus, { locale });
