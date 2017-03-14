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
        /*
        // shipment schedule
        shipmentOverview: [], // list of shipment overview data

        // basic data
        supplyingSpecList: [],

        // purchase order
        pOList: [],
        pOPrintMode: false,
        pOCreateMode: false,
        pOEditMode: false,
        pONoticeArray: [],
        pOShipmentList: [],
        pOShipmentSummary: [],
        pOViewMode: false,
        tonnageSummary: [],
        */

        // ////////////////////////////////////////////////////////////////
        // user permission control
        // accessExp: currentDatetime().format('HH:mm'), // may be deprecated
        activeView: 'login',
        loginId: null, // same as userData.SAL_NO
        role: null, // 'admin', 'furnace', 'purchasing', 'supplier'
        token: null, // jwt token
        userData: {}, // used to hold the user information returned from the authentication process

        // application state data
        processingData: false, // flag to signal if program is processing data
        selectedRawMatIndex: 0, // raw material selected
        workingMonth: parseInt(currentDatetime().format('M')),
        workingYear: parseInt(currentDatetime().format('YYYY')),
        workingSupplier: null,
        activeShipmentEditorDate: null,

        // basic working data
        rawMatList: [], // list of raw material with details
        rawMatTypeList: [], // list of known raw material in the ERP system
        supplierList: [],
        workingMaterial: [], // a month-by-month list of suppliers and supplied raw material

        // shipment schedule
        shipmentSchedule: [], // list of current shipment schedule with details
        shipmentSummary: [], // list of daily summary of current shipment schedule
        newRequestSummary: [],
        receivingRecord: [],
        monthlyShipmentOverview: [],

        // purchase order
        activePOList: [],
        pOContentSummary: []
    }
});

/*
if (module.hot) {
    module.hot.accept(['./getters', './actions', './mutations'], () => {
        store.hotUpdate({
            getters: require('./getters'),
            actions: require('./actions'),
            mutations: require('./mutations')
        });
    });
}
*/
