import axios from 'axios';
import moment from 'moment-timezone';

import { serverUrl } from '../clientConfig.js';

export default {
    initData: function(context) {
        const optionList = [{
                method: 'get',
                url: `${serverUrl}/data/supplier`,
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
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/purchaseOrder`,
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/purchaseOrder/contentSummary`,
                headers: { 'x-access-token': sessionStorage.token }
            }
            /*
            , {
                method: 'get',
                url: `${serverUrl}/data/shipment/summary`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/shipment/overview`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/shipment/tonnageSummary`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/rawMaterial/supplyingSpecList`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }, {
                method: 'get',
                url: `${serverUrl}/data/supplier/workingMaterial`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }
            */
        ];
        return Promise.all(optionList.map(axios));
    },
    nextWorkingMonth: function(context) {
        const workingMonth = context.state.workingMonth;
        const workingYear = context.state.workingYear;
        const workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).add(1, 'month');
        context.commit({
            type: 'setWorkingTime',
            workingMonth: parseInt(workingDate.format('M')),
            workingYear: parseInt(workingDate.format('YYYY'))
        });
        return context.dispatch('initData');
    },
    prevWorkingMonth: function(context) {
        const workingMonth = context.state.workingMonth;
        const workingYear = context.state.workingYear;
        const workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).subtract(1, 'month');
        context.commit({
            type: 'setWorkingTime',
            workingMonth: parseInt(workingDate.format('M')),
            workingYear: parseInt(workingDate.format('YYYY'))
        });
        return context.dispatch('initData');
    },
    refreshPOShipmentListing: function(context) {
        context.commit('resetPOShipmentList');
        context.commit('resetPOShipmentSummary');
        const workingMonth = context.state.workingMonth;
        const workingYear = context.state.workingYear;
        const pOWorkingSupplier = context.state.pOWorkingSupplier;
        if (pOWorkingSupplier !== null) {
            const supplierObject = context.state.supplierList.filter((supplier) => {
                return supplier.CUS_NO === pOWorkingSupplier;
            })[0];
            let requestOption = {
                method: 'get',
                url: `${serverUrl}/data/shipment/newPOListing`,
                params: {
                    startingDate: startingDate(supplierObject.contractType, workingYear, workingMonth),
                    endDate: endDate(supplierObject.contractType, workingYear, workingMonth),
                    contractType: supplierObject.contractType,
                    CUS_NO: pOWorkingSupplier
                },
                headers: { 'x-access-token': sessionStorage.token }
            };
            axios(requestOption)
                .then((resultset) => {
                    resultset.data.forEach((result) => {
                        result.selected = false;
                    });
                    context.commit('updatePOShipmentList', resultset.data);
                    requestOption = {
                        method: 'get',
                        url: `${serverUrl}/data/supplier/pONotice`,
                        params: { CUS_NO: pOWorkingSupplier },
                        headers: { 'x-access-token': sessionStorage.token }
                    };
                    return axios(requestOption);
                }).then(function(resultset) {
                    context.commit('updatePONoticeArray', resultset.data);
                }).catch((error) => {
                    alert(`訂單頁面資料讀取發生錯誤 ${error}`);
                    this.resetStore();
                });
        }
    },
    savePOData: function(context) {
        const workingMonth = context.state.workingMonth;
        const workingYear = context.state.workingYear;
        const pOWorkingSupplier = context.state.pOWorkingSupplier;

        if (pOWorkingSupplier !== null) {
            const supplierObject = context.state.supplierList.filter((supplier) => {
                return supplier.CUS_NO === pOWorkingSupplier;
            })[0];
            const savePOPromise = new Promise((resolve, reject) => {
                const requestOption = {
                    method: 'put',
                    url: `${serverUrl}/data/purchaseOrder`,
                    data: {
                        CUS_NO: pOWorkingSupplier,
                        contractType: supplierObject.contractType,
                        startingDate: startingDate(supplierObject.contractType, workingYear, workingMonth),
                        endDate: endDate(supplierObject.contractType, workingYear, workingMonth),
                        shipmentList: context.state.pOShipmentList.slice()
                    },
                    headers: { 'x-access-token': sessionStorage.token }
                };
                axios(requestOption)
                    .then(function() {
                        resolve('success in testing...');
                    }).catch(function(error) {
                        reject(`error in testing: ${error}...`);
                    });
            });
            return savePOPromise;
        } else {
            return Promise.reject('下單客戶資料異常');
        }
    },
    updateShipment: function(context, payload) {
        const recordData = {
            workingMonth: context.state.workingMonth,
            workingYear: context.state.workingYear
        };
        for (const index in payload) {
            recordData[index] = payload[index];
        }
        if (recordData.supplierWeight && recordData.actualWeight) {
            // establish the arrival date when a shipment's receiving quantity is fulfilled
            recordData.arrivalDate = payload.workingDate;
        } else {
            recordData.requestDate = payload.workingDate;
            // make sure the shipment's 'arrived' status is revoked when user removes existing receiving quantity
            recordData.arrivalDate = null;
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
    },
    cancelShipment: cancelShipment,
    componentErrorHandler: componentErrorHandler,
    shipmentReservation: shipmentReservation
};

function startingDate(contractType, workingYear, workingMonth) {
    switch (contractType) {
        case 'annual':
            return moment(new Date(workingYear, 0, 1)).format('YYYY-MM-DD');
        case 'monthly':
            return moment(new Date(workingYear, workingMonth - 1, 1)).format('YYYY-MM-DD');
        case 'oneTime':
            return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
        default:
            return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    }
}

function endDate(contractType, workingYear, workingMonth) {
    switch (contractType) {
        case 'annual':
            return moment(new Date(workingYear, 11, 31)).format('YYYY-MM-DD');
        case 'monthly':
            return moment(new Date(workingYear, workingMonth, 0)).format('YYYY-MM-DD');
        case 'oneTime':
            return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
        default:
            return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    }
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

function cancelShipment(context, payload) {
    const requestOption = {
        method: 'delete',
        url: `${serverUrl}/data/shipment`,
        data: { targetList: payload.targetList },
        headers: { 'x-access-token': sessionStorage.token }
    };
    return axios(requestOption);
}
