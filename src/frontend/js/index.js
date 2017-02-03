import { decode } from 'jsonwebtoken';
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

import { store } from './store/store.js';

import loginComponent from './login.js';
import statusComponent from './status.js';
import furnaceComponent from './furnace/entry.js';
import purchasingComponent from './purchasing/entry.js';

window.onload = function() {
    new Vue({
        el: '#app',
        store: store,
        components: {
            'login': loginComponent,
            'furnace': furnaceComponent,
            'purchasing': purchasingComponent,
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
            // if jwt token exists in the sessionStorage
            if ((sessionStorage.token !== undefined) && (sessionStorage.token !== undefined) && (sessionStorage.token !== '')) {
                // restore token from session storage
                this.restoreToken(sessionStorage.token);
                // cause router action (redirect) by setting the role property
                this.redirectUser(decode(sessionStorage.token, { complete: true }).payload.role);
            }
        }
    });
};
