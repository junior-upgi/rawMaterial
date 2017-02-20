import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

export default {
    resetStore: function(state) {
        sessionStorage.clear();
        state.accessExp = currentDatetime().format('HH:mm');
        state.activeView = 'login';
        state.scheduleSummary = [];
        state.dateInEditMode = false;
        state.loginId = null;
        state.pOPrintMode = false;
        state.pOViewMode = false;
        state.processingData = false;
        state.rawMatList = [];
        state.rawMatTypeList = [];
        state.role = null;
        state.selectedRawMatIndex = 0;
        state.shipmentOverview = [];
        state.shipmentSchedule = [];
        state.token = null;
        state.tonnageSummary = [];
        state.userData = {};
        state.workingMonth = parseInt(currentDatetime().format('M'));
        state.workingSupplier = [];
        state.workingYear = parseInt(currentDatetime().format('YYYY'));
    },
    // applies to multiple properties
    dataInitialization: function(state, responseList) {
        let dataObject = {};
        responseList.forEach((response) => {
            Object.assign(dataObject, response.data);
        });
        for (let objectIndex in dataObject) {
            state[objectIndex] = null;
            state[objectIndex] = dataObject[objectIndex];
        }
    },
    // deals with purchase order operation
    changePOMode: function(state, modeObj) {
        state.pOPrintMode = modeObj.pOPrintMode;
        state.pOViewMode = modeObj.pOViewMode;
        setTimeout(function() {
            state.pOPrintMode = false;
            state.pOViewMode = true;
        }, 5000);
    },
    // applies to multiple properties
    rebuildData: function(state, dataObject) {
        for (let objectIndex in dataObject) {
            state[objectIndex] = null;
            state[objectIndex] = dataObject[objectIndex];
        }
    },
    // activeView specific
    forceViewChange: function(state, role) { state.activeView = role; },
    redirectUser: function(state) { state.activeView = state.role; },
    // dateInEditMode specific
    switchDateInEditMode: function(state, date) { state.dateInEditMode = date; },
    turnOffEditMode: function(state) { state.dateInEditMode = null; },
    // processingData specific
    processingDataSwitch: function(state, onOffSwitch) {
        state.processingData = onOffSwitch;
    },
    // workingMonth and workingYear specific
    setWorkingTime: function(state, payload) {
        state.workingMonth = payload.workingMonth;
        state.workingYear = payload.workingYear;
    },
    // selectedRawMatIndex specific
    selectRawMaterial: function(state, selectedIndex) {
        state.selectedRawMatIndex = selectedIndex;
    },
    // token specific
    restoreToken: function(state, token) {
        state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
        state.loginId = decode(token, { complete: true }).payload.loginId;
        state.role = decode(token, { complete: true }).payload.role;
        state.token = token;
        state.userData = decode(token, { complete: true }).payload;
        state.activeView = state.role;
    }
};
