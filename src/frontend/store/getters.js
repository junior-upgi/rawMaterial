export default {
    checkDateInEditMode: function(state) { return state.dateInEditMode; },
    checkPOPrintMode: function(state) { return state.pOPrintMode; },
    checkPOViewMode: function(state) { return state.pOViewMode; },
    checkPOCreateMode: function(state) { return state.pOCreateMode; },
    checkPOEditMode: function(state) { return state.pOEditMode; },
    getPONoticeArray: function(state) { return state.pONoticeArray; },
    getPOShipmentList: function(state) { return state.pOShipmentList; },
    getPOShipmentSummary: function(state) { return state.pOShipmentSummary; },
    getPOWorkingSupplier: function(state) { return state.pOWorkingSupplier; },
    getRawMatList: function(state) { return state.rawMatList; },
    getRawMaterialTypeList: function(state) { return state.rawMatTypeList; },
    getSelectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    getShipmentOverview: function(state) { return state.shipmentOverview; },
    getSupplyingSpecList: function(state) { return state.supplyingSpecList; },
    getTonnageSummary: function(state) { return state.tonnageSummary; },
    getUserName: function(state) { return state.userData.NAME; },
    getWorkingMonth: function(state) { return state.workingMonth; },
    getWorkingYear: function(state) { return state.workingYear; },
    // purchase order
    pOList: function(state) { return state.pOList; },
    getMonthlySchedule: function(state) {
        if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
            let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
            let releventShipmentSchedule = state.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.CUS_NO === selectedRawMaterial.CUS_NO) &&
                    (shipment.PRD_NO === selectedRawMaterial.PRD_NO) &&
                    (shipment.typeId === selectedRawMaterial.typeId)
                );
            });
            return releventShipmentSchedule;
        }
        return [];
    },

    // /////////////////////////////////////////////////////////////
    // application state
    checkDataProcessingState: function(state) { return state.processingData; },
    selectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    selectedRawMaterial: selectedRawMaterial,
    workingSupplierDetail: workingSupplierDetail,
    workingMonth: function(state) { return state.workingMonth; },
    workingYear: function(state) { return state.workingYear; },
    activeShipmentEditorDate: function(state) { return state.activeShipmentEditorDate; },
    // user info and permission
    activeView: activeView,
    role: function(state) { return state.role; },
    userData: function(state) { return state.userData; },
    // basic data set
    rawMaterialList: function(state) { return state.rawMatList; },
    rawMaterialTypeList: function(state) { return state.rawMatTypeList; },
    supplierList: function(state) { return state.supplierList; },
    workingMaterial: function(state) { return state.workingMaterial; },
    // schedule data
    // filteredShipmentScheduleByCusNo: filteredShipmentScheduleByCusNo,
    // filteredShipmentScheduleByPrdNo: filteredShipmentScheduleByPrdNo,
    // filteredShipmentSummaryByPrdNo: filteredShipmentSummaryByPrdNo,
    shipmentSchedule: function(state) { return state.shipmentSchedule; },
    shipmentSummary: function(state) { return state.shipmentSummary; },
    newShipmentRequestList: newShipmentRequestList,
    newRequestSummary: function(state) { return state.newRequestSummary; },
    consolidatedReceivingRecord: function(state) { return state.consolidatedReceivingRecord; },
    receivingRecord: function(state) { return state.receivingRecord; },
    monthlyShipmentOverview: function(state) { return state.monthlyShipmentOverview; },
    // purchase order
    activePOList: function(state) { return state.activePOList; },
    pOContentSummary: function(state) { return state.pOContentSummary; }
};

function activeView(state) {
    if (state.activeView) {
        return state.activeView;
    } else {
        return 'login';
    }
}

function selectedRawMaterial(state) {
    return state.rawMatList[state.selectedRawMatIndex];
}

function workingSupplierDetail(state) {
    let workingSupplierDetail = state.supplierList.filter((supplier) => {
        return supplier.CUS_NO === state.rawMatList[state.selectedRawMatIndex].CUS_NO;
    });
    return workingSupplierDetail[0];
}

function newShipmentRequestList(state) {
    return state.shipmentSchedule.filter((shipment) => {
        return (
            (shipment.deprecated === null) &&
            (shipment.pOId === null)
        );
    });
}

/*
function filteredShipmentScheduleByCusNo(state) {
    let list = state.shipmentSchedule.filter((shipmentScheduleItem) => {
        return shipmentScheduleItem.CUS_NO === state.rawMatList[state.selectedRawMatIndex].CUS_NO;
    });
    return list;
}

function filteredShipmentScheduleByPrdNo(state) {
    if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
        let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
        let list = state.shipmentSchedule.filter((shipmentScheduleItem) => {
            return shipmentScheduleItem.PRD_NO === selectedRawMaterial.PRD_NO;
        });
        return list;
    }
    return [];
}

function filteredShipmentSummaryByPrdNo(state) {
    if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
        let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
        let list = state.shipmentSummary.filter((shipmentSummaryItem) => {
            return shipmentSummaryItem.PRD_NO === selectedRawMaterial.PRD_NO;
        });
        return list;
    }
    return [];
}
*/
