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
            url: `${serverUrl}/data/supplier/workingSupplier`,
            params: {
                workingYear: context.state.workingYear,
                workingMonth: context.state.workingMonth
            },
            headers: { 'x-access-token': sessionStorage.token }
        }];
        return Promise.all(optionList.map(axios));
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
        let requestOption = {
            method: 'put',
            url: `${serverUrl}/data/shipment`,
            data: {
                id: payload.id,
                arrivalDate: payload.workingDate,
                supplierWeight: payload.supplierWeight,
                actualWeight: payload.actualWeight,
                note: payload.note,
                workingMonth: context.state.workingMonth,
                workingYear: context.state.workingYear
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    }
};
