import 'font-awesome/css/font-awesome.css';
import 'onsenui/css/onsenui-core.css';
import './furvester-onsen-css-components.css';

import Vue from 'vue';
import VueOnsen from 'vue-onsenui/esm';
import VueRouter from 'vue-router';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import * as VOns from './vue-onsen-components';
import App from './App';
import routes from './routes';
import VImgFallback from 'v-img-fallback';

Vue.config.productionTip = false;

Vue.use(VueOnsen);
Vue.use(VueRouter);
Vue.use(VImgFallback, {});
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp));

moment.tz.setDefault('Europe/Berlin');
Vue.use(VueMoment, {
    moment,
});

const router = new VueRouter({
    mode: 'history',
    routes,
});

new Vue({
    components: {
        App,
    },
    template: '<App/>',
    provide: {
        moment,
    },
    router,
}).$mount('#app');
