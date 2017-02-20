export default {
    checkDataProcessingState: function(state) { return state.processingData; },
    checkDateInEditMode: function(state) { return state.dateInEditMode; },
    checkPOPrintMode: function(state) { return state.pOPrintMode; },
    checkPOViewMode: function(state) { return state.pOViewMode; },
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'login';
        }
    },
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
    getMonthlyScheduleSummary: function(state) {
        if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
            let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
            let releventscheduleSummary = state.scheduleSummary.filter((dailyShipment) => {
                return (
                    (dailyShipment.CUS_NO === selectedRawMaterial.CUS_NO) &&
                    (dailyShipment.PRD_NO === selectedRawMaterial.PRD_NO) &&
                    (dailyShipment.typeId === selectedRawMaterial.typeId)
                );
            });
            return releventscheduleSummary;
        }
        return [];
    },
    getRawMatList: function(state) { return state.rawMatList; },
    getRawMaterialTypeList: function(state) { return state.rawMatTypeList; },
    getRole: function(state) { return state.role; },
    getScheduleSummary: function(state) { return state.scheduleSummary; },
    getSelectedRawMat: function(state) {
        if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
            return state.rawMatList[state.selectedRawMatIndex];
        }
        return {};
    },
    getSelectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    getShipmentOverview: function(state) { return state.shipmentOverview; },
    getShipmentSchedule: function(state) { return state.shipmentSchedule; },
    getTonnageSummary: function(state) { return state.tonnageSummary; },
    getUserName: function(state) { return state.userData.NAME; },
    getWorkingMonth: function(state) { return state.workingMonth; },
    getWorkingSupplier: function(state) { return state.workingSupplier; },
    getWorkingYear: function(state) { return state.workingYear; }
};
