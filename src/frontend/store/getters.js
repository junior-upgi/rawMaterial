import moment from 'moment-timezone';

export default {
    checkDataProcessingState: function(state) { return state.processingData; },
    checkDateInEditMode: function(state) { return state.dateInEditMode; },
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
                let scheduledYear = parseInt(moment(shipment.requestDate).format('YYYY'));
                let scheduledMonth = parseInt(moment(shipment.requestDate).format('M'));
                return (
                    (shipment.CUS_NO === selectedRawMaterial.CUS_NO) &&
                    (shipment.PRD_NO === selectedRawMaterial.PRD_NO) &&
                    (shipment.typeId === selectedRawMaterial.typeId) &&
                    (scheduledMonth === state.workingMonth) &&
                    (scheduledYear === state.workingYear)
                );
            });
            return releventShipmentSchedule;
        }
        return [];
    },
    getMonthlyScheduleSummary: function(state) {
        if ((state.rawMatList !== null) && (state.rawMatList.length !== 0)) {
            let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
            let eleventscheduleSummary = state.scheduleSummary.filter((dailyShipment) => {
                let scheduledYear = parseInt(moment(dailyShipment.requestDate).format('YYYY'));
                let scheduledMonth = parseInt(moment(dailyShipment.requestDate).format('M'));
                return (
                    (dailyShipment.CUS_NO === selectedRawMaterial.CUS_NO) &&
                    (dailyShipment.PRD_NO === selectedRawMaterial.PRD_NO) &&
                    (dailyShipment.typeId === selectedRawMaterial.typeId) &&
                    (scheduledMonth === state.workingMonth) &&
                    (scheduledYear === state.workingYear)
                );
            });
            return eleventscheduleSummary;
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
    getShipmentSchedule: function(state) { return state.shipmentSchedule; },
    getUserName: function(state) { return state.userData.NAME; },
    getWorkingMonth: function(state) { return state.workingMonth; },
    getWorkingYear: function(state) { return state.workingYear; }
};
