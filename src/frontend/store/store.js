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
        // user permission control
        accessExp: currentDatetime().format('HH:mm'), // may be deprecated
        activeView: 'login',
        loginId: null, // same as userData.SAL_NO
        role: null, // 'admin', 'furnace', 'purchasing', 'supplier'
        token: null, // jwt token
        userData: {}, // used to hold the user information returned from the authentication process

        // shipment schedule
        scheduleSummary: [],
        dateInEditMode: false,
        processingData: false, // flag to signal if program is processing data
        selectedRawMatIndex: 0, // raw material selected
        shipmentOverview: [], // list of shipment overview data
        shipmentSchedule: [], // list of current shipment schedule with details

        // basic data
        rawMatList: [], // list of raw material with details
        rawMatTypeList: [], // list of known raw material in the ERP system
        supplierList: [],
        supplyingSpecList: [],

        // utility data
        workingMonth: parseInt(currentDatetime().format('M')),
        workingYear: parseInt(currentDatetime().format('YYYY')),

        // purchase order
        pOList: [],
        pOPrintMode: false,
        pOCreateMode: false,
        pOEditMode: false,
        pONoticeArray: [],
        pOShipmentList: [],
        pOShipmentSummary: [],
        pOViewMode: false,
        pOWorkingSupplier: null,
        workingMaterial: [], // a list of suppliers supplying raw material for the particular month
        tonnageSummary: []
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
