import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

import { currentDatetime } from '../utility.js';

export const store = new Vuex.Store({
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: {
        accessExp: currentDatetime().format('HH:mm'),
        activeView: 'login',
        loginId: null, // same as SAL_NO
        role: null, // 'admin', 'furnace', 'purchasing', 'supplier'
        token: null, // jwt token
        userData: null // used to hold the user information returned from the authentication process
    }
});
