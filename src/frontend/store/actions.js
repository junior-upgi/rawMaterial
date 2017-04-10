import axios from 'axios';
import moment from 'moment-timezone';

import {
    broadcastServiceUrl,
    defaultBot,
    employeeChatGroup,
    serverUrl
} from '../clientConfig.js';

export default {
    initData: initData,
    updateShipment: updateShipment,
    cancelShipment: cancelShipment,
    componentErrorHandler: componentErrorHandler,
    shipmentReservation: shipmentReservation,
    updatePurchaseOrder: updatePurchaseOrder,
    closePurchaseOrder: closePurchaseOrder,
    createPurchaseOrder: createPurchaseOrder,
    nextWorkingMonth: nextWorkingMonth,
    prevWorkingMonth: prevWorkingMonth,
    setWorkingTime: setWorkingTime,
    employeeChatBroadcast: employeeChatBroadcast
};

function initData(context) {
    const optionList = [{
        method: 'get',
        url: `${serverUrl}/data/supplier`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/supplier/workingMaterial`,
        params: {
            workingYear: context.state.workingYear,
            workingMonth: context.state.workingMonth
        },
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/rawMaterial`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/rawMaterial/knownList`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/shipment`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/shipment/newRequestSummary`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/shipment/receivingRecord/consolidated`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/shipment/receivingRecord`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/shipment/monthlyOverview`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/purchaseOrder`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/purchaseOrder/contentSummary`,
        headers: { 'x-access-token': sessionStorage.token }
    }, {
        method: 'get',
        url: `${serverUrl}/data/vacationException`,
        headers: { 'x-access-token': sessionStorage.token }
    }];
    return Promise.all(optionList.map(axios));
}

function prevWorkingMonth(context) {
    const workingMonth = context.state.workingMonth;
    const workingYear = context.state.workingYear;
    const workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).subtract(1, 'month');
    context.commit({
        type: 'setWorkingTime',
        workingMonth: parseInt(workingDate.format('M')),
        workingYear: parseInt(workingDate.format('YYYY'))
    });
    return context.dispatch('initData');
}

function nextWorkingMonth(context) {
    const workingMonth = context.state.workingMonth;
    const workingYear = context.state.workingYear;
    const workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).add(1, 'month');
    context.commit({
        type: 'setWorkingTime',
        workingMonth: parseInt(workingDate.format('M')),
        workingYear: parseInt(workingDate.format('YYYY'))
    });
    return context.dispatch('initData');
}

function setWorkingTime(context, payload) {
    context.commit({
        type: 'setWorkingTime',
        workingMonth: payload.workingYear,
        workingYear: payload.workingMonth
    });
    return context.dispatch('initData');
}

function componentErrorHandler(context, errorObject) {
    console.log('--------------------');
    console.log('dumping system state');
    console.log('--------------------');
    console.log(context.state);
    console.log('------------------');
    console.log('end of system dump');
    console.log('------------------');
    const token = sessionStorage.token;
    const activeView = context.state.activeView;
    context.commit('resetStore');
    sessionStorage.token = token;
    context.commit('restoreToken', sessionStorage.token);
    context.dispatch('initData')
        .then((responseList) => {
            context.commit('buildStore', responseList);
            context.commit('forceViewChange', activeView);
            alert('發現系統異常，系統已覆歸。請聯繫 IT 檢視狀況。');
            console.log('----------------------------');
            console.log('system recovered after error');
            console.log('----------------------------');
            for (const index in errorObject) {
                console.log(`${index}: ${errorObject[index]}`);
            }
        }).catch((error) => {
            alert('發現系統異常，系統覆歸失敗。請聯繫 IT 檢視狀況。');
            console.log('------------------------------------');
            console.log('system failed to recover after error');
            console.log('reason for recovery failure:');
            console.log(error);
            console.log('------------------------------------');
            for (const index in errorObject) {
                console.log(`${index}: ${errorObject[index]}`);
            }
            context.commit('resetStore');
        });
}

function shipmentReservation(context, payload) {
    const requestOption = {
        method: 'post',
        url: `${serverUrl}/data/shipment`,
        data: {
            requestDate: payload.requestDate,
            CUS_NO: payload.CUS_NO,
            PRD_NO: payload.PRD_NO,
            typeId: payload.typeId,
            qtyPerShipment: payload.qtyPerShipment,
            shipmentCount: payload.shipmentCount
        },
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function updateShipment(context, payload) {
    let recordData = {};
    for (let objIndex in payload) {
        recordData[objIndex] = payload[objIndex];
    }
    if (recordData.supplierWeight && recordData.actualWeight) {
        // establish the arrival date when a shipment's receiving quantity is fulfilled
        recordData.receivedDate = payload.workingDate;
    } else {
        recordData.requestDate = payload.workingDate;
        // make sure the shipment's 'arrived' status is revoked when user removes existing receiving quantity
        recordData.receivedDate = null;
        recordData.supplierWeight = null;
        recordData.actualWeight = null;
    }
    const requestOption = {
        method: 'put',
        url: `${serverUrl}/data/shipment`,
        data: recordData,
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function cancelShipment(context, payload) {
    const requestOption = {
        method: 'delete',
        url: `${serverUrl}/data/shipment`,
        data: { targetList: payload.targetList },
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function updatePurchaseOrder(context, payload) {
    const requestOption = {
        method: 'put',
        url: `${serverUrl}/data/purchaseOrder`,
        data: payload,
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function closePurchaseOrder(context, payload) {
    const requestOption = {
        method: 'put',
        url: `${serverUrl}/data/purchaseOrder/close`,
        data: payload,
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function createPurchaseOrder(context, payload) {
    const requestOption = {
        method: 'post',
        url: `${serverUrl}/data/purchaseOrder`,
        data: payload,
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}

function employeeChatBroadcast(context, payload) {
    let option = {
        method: 'post',
        url: broadcastServiceUrl,
        data: {
            chat_id: employeeChatGroup.id,
            text: `${payload.groupMessage}\n\n${context.state.userData.NAME} 發送`,
            token: defaultBot.token
        }
    };
    return axios(option);
}
