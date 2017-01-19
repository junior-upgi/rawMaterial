import { decode } from 'jsonwebtoken';
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

import { store } from './store/store.js';

import loginComponent from './login.js';
import statusComponent from './status.js';
import furnaceComponent from './furnace/entry.js';

window.onload = function() {
    new Vue({
        el: '#app',
        store: store,
        components: {
            'login': loginComponent,
            'furnace': furnaceComponent,
            'status': statusComponent
        },
        computed: {
            ...mapGetters({
                activeView: 'getActiveView',
                lastStatusMessage: 'getLastStatusMessage'
            })
        },
        methods: {
            ...mapMutations({
                restoreToken: 'restoreToken',
                redirectUser: 'redirectUser'
            })
        },
        created: function() {
            if ((sessionStorage.token !== undefined) && (sessionStorage.token !== undefined) && (sessionStorage.token !== '')) {
                this.restoreToken(sessionStorage.token);
                this.redirectUser(decode(sessionStorage.token, { complete: true }).payload.role);
            }
        }
    });
};
