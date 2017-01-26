import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';

export default {
    updateStatusMessage(state, newMessage) {
        state.lastStatusMessage = newMessage;
    },
    initYearList(state, yearList) {
        yearList.forEach(function(entry) {
            state.yearList.push(entry.year);
        });
    },
    redirectUser(state, role) { state.activeView = role; },
    restoreToken(state, token) {
        state.token = token;
        state.loginId = decode(token, { complete: true }).payload.loginId;
        state.role = decode(token, { complete: true }).payload.role;
        state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
    },
    resetStore(state) {
        sessionStorage.clear(); // clears any sessionStorage data (the token)
        state.accessExp = moment(new Date().getTime()).format('HH:mm');
        state.activeView = 'login';
        state.batchReservationQueue = [];
        state.CUS_NO = null;
        state.enableBatchReservation = false;
        state.lastStatusMessage = '程式初始化...';
        state.loginId = null;
        state.monthlyMemo = null;
        state.monthlyMemoLoaded = false;
        state.monthSelected = new Date().getMonth();
        state.planSchedule = [];
        state.PRD_NO = null;
        state.rawMatList = [];
        state.role = null;
        state.selectedRawMatIndex = -1;
        state.showRevision = false;
        state.token = null;
        state.typeId = null;
        state.yearList = [];
        state.yearSelected = new Date().getFullYear();
    },
    logout(state) {
        let confirmationDialog = confirm('請確認是否登出系統，將移失尚未儲存資料！');
        if (confirmationDialog === true) {
            sessionStorage.clear(); // clears any sessionStorage data (the token)
            state.accessExp = moment(new Date().getTime()).format('HH:mm');
            state.activeView = 'login';
            state.batchReservationQueue = [];
            state.CUS_NO = null;
            state.enableBatchReservation = false;
            state.lastStatusMessage = '程式初始化...';
            state.loginId = null;
            state.monthlyMemo = null;
            state.monthlyMemoLoaded = false;
            state.monthSelected = new Date().getMonth();
            state.planSchedule = [];
            state.PRD_NO = null;
            state.rawMatList = [];
            state.role = null;
            state.selectedRawMatIndex = -1;
            state.showRevision = false;
            state.token = null;
            state.typeId = null;
            state.yearList = [];
            state.yearSelected = new Date().getFullYear();
        }
    },
    initMonthlyMemo(state, monthlyMemo) {
        state.monthlyMemo = monthlyMemo.content;
        state.monthlyMemoLoaded = true;
    },
    clearMonthlyMemo(state) {
        state.monthlyMemoLoaded = false;
        state.monthlyMemo = null;
    },
    toggleShowRevision(state) { state.showRevision = !state.showRevision; },
    initPlanSchedule(state, planScheduleData) {
        state.planSchedule = planScheduleData.slice();
    },
    newYearSelection(state, newYearSelection) { state.yearSelected = newYearSelection; },
    newMonthSelection(state, newMonthSelection) { state.monthSelected = newMonthSelection; },
    initRawMatList(state, rawMatListData) { state.rawMatList = rawMatListData.slice(); },
    rawMatSelected(state, rawMatSelection) {
        if (parseInt(rawMatSelection) > -1) {
            state.selectedRawMatIndex = parseInt(rawMatSelection);
            state.CUS_NO = state.rawMatList[rawMatSelection].CUS_NO;
            state.PRD_NO = state.rawMatList[rawMatSelection].PRD_NO;
            state.typeId = state.rawMatList[rawMatSelection].typeId;
        } else {
            state.selectedRawMatIndex = -1;
            state.CUS_NO = null;
            state.PRD_NO = null;
            state.typeId = null;
        }
    },
    toggleEnableBatchReservation(state) {
        state.batchReservationQueue = [];
        state.enableBatchReservation = !state.enableBatchReservation;
    },
    pushBatchReservation(state, payload) {
        state.batchReservationQueue.push(payload);
    },
    resetBatchReservationQueue(state) {
        state.enableBatchReservation = false;
        state.batchReservationQueue = [];
    }
};
