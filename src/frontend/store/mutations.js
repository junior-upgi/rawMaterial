import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

export default {
    forceViewChange: function(state, role) { state.activeView = role; },
    buildData: function(state, dataObject) {
        for (let objectIndex in dataObject) {
            state[objectIndex] = dataObject[objectIndex];
        }
    },
    redirectUser: function(state) { state.activeView = state.role; },
    resetStore: function(state) {
        sessionStorage.clear();
        state.accessExp = currentDatetime().format('HH:mm');
        state.activeView = 'login';
        state.loginId = null;
        state.rawMatList = null;
        state.rawMatTypeList = null;
        state.role = null;
        state.selectedRawMatIndex = 0;
        state.shipmentSchedule = null;
        state.token = null;
        state.userData = null;
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
