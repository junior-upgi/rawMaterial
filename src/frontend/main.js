// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
// Globally register bootstrap-vue components
Vue.use(BootstrapVue);

import app from './component/app.vue';

new Vue({ // eslint-disable-line no-new
    el: '#app',
    render: (h) => h(app)
});
