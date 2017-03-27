import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

function emptyStoreValue(state) {
    // user permission control
    // state.accessExp = currentDatetime().format('HH:mm');
    state.activeView = 'login';
    state.loginId = null;
    state.role = null;
    state.token = null;
    state.userData = {};

    // application state data
    state.processingData = false;
    state.selectedRawMatIndex = 0;
    state.workingMonth = parseInt(currentDatetime().format('M'));
    state.workingYear = parseInt(currentDatetime().format('YYYY'));
    state.workingSupplier = null;
    state.activeShipmentEditorDate = null;
    state.pOPrintMode = false;

    // basic working data
    state.rawMatList = [];
    state.rawMatTypeList = [];
    state.supplierList = [];
    state.workingMaterial = [];
    state.shipmentSummary = [];
    state.shipmentSchedule = [];
    state.newRequestSummary = [];
    state.activePOList = [];
    state.pOContentSummary = [];
    state.consolidatedReceivingRecord = [];
    state.receivingRecord = [];
    state.monthlyShipmentOverview = [];
    state.vacationException = [];
}

export default {
    // application state control
    processingDataSwitch: function(state, onOffSwitch) { state.processingData = onOffSwitch; },
    setWorkingTime: setWorkingTime, // workingMonth and workingYear manipulation
    selectRawMaterial: selectRawMaterial, // to be used by workingMaterialSelector component
    setWorkingSupplier: setWorkingSupplier,
    forceViewChange: function(state, view) { state.activeView = view; }, // activeView specific
    redirectUser: function(state) { state.activeView = state.role; }, // activeView specific
    changeActiveShipmentEditorDate: function(state, newDateString) { state.activeShipmentEditorDate = newDateString; },
    clearActiveShipmentEditorDate: function(state) { state.activeShipmentEditorDate = null; },
    pOPrintModeSwitch: function(state, onOffSwitch) { state.pOPrintMode = onOffSwitch; },
    // utility functions
    restoreToken: restoreToken, // restore token if exists
    // general vuex store data manipulation
    buildStore: buildStore, // initialize the store from ajax data
    rebuildData: rebuildData, // reinitialize the store partially
    resetStore: resetStore // empty the store with default value
};

function buildStore(state, responseList) {
    state.activeShipmentEditorDate = null;
    let dataObject = {};
    responseList.forEach((response) => {
        Object.assign(dataObject, response.data);
    });
    for (let objectIndex in dataObject) {
        state[objectIndex] = null;
        state[objectIndex] = dataObject[objectIndex];
    }
}

function rebuildData(state, dataObject) {
    state.activeShipmentEditorDate = null;
    for (let objectIndex in dataObject) {
        state[objectIndex] = null;
        state[objectIndex] = dataObject[objectIndex];
    }
}

function resetStore(state) {
    sessionStorage.clear();
    emptyStoreValue(state);
}

function restoreToken(state, token) {
    state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
    state.loginId = decode(token, { complete: true }).payload.loginId;
    state.role = decode(token, { complete: true }).payload.role;
    state.token = token;
    state.userData = decode(token, { complete: true }).payload;
    state.activeView = state.role;
}

function selectRawMaterial(state, selectedIndex) {
    state.selectedRawMatIndex = selectedIndex;
}

function setWorkingTime(state, payload) {
    state.workingMonth = payload.workingMonth;
    state.workingYear = payload.workingYear;
}

function setWorkingSupplier(state, CUS_NO) {
    state.workingSupplier = CUS_NO;
}
