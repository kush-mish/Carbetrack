import { createApp } from "vue";
import { VueFire } from "vuefire";
import { firebaseApp } from "./firebase";
import App from "./App.vue";
import router from './router';

const app = createApp(App);
app.use(VueFire, { firebaseApp });
app.use(router);
app.mount("#app");
