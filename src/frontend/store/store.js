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
        loginId: null, // same as userData.SAL_NO
        processingData: false, // flag to signal if program is processing data
        rawMatList: null, // list of raw material with details
        rawMatTypeList: null, // list of known raw material in the ERP system
        role: null, // 'admin', 'furnace', 'purchasing', 'supplier'
        selectedRawMatIndex: 0, // raw material selected
        shipmentSchedule: null, // list of current shipment schedule with details
        token: null, // jwt token
        userData: null, // used to hold the user information returned from the authentication process,
        workingMonth: parseInt(currentDatetime().format('M')),
        workingYear: parseInt(currentDatetime().format('YYYY'))
    }
});

if (module.hot) {
    module.hot.accept(['./getters', './actions', './mutations'], () => {
        store.hotUpdate({
            getters: require('./getters'),
            actions: require('./actions'),
            mutations: require('./mutations')
        });
    });
}
