import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';

export default {
    redirectUser(state, role) { state.activeView = role; },
    restoreToken(state, token) {
        state.token = token;
        state.loginId = decode(token, { complete: true }).payload.loginId;
        state.role = decode(token, { complete: true }).payload.role;
        state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
    },
    updateStatusMessage(state, newMessage) { state.lastStatusMessage = newMessage; },
    logout(state) {
        let confirmationDialog = confirm('請確認是否登出系統，將移失尚未儲存資料！');
        if (confirmationDialog === true) {
            sessionStorage.clear();
            state.activeView = 'login';
            state.token = null;
            state.loginId = null;
            state.role = null;
            state.accessExp = moment(new Date().getTime()).format('HH:mm');
            state.planSchedule = [];
            state.rawMatList = [];
            state.yearSelected = new Date().getFullYear();
            state.monthSelected = new Date().getMonth();
            state.CUS_NO = null;
            state.PRD_NO = null;
            state.TypeId = null;
            state.showRevision = false;
            state.lastStatusMessage = '程式初始化...';
        }
    },
    toggleShowRevision(state) { state.showRevision = !state.showRevision; },
    updatePlanSchedule(state, planScheduleData) { state.planSchedule = planScheduleData.slice(); },
    newYearSelection(state, newYearSelection) { state.yearSelected = newYearSelection; },
    newMonthSelection(state, newMonthSelection) { state.monthSelected = newMonthSelection; },
    updateRawMatList(state, rawMatListData) { state.rawMatList = rawMatListData.slice(); },
    rawMatSelected(state, rawMatSelection) {
        if (rawMatSelection !== '-1') {
            state.CUS_NO = state.rawMatList[rawMatSelection].CUS_NO;
            state.PRD_NO = state.rawMatList[rawMatSelection].PRD_NO;
            state.typeId = state.rawMatList[rawMatSelection].typeId;
        } else {
            state.CUS_NO = null;
            state.PRD_NO = null;
            state.TypeId = null;
        }
    }
};
