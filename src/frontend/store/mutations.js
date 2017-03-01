import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { currentDatetime } from '../utility.js';

function emptyStoreValue(state) {
    /*
    state.dateInEditMode = false;
    state.pOCreateMode = false;
    state.pOEditMode = false;
    state.pOList = [];
    state.pONoticeArray = [];
    state.pOPrintMode = false;
    state.pOShipmentList = [];
    state.pOShipmentSummary = [];
    state.pOViewMode = false;
    state.pOWorkingSupplier = null;
    state.shipmentOverview = [];
    state.supplierList = [];
    state.supplyingSpecList = [];
    state.tonnageSummary = [];
    state.workingMaterial = [];
    */
    // ////////////////////////////////////////////////
    // user permission control
    // state.accessExp = currentDatetime().format('HH:mm');
    state.activeView = 'login';
    state.loginId = null;
    state.role = null;
    state.token = null;
    state.userData = {};

    // application state data
    state.processingData = false;
    state.selectedRawMatIndex = 0;
    state.workingMonth = parseInt(currentDatetime().format('M'));
    state.workingYear = parseInt(currentDatetime().format('YYYY'));

    // basic working data
    state.rawMatList = [];
    state.rawMatTypeList = [];

    // shipment schedule
    state.shipmentSummary = [];
    state.shipmentSchedule = [];
}

export default {
    /*
    // deals with purchase order operation
    changePOMode: function(state, modeObj) {
        state.pOCreateMode = modeObj.pOCreateMode;
        state.pOEditMode = modeObj.pOEditMode;
        state.pOPrintMode = modeObj.pOPrintMode;
        state.pOViewMode = modeObj.pOViewMode;
    },
    resetPONoticeArray: function(state) {
        state.pONoticeArray = [];
    },
    updatePONoticeArray: function(state, pONoticeArray) {
        state.pONoticeArray = [];
        pONoticeArray.forEach(function(noticeMessage) {
            state.pONoticeArray.push(noticeMessage.string);
        });
    },
    addToPOShipmentSummary: function(state, shipment) {
        state.pOShipmentList.forEach((pOShipment) => {
            if (pOShipment.id === shipment.id) {
                pOShipment.selected = true;
            }
        });
        if (state.pOShipmentSummary.length > 0) {
            let summaryItem = state.pOShipmentSummary.filter((summaryItem) => {
                return (
                    (summaryItem.CUS_NO === shipment.CUS_NO) &&
                    (summaryItem.PRD_NO === shipment.PRD_NO) &&
                    (summaryItem.typeId === shipment.typeId) &&
                    (summaryItem.unitPrice === shipment.unitPrice)
                );
            });
            if (summaryItem[0] !== undefined) {
                summaryItem[0].workingWeight += shipment.workingWeight;
                summaryItem[0].summarizedEntryCount++;
            } else {
                state.pOShipmentSummary.push({
                    CUS_NO: shipment.CUS_NO,
                    PRD_NO: shipment.PRD_NO,
                    PRDT_SNM: shipment.PRDT_SNM,
                    typeId: shipment.typeId,
                    specification: shipment.specification,
                    unitPrice: shipment.unitPrice,
                    workingWeight: shipment.workingWeight,
                    UT: shipment.UT,
                    summarizedEntryCount: 1
                });
            }
        } else {
            state.pOShipmentSummary.push({
                CUS_NO: shipment.CUS_NO,
                PRD_NO: shipment.PRD_NO,
                PRDT_SNM: shipment.PRDT_SNM,
                typeId: shipment.typeId,
                specification: shipment.specification,
                unitPrice: shipment.unitPrice,
                workingWeight: shipment.workingWeight,
                UT: shipment.UT,
                summarizedEntryCount: 1
            });
        }
    },
    removeFromPOShipmentSummary: (state, shipment) => {
        state.pOShipmentList.forEach((pOShipment) => {
            if (pOShipment.id === shipment.id) {
                pOShipment.selected = false;
            }
        });
        let summaryItem = state.pOShipmentSummary.filter((summaryItem) => {
            return (
                (summaryItem.CUS_NO === shipment.CUS_NO) &&
                (summaryItem.PRD_NO === shipment.PRD_NO) &&
                (summaryItem.typeId === shipment.typeId) &&
                (summaryItem.unitPrice === shipment.unitPrice)
            );
        });
        if (summaryItem[0] === undefined) {
            alert('訂單進貨合計資料內容讀取錯誤');
            sessionStorage.clear();
            emptyStoreValue(state);
        } else {
            summaryItem[0].workingWeight -= shipment.workingWeight;
            summaryItem[0].summarizedEntryCount--;
            let emptyItemList = [];
            state.pOShipmentSummary.forEach((summaryItem, index) => {
                if (summaryItem.summarizedEntryCount === 0) {
                    emptyItemList.push(index);
                }
            });
            emptyItemList.reverse();
            emptyItemList.forEach((itemIndex) => {
                state.pOShipmentSummary.splice(itemIndex, 1);
            });
        }
    },
    resetPOShipmentSummary: function(state) {
        state.pOShipmentSummary = [];
    },
    resetPOShipmentList: function(state) {
        state.pOShipmentSummary = [];
        state.pOShipmentList = [];
    },
    switchPOWorkingSupplier: function(state, CUS_NO) {
        state.pOWorkingSupplier = CUS_NO;
    },
    updatePOShipmentList: function(state, pOShipmentList) {
        state.pOShipmentSummary = [];
        state.pOShipmentList = null;
        state.pOShipmentList = pOShipmentList;
    },
    // dateInEditMode specific
    switchDateInEditMode: function(state, date) { state.dateInEditMode = date; },
    turnOffEditMode: function(state) { state.dateInEditMode = null; },
    // processingData specific
    processingDataSwitch: function(state, onOffSwitch) {
        state.processingData = onOffSwitch;
    },
    // applies to multiple properties
    rebuildData: function(state, dataObject) {
        for (let objectIndex in dataObject) {
            state[objectIndex] = null;
            state[objectIndex] = dataObject[objectIndex];
        }
    },
    */

    // ////////////////////////////////////////////////////////////
    // utility functions
    restoreToken: restoreToken, // restore token if exists
    // activeView specific
    forceViewChange: function(state, role) { state.activeView = role; },
    redirectUser: function(state) { state.activeView = state.role; },
    // general vuex store data manipulation
    buildStore: buildStore, // initialize the store from ajax data
    resetStore: resetStore, // empty the store with default value
    // working material manipulation
    selectRawMaterial: selectRawMaterial,
    // workingMonth and workingYear manipulation
    setWorkingTime: setWorkingTime
};

function buildStore(state, responseList) {
    let dataObject = {};
    responseList.forEach((response) => {
        Object.assign(dataObject, response.data);
    });
    for (let objectIndex in dataObject) {
        state[objectIndex] = null;
        state[objectIndex] = dataObject[objectIndex];
    }
}

function resetStore(state) {
    sessionStorage.clear();
    emptyStoreValue(state);
}

function restoreToken(state, token) {
    state.accessExp = moment.unix(decode(token).exp).format('HH:mm');
    state.loginId = decode(token, { complete: true }).payload.loginId;
    state.role = decode(token, { complete: true }).payload.role;
    state.token = token;
    state.userData = decode(token, { complete: true }).payload;
    state.activeView = state.role;
}

function selectRawMaterial(state, selectedIndex) {
    state.selectedRawMatIndex = selectedIndex;
}

function setWorkingTime(state, payload) {
    state.workingMonth = payload.workingMonth;
    state.workingYear = payload.workingYear;
}
