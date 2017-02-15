import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

export default {
    forceViewChange: function(state, role) { state.activeView = role; },
    buildData: function(state, dataObject) {
        for (let objectIndex in dataObject) {
            state[objectIndex] = null;
            state[objectIndex] = dataObject[objectIndex];
        }
    },
    nextWorkingMonth: function(state) {
        let workingDate = moment(new Date(state.workingYear, state.workingMonth - 1, 1)).add(1, 'month');
        state.workingYear = parseInt(workingDate.format('YYYY'));
        state.workingMonth = parseInt(workingDate.format('M'));
    },
    prevWorkingMonth: function(state) {
        let workingDate = moment(new Date(state.workingYear, state.workingMonth - 1, 1)).subtract(1, 'month');
        state.workingYear = parseInt(workingDate.format('YYYY'));
        state.workingMonth = parseInt(workingDate.format('M'));
    },
    processingDataSwitch: function(state, onOffSwitch) {
        state.processingData = onOffSwitch;
    },
    redirectUser: function(state) { state.activeView = state.role; },
    resetStore: function(state) {
        sessionStorage.clear();
        state.accessExp = currentDatetime().format('HH:mm');
        state.activeView = 'login';
        state.dailyShipmentScheduleSummary = [];
        state.loginId = null;
        state.processingData = false;
        state.rawMatList = null;
        state.rawMatTypeList = null;
        state.role = null;
        state.selectedRawMatIndex = 0;
        state.shipmentSchedule = null;
        state.token = null;
        state.userData = null;
        state.workingMonth = parseInt(currentDatetime().format('M'));
        state.workingYear = parseInt(currentDatetime().format('YYYY'));
    },
    restoreToken: function(state, token) {
        state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
        state.loginId = decode(token, { complete: true }).payload.loginId;
        state.role = decode(token, { complete: true }).payload.role;
        state.token = token;
        state.userData = decode(token, { complete: true }).payload;
    },
    selectRawMaterial: function(state, selectedIndex) {
        state.selectedRawMatIndex = selectedIndex;
    }
};
