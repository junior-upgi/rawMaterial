import axios from 'axios';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

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
        /*
        context.commit('updateStatusMessage', `查詢 ${payload.requestDate} 是否已經預約進貨...`);
        let checkExistenceReqOpt = {
            method: 'get',
            url: `${serverUrl}/data/planSchedule/checkExistence`,
            params: {
                requestDate: payload.requestDate,
                CUS_NO: payload.CUS_NO,
                PRD_NO: payload.PRD_NO,
                typeId: payload.typeId
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        let existingShipmentList = [];
        let existingQuantity = 0;
        axios(checkExistenceReqOpt)
            .then((response) => {
                if (response.data.length > 1) {
                    context.commit('updateStatusMessage', '發現重複預約狀況，將合併新、舊預約資料...');
                    response.data.forEach((existingShipment) => {
                        existingShipmentList.push(existingShipment);
                    });
                    existingShipmentList.reduce((existingShipment) => {
                        existingQuantity += existingShipment.quantity;
                    });
                }
                let deleteReqOpt = {
                    method: 'delete',
                    url: `${serverUrl}/data/planSchedule`,
                    params: {
                        requestDate: payload.requestDate,
                        CUS_NO: payload.CUS_NO,
                        PRD_NO: payload.PRD_NO,
                        typeId: payload.typeId
                    },
                    headers: { 'x-access-token': sessionStorage.token }
                };
            }).catch((error) => {
                context.commit('resetStore');
                context.commit('updateStatusMessage', `檢視重複預約作業失敗 (錯誤: ${error})。請重新登入系統`);
            });
        */
        Vue.http.post(`${serverUrl}/data/planSchedule`, {
            requestDate: payload.requestDate,
            CUS_NO: payload.CUS_NO,
            PRD_NO: payload.PRD_NO,
            typeId: payload.typeId,
            quantity: payload.quantity
        }, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('initPlanSchedule', response);
                context.commit('newYearSelection', new Date(payload.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.requestDate).getMonth());
                alert('原料預約進廠成功');
                alert('implement broadcast');
            });
        }, (error) => {
            error.json().then((error) => {
                alert(`預約進貨發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        });
    },
    cancelShipment: function(context, payload) { cancelShipment(context, payload); },
    updateShipment: function(context, payload) {
        Vue.http.put(`${serverUrl}/data/planSchedule`, {
            original: payload.original,
            updated: payload.updated
        }, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('initPlanSchedule', response);
                context.commit('newYearSelection', new Date(payload.original.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(payload.original.requestDate).getMonth());
                alert('原料進廠預約修改成功');
                alert('implement broadcast');
            });
        }, (error) => {
            error.json().then((error) => {
                alert(`修改進貨預約發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
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

function processBatchReservation(context, reservationQueue) {
    let chainInit = Promise.resolve();
    reservationQueue.forEach(function(reservation) {
        chainInit = chainInit
            .then(function() {
                if (reservation.action === 'delete') {
                    return axios({
                        method: reservation.action,
                        url: `${serverUrl}/data/planSchedule`,
                        body: {
                            id: reservation.shipment.id,
                            requestDate: reservation.shipment.requestDate
                        },
                        headers: { 'x-access-token': sessionStorage.token }
                    });
                } else if (reservation.action === 'post') {
                    return axios({
                        method: reservation.action,
                        url: `${serverUrl}/data/planSchedule`,
                        body: {
                            requestDate: reservation.requestDate,
                            CUS_NO: reservation.CUS_NO,
                            PRD_NO: reservation.PRD_NO,
                            typeId: reservation.typeId,
                            quantity: reservation.quantity
                        },
                        headers: { 'x-access-token': sessionStorage.token }
                    });
                } else {
                    alert(`批次進貨預約發生錯誤:\n未知reservation.action項目${reservation.action}\n系統即將重置`);
                    sessionStorage.clear();
                    window.location.replace(`${serverUrl}/index.html`);
                }
            }).then(function(response) {
                context.commit('initPlanSchedule', response);
            }).catch(function(error) {
                alert(`批次進貨預約發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
    });
}

function cancelShipment(context, payload) {
    Vue.http.delete(`${serverUrl}/data/planSchedule`, {
        body: {
            id: payload.shipment.id,
            requestDate: payload.shipment.requestDate
        },
        headers: { 'x-access-token': sessionStorage.token }
    }).then((response) => {
        response.json().then((response) => {
            context.commit('initPlanSchedule', response);
            context.commit('newYearSelection', new Date(payload.shipment.requestDate).getFullYear());
            context.commit('newMonthSelection', new Date(payload.shipment.requestDate).getMonth());
            alert('取消原料進廠預約成功');
            alert('implement broadcast');
        });
    }, (error) => {
        error.json().then((error) => {
            alert(`取消進貨預約發生錯誤:\n${error.errorMessage}\n系統即將重置`);
            sessionStorage.clear();
            window.location.replace(`${serverUrl}/index.html`);
        });
    });
}
