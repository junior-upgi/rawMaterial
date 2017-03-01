import axios from 'axios';
import moment from 'moment-timezone';

import { serverUrl } from '../clientConfig.js';

export default {
    initData: function(context) {
        let optionList = [{
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
                url: `${serverUrl}/data/shipment/summary`,
                params: {
                    workingYear: context.state.workingYear,
                    workingMonth: context.state.workingMonth
                },
                headers: { 'x-access-token': sessionStorage.token }
            }
            /* , {
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
                url: `${serverUrl}/data/purchaseOrder`,
                params: {
                    workingMonth: context.state.workingMonth,
                    workingYear: context.state.workingYear
                },
                headers: { 'x-access-token': sessionStorage.token }
            }
            */
        ];
        return Promise.all(optionList.map(axios));
    },
    bookShipment: function(context, payload) {
        let requestOption = {
            method: 'post',
            url: `${serverUrl}/data/shipment`,
            data: {
                requestDate: payload.requestDate,
                CUS_NO: payload.CUS_NO,
                PRD_NO: payload.PRD_NO,
                typeId: payload.typeId,
                quantity: payload.quantity,
                workingMonth: context.state.workingMonth,
                workingYear: context.state.workingYear
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    },
    cancelShipment: function(context, payload) {
        let requestOption = {
            method: 'delete',
            url: `${serverUrl}/data/shipment`,
            data: {
                id: payload.id,
                requestDate: payload.requestDate,
                CUS_NO: payload.CUS_NO,
                PRD_NO: payload.PRD_NO,
                typeId: payload.typeId,
                workingMonth: context.state.workingMonth,
                workingYear: context.state.workingYear
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    },
    nextWorkingMonth: function(context) {
        let workingMonth = context.state.workingMonth;
        let workingYear = context.state.workingYear;
        let workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).add(1, 'month');
        context.commit({
            type: 'setWorkingTime',
            workingMonth: parseInt(workingDate.format('M')),
            workingYear: parseInt(workingDate.format('YYYY'))
        });
        return context.dispatch({ type: 'initData' });
    },
    prevWorkingMonth: function(context) {
        let workingMonth = context.state.workingMonth;
        let workingYear = context.state.workingYear;
        let workingDate = moment(new Date(workingYear, workingMonth - 1, 1)).subtract(1, 'month');
        context.commit({
            type: 'setWorkingTime',
            workingMonth: parseInt(workingDate.format('M')),
            workingYear: parseInt(workingDate.format('YYYY'))
        });
        return context.dispatch({ type: 'initData' });
    },
    refreshPOShipmentListing: function(context) {
        context.commit('resetPOShipmentList');
        context.commit('resetPOShipmentSummary');
        let workingMonth = context.state.workingMonth;
        let workingYear = context.state.workingYear;
        let pOWorkingSupplier = context.state.pOWorkingSupplier;
        if (pOWorkingSupplier !== null) {
            let supplierObject = context.state.supplierList.filter((supplier) => {
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
        let workingMonth = context.state.workingMonth;
        let workingYear = context.state.workingYear;
        let pOWorkingSupplier = context.state.pOWorkingSupplier;

        if (pOWorkingSupplier !== null) {
            let supplierObject = context.state.supplierList.filter((supplier) => {
                return supplier.CUS_NO === pOWorkingSupplier;
            })[0];
            let savePOPromise = new Promise((resolve, reject) => {
                let requestOption = {
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
                        reject('error in testing...');
                    });
            });
            return savePOPromise;
        } else {
            return Promise.reject('下單客戶資料異常');
        }
    },
    updateShipment: function(context, payload) {
        let recordData = {
            workingMonth: context.state.workingMonth,
            workingYear: context.state.workingYear
        };
        for (let index in payload) {
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
        let requestOption = {
            method: 'put',
            url: `${serverUrl}/data/shipment`,
            data: recordData,
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    }
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
