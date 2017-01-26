import axios from 'axios';

import { serverUrl } from '../config.js';

export default {
    checkDataAvailibility(context) {
        let requestOption = {
            method: 'get',
            url: `${serverUrl}/data/planSchedule/availability`,
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    },
    initMonthlyMemo: function(context, payload) {
        let requestOption = {
            method: 'get',
            url: `${serverUrl}/monthlyMemo/${payload.selectedYear}/${payload.selectedMonth}`,
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initMonthlyMemo', response.data[0]);
                context.commit('updateStatusMessage', `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份留言板初始化完成`);
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `注意事項留言板初始化失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    updateMonthlyMemo: function(context, payload) {
        let requestOption = {
            method: 'post',
            url: `${serverUrl}/monthlyMemo/${payload.selectedYear}/${payload.selectedMonth}`,
            data: { content: payload.content },
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initMonthlyMemo', response.data[0]);
                context.commit('updateStatusMessage', `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份留言板內容儲存成功`);
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `注意事項留言板資料儲存失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    initRawMatList(context) {
        let requestOption = {
            method: 'get',
            url: `${serverUrl}/data/rawMaterialSpecDetail`,
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initRawMatList', response.data);
                context.commit('updateStatusMessage', '原料貨品類別查詢成功');
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `原料貨品查詢失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    initPlanSchedule: function(context, payload) {
        let requestOption = {
            method: 'get',
            url: `${serverUrl}/data/planSchedule`,
            params: {
                year: payload.selectedYear,
                month: payload.selectedMonth
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initPlanSchedule', response.data);
                context.commit('updateStatusMessage', `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份預約進貨記錄讀取成功`);
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份預約進貨記錄讀取失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    scheduleShipment: function(context, payload) {
        let requestOption = {
            method: 'post',
            url: `${serverUrl}/data/planSchedule`,
            data: {
                requestDate: payload.requestDate,
                CUS_NO: payload.CUS_NO,
                PRD_NO: payload.PRD_NO,
                typeId: payload.typeId,
                quantity: payload.quantity
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initPlanSchedule', response.data);
                context.commit('newYearSelection', new Date(payload.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.requestDate).getMonth());
                context.commit('updateStatusMessage', '原料預約進貨成功');
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `原料預約進貨失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    cancelShipment: function(context, payload) {
        let requestOption = {
            method: 'delete',
            url: `${serverUrl}/data/planSchedule`,
            data: {
                id: payload.shipment.id,
                requestDate: payload.shipment.requestDate
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initPlanSchedule', response.data);
                context.commit('newYearSelection', new Date(payload.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.requestDate).getMonth());
                context.commit('updateStatusMessage', '取消原料進廠預約成功');
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `取消原料進貨預約失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    updateShipment: function(context, payload) {
        let requestOption = {
            method: 'put',
            url: `${serverUrl}/data/planSchedule`,
            data: {
                original: payload.original,
                updated: payload.updated
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        axios(requestOption)
            .then((response) => {
                context.commit('initPlanSchedule', response.data);
                context.commit('newYearSelection', new Date(payload.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.requestDate).getMonth());
                context.commit('updateStatusMessage', '原料進廠預約修改成功');
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `原料進廠預約修改失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    commitBatchReservation: function(context, payload) {
        console.log(payload);
        context.commit('resetBatchReservationQueue');
        /*
        context.commit('newYearSelection', new Date(payload.requestDate).getFullYear());
        context.commit('newMonthSelection', new Date(payload.requestDate).getMonth());
        alert('批次進貨預約成功');
        alert('implement broadcast');
        */
    }
};
