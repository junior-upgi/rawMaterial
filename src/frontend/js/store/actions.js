import axios from 'axios';

import { serverUrl } from '../config.js';
import { sendAdminMessage } from '../utility.js';

function errorHandler(context, message) {
    context.commit('updateStatusMessage', message);
    setTimeout(function() {
        sendAdminMessage(message);
        context.commit('resetStore');
    }, 5000);
}

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
                errorHandler(context, `注意事項留言板初始化失敗 (錯誤: ${error})。請重新登入系統`);
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
                errorHandler(context, `注意事項留言板資料儲存失敗 (錯誤: ${error})。請重新登入系統`);
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
                errorHandler(context, `原料貨品查詢失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    initPlanSchedule: function(context, payload) {
        let requestOption = {
            method: 'get',
            url: `${serverUrl}/data/restful/planSchedule`,
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
                errorHandler(context, `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份預約進貨記錄讀取失敗 (錯誤: ${error})。請重新登入系統`);
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
                errorHandler(context, `原料預約進貨失敗 (錯誤: ${error})。請重新登入系統`);
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
                console.log(payload.requestDate);
                context.commit('initPlanSchedule', response.data);
                context.commit('newYearSelection', new Date(payload.shipment.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.shipment.requestDate).getMonth());
                context.commit('updateStatusMessage', '取消原料進廠預約成功');
            }).catch((error) => {
                errorHandler(context, `取消原料進貨預約失敗 (錯誤: ${error})。請重新登入系統`);
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
                context.commit('newYearSelection', new Date(payload.original.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.original.requestDate).getMonth());
                context.commit('updateStatusMessage', '原料進廠預約修改成功');
            }).catch((error) => {
                errorHandler(context, `原料進廠預約修改失敗 (錯誤: ${error})。請重新登入系統`);
            });
    },
    commitBatchReservation: function(context, payload) {
        let processingQueue = [];
        let requestOption = {
            method: null,
            url: `${serverUrl}/data/restful/planSchedule`,
            data: {},
            headers: { 'x-access-token': sessionStorage.token }
        };
        payload.batchReservationQueue.forEach((reservation) => {
            requestOption.method = reservation.action;
            for (let propIndex in reservation.shipment) {
                requestOption.data[propIndex] = reservation.shipment[propIndex];
            }
            processingQueue.push(axios(requestOption));
            requestOption.method = null;
            requestOption.data = {};
        });
        Promise.all(processingQueue)
            .then(() => {
                context.commit('resetBatchReservationQueue');
                context.commit('newYearSelection', payload.selectedYear);
                context.commit('newMonthSelection', payload.selectedMonth);
                delete requestOption.data;
                requestOption.method = 'get';
                requestOption.params = {
                    year: payload.selectedYear,
                    month: payload.selectedMonth
                };
                return axios(requestOption);
            })
            .then((response) => {
                context.commit('initPlanSchedule', response.data);
                context.commit('updateStatusMessage', `${payload.selectedYear} 年 ${payload.selectedMonth + 1} 月份原料進廠批次預約成功`);
            })
            .catch((error) => {
                errorHandler(context, `原料進廠批次預約失敗 (錯誤: ${error})。請重新登入系統`);
            });
    }
};
