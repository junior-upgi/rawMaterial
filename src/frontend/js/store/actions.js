import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

import { serverUrl } from '../config.js';

export default {
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
                Vue.http.post(`${serverUrl}/data/planSchedule`, {
                    year: new Date(requestContent.requestDate).getFullYear(),
                    month: new Date(requestContent.requestDate).getMonth()
                }, {
                    headers: { 'x-access-token': sessionStorage.token }
                }).then((response) => {
                    response.json().then((response) => {
                        context.commit('updatePlanSchedule', response);
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
            });
        }, (error) => {
            error.json().then((error) => {
                alert(`預約進貨發生錯誤:\n${error.errorMessage}\n系統即將重置`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        });
    }
};
