import moment from 'moment-timezone';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import actions from './actions.js';
import getters from './getters';
import mutations from './mutations.js';

export const store = new Vuex.Store({
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: {
        accessExp: moment(new Date().getTime()).format('HH:mm'),
        activeView: 'login',
        batchReservationQueue: [],
        CUS_NO: null,
        enableBatchReservation: false,
        lastStatusMessage: '程式初始化...',
        loginId: null,
        monthlyMemo: null,
        monthlyMemoLoaded: false,
        monthSelected: new Date().getMonth(),
        planSchedule: [],
        PRD_NO: null,
        rawMatList: [],
        role: null,
        selectedRawMatIndex: -1,
        showRevision: false,
        token: null,
        typeId: null,
        yearList: [],
        yearSelected: new Date().getFullYear()
    }
});
