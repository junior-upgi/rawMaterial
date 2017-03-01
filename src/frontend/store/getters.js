export default {
    checkDateInEditMode: function(state) { return state.dateInEditMode; },
    checkPOPrintMode: function(state) { return state.pOPrintMode; },
    checkPOViewMode: function(state) { return state.pOViewMode; },
    checkPOCreateMode: function(state) { return state.pOCreateMode; },
    checkPOEditMode: function(state) { return state.pOEditMode; },
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'login';
        }
    },
    getPONoticeArray: function(state) { return state.pONoticeArray; },
    getPOShipmentList: function(state) { return state.pOShipmentList; },
    getPOShipmentSummary: function(state) { return state.pOShipmentSummary; },
    getPOWorkingSupplier: function(state) { return state.pOWorkingSupplier; },
    getRawMatList: function(state) { return state.rawMatList; },
    getRawMaterialTypeList: function(state) { return state.rawMatTypeList; },
    getSelectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    getShipmentOverview: function(state) { return state.shipmentOverview; },
    getSupplierList: function(state) { return state.supplierList; },
    getSupplyingSpecList: function(state) { return state.supplyingSpecList; },
    getTonnageSummary: function(state) { return state.tonnageSummary; },
    getUserName: function(state) { return state.userData.NAME; },
    getUserData: function(state) { return state.userData; },
    getWorkingMonth: function(state) { return state.workingMonth; },
    getWorkingMaterial: function(state) { return state.workingMaterial; },
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
    // user permission
    role: function(state) { return state.role; },
    // working raw material
    rawMaterialList: function(state) { return state.rawMatList; },
    selectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    selectedRawMaterial: selectedRawMaterial,
    // working time period
    workingMonth: function(state) { return state.workingMonth; },
    workingYear: function(state) { return state.workingYear; },
    // schedule data
    shipmentSchedule: function(state) { return state.shipmentSchedule; },
    shipmentSummary: function(state) { return state.shipmentSummary; },
    filteredShipmentSchedule: filteredShipmentSchedule,
    filteredShipmentSummary: filteredShipmentSummary
};

function filteredShipmentSchedule(state) {
    if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
        let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
        let filteredShipmentSchedule = state.shipmentSchedule.filter((shipmentScheduleItem) => {
            return shipmentScheduleItem.PRD_NO === selectedRawMaterial.PRD_NO;
        });
        return filteredShipmentSchedule;
    }
    return [];
}

function filteredShipmentSummary(state) {
    if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
        let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
        let filteredShipmentSummary = state.shipmentSummary.filter((shipmentSummaryItem) => {
            return shipmentSummaryItem.PRD_NO === selectedRawMaterial.PRD_NO;
        });
        return filteredShipmentSummary;
    }
    return [];
}

function selectedRawMaterial(state) {
    if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
        return state.rawMatList[state.selectedRawMatIndex];
    } else {
        return {};
    }
}
