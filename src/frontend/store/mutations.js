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
        state.processingData = false;
        state.rawMatList = [];
        state.rawMatTypeList = [];
        state.role = null;
        state.selectedRawMatIndex = 0;
        state.shipmentSchedule = [];
        state.token = null;
        state.userData = {};
        state.workingMonth = parseInt(currentDatetime().format('M'));
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
        state.activeView = state.role;
    }
};
