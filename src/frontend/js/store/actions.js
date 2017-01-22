import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

import { serverUrl } from '../config.js';

export default {
    updateRawMatList(context) {
        Vue.http.get(`${serverUrl}/data/rawMaterialSpecDetail`, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('updateRawMatList', response);
            });
        }, (error) => {
            error.json().then((error) => {
                alert(`原料貨品查詢發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        });
    },
    cancelShipment: function(context, payload) {
        let confirmationMessage = `請確認是否取消 ${payload.shipment.requestDate} 【${payload.shipment.CUS_SNM}】 進貨 ${payload.shipment.PRDT_SNM}`;
        if (confirm(confirmationMessage)) {
            Vue.http.delete(`${serverUrl}/data/planSchedule/delete`, {
                body: {
                    id: payload.shipment.id,
                    requestDate: payload.shipment.requestDate
                },
                headers: { 'x-access-token': sessionStorage.token }
            }).then((response) => {
                response.json().then((response) => {
                    context.commit('updatePlanSchedule', response);
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
    },
    scheduleNewShipment(context, requestContent) {
        Vue.http.post(`${serverUrl}/data/planSchedule/add`, {
            requestDate: requestContent.requestDate,
            CUS_NO: requestContent.CUS_NO,
            PRD_NO: requestContent.PRD_NO,
            typeId: requestContent.typeId,
            quantity: requestContent.quantity
        }, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('updatePlanSchedule', response);
                context.commit('newYearSelection', new Date(requestContent.requestDate).getFullYear());
                context.commit('newMonthSelection', new Date(requestContent.requestDate).getMonth());
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
    updateRecord: function(context, payload) {
        Vue.http.put(`${serverUrl}/data/planSchedule/update`, {
            original: payload.original,
            updated: payload.updated
        }, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('updatePlanSchedule', response);
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
    updatePlanSchedule(context, selectedTime) {
        Vue.http.post(`${serverUrl}/data/planSchedule`, {
            year: selectedTime.selectedYear,
            month: selectedTime.selectedMonth
        }, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            response.json().then((response) => {
                context.commit('updatePlanSchedule', response);
            });
        }, (error) => {
            error.json().then((error) => {
                alert(`進貨時間表查詢發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        });
    },
    initMonthlyMemo: function(context, payload) {
        context.commit('clearMonthlyMemo');
        Vue.http.get(`${serverUrl}/monthlyMemo/${payload.selectedYear}/${payload.selectedMonth}`, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            context.commit('initMonthlyMemo', response.body[0]);
        }, (error) => {
            error.json().then((error) => {
                alert(`注意事項留言板內容查詢發生錯誤:\n${error.errorMessage})\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        });
    }
};
