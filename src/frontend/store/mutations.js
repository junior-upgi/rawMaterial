import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

export default {
    resetStore: function(state) {
        sessionStorage.clear();
        state.accessExp = currentDatetime().format('HH:mm');
        state.activeView = 'login';
        state.scheduleSummary = [];
        state.dateInEditMode = null;
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
    // applies to multiple properties
    buildData: function(state, dataObject) {
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
    }
};
