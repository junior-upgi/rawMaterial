export default {
    checkDataProcessingState: function(state) { return state.processingData; },
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'login';
        }
    },
    getRawMatList: function(state) { return state.rawMatList; },
    getRawMaterialTypeList: function(state) { return state.rawMatTypeList; },
    getRole: function(state) { return state.role; },
    getReleventShipmentSchedule: function(state) {
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
    getSelectedRawMat: function(state) { return state.rawMatList[state.selectedRawMatIndex]; },
    getSelectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    getShipmentSchedule: function(state) { return state.shipmentSchedule; },
    getUserName: function(state) { return state.userData.NAME; }
};
