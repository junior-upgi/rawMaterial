import moment from 'moment-timezone';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import getters from './getters';
import mutations from './mutations.js';
import actions from './actions.js';

export const store = new Vuex.Store({
    state: {
        activeView: 'login',
        token: null,
        loginId: null,
        role: null,
        accessExp: moment(new Date().getTime()).format('HH:mm'),
        planSchedule: [],
        rawMatList: [],
        yearSelected: new Date().getFullYear(),
        monthSelected: new Date().getMonth(),
        CUS_NO: null,
        PRD_NO: null,
        TypeId: null,
        showRevision: false,
        monthlyMemo: null,
        monthlyMemoLoaded: false,
        lastStatusMessage: '程式初始化...'
    },
    getters: getters,
    mutations: mutations,
    actions: actions
});
