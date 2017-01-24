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
        selectedRawMatIndex: '-1', // this is selection value (should be typed as string and not number)
        CUS_NO: null,
        PRD_NO: null,
        typeId: null,
        showRevision: false,
        enableBatchReservation: false,
        batchReservationQueue: [],
        monthlyMemo: null,
        monthlyMemoLoaded: false,
        lastStatusMessage: '程式初始化...'
    },
    getters: getters,
    mutations: mutations,
    actions: actions
});
