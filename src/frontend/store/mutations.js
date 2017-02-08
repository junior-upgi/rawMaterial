import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

export default {
    forceView: function(state, role) {
        state.activeView = role;
    },
    redirectUser: function(state) {
        state.activeView = state.role;
    },
    resetStore: function(state) {
        sessionStorage.clear();
        state.accessExp = currentDatetime().format('HH:mm');
        state.activeView = 'login';
        state.loginId = null;
        state.userName = null;
        state.role = null;
        state.token = null;
    },
    restoreToken: function(state, token) {
        state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
        state.loginId = decode(token, { complete: true }).payload.loginId;
        state.role = decode(token, { complete: true }).payload.role;
        state.userName = decode(token, { complete: true }).payload.userName;
        state.token = token;
    }
};
