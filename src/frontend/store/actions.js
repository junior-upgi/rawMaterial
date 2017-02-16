import axios from 'axios';

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
                quantity: payload.quantity
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
                requestDate: payload.requestDate,
                CUS_NO: payload.CUS_NO,
                PRD_NO: payload.PRD_NO,
                typeId: payload.typeId
            },
            headers: { 'x-access-token': sessionStorage.token }
        };
        return axios(requestOption);
    },
    initData: function(context) {
        let state = context.state;
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
            headers: { 'x-access-token': sessionStorage.token }
        }, {
            method: 'get',
            url: `${serverUrl}/data/shipment/dailySummary`,
            headers: { 'x-access-token': sessionStorage.token }
        }];
        if ((state.loginId !== null) && (state.loginId === state.userData.SAL_NO)) {
            Promise.all(optionList.map(axios))
                .then(function(responseList) {
                    let dataObject = {};
                    responseList.forEach((response) => {
                        Object.assign(dataObject, response.data);
                    });
                    context.commit('buildData', dataObject);
                    return Promise.resolve();
                }).catch((error) => {
                    return Promise.reject({ errorMessage: `initData action failure: ${error}` });
                });
        } else if ((state.loginId !== null) && (state.userData.CUS_NO !== null)) {
            // supplier modules are not implemented yet, reset and return a rejected promise
            context.commit('resetStore');
            return Promise.reject({ errorMessage: 'supplier modules are not implemented yet' });
        } else {
            return Promise.reject({ errorMessage: 'initData action: user state undetermined' });
        }
    }
};