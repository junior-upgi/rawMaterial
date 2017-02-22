import axios from 'axios';
import moment from 'moment-timezone';

import { serverUrl } from '../clientConfig.js';

export default {
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
            url: `${serverUrl}/data/shipment/dailySummary`,
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
            url: `${serverUrl}/data/supplier`,
            headers: { 'x-access-token': sessionStorage.token }
        }, {
            method: 'get',
            url: `${serverUrl}/data/supplier/workingSupplier`,
            params: {
                workingYear: context.state.workingYear,
                workingMonth: context.state.workingMonth
            },
            headers: { 'x-access-token': sessionStorage.token }
        }];
        return Promise.all(optionList.map(axios));
    },
    refreshPOListing: function(context) {
        context.commit('resetPOShipmentList');
        context.commit('resetPOShipmentSummary');
        let workingMonth = context.state.workingMonth;
        let workingYear = context.state.workingYear;
        let pOWorkingSupplier = context.state.pOWorkingSupplier;

        function startingDate(contractType) {
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

        function endDate(contractType) {
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

        if (pOWorkingSupplier !== null) {
            let supplierObject = context.state.supplierList.filter((supplier) => {
                return supplier.CUS_NO === pOWorkingSupplier;
            })[0];
            let requestOption = {
                method: 'get',
                url: `${serverUrl}/data/shipment/newPOListing`,
                params: {
                    startingDate: startingDate(supplierObject.contractType),
                    endDate: endDate(supplierObject.contractType),
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
                })
                .catch((error) => {
                    alert(`下單資料讀取發生錯誤 ${error}`);
                    this.resetStore();
                });
        }
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
    updateShipment: function(context, payload) {
        let recordData = {
            workingMonth: context.state.workingMonth,
            workingYear: context.state.workingYear
        };
        for (let index in payload) {
            recordData[index] = payload[index];
        }
        if (recordData.supplierWeight && recordData.actualWeight) {
            recordData.arrivalDate = payload.workingDate;
        } else {
            recordData.requestDate = payload.workingDate;
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
