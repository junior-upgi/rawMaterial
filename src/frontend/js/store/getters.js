export default {
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'login';
        }
    },
    getToken: function(state) { return state.token; },
    getLoginId: function(state) { return state.loginId; },
    getRole: function(state) { return state.role; },
    getAccessExp: function(state) { return state.accessExp; },
    getLastStatusMessage: function(state) { return state.lastStatusMessage; },
    getSelectedYear: function(state) { return state.yearSelected; },
    getSelectedMonth: function(state) { return state.monthSelected; },
    getShowRevision: function(state) { return state.showRevision; },
    getPlanSchedule: function(state) { return state.planSchedule; },
    getRawMatList: function(state) { return state.rawMatList; },
    getSupplierErpId: function(state) { return state.CUS_NO; },
    getRawMatErpId: function(state) { return state.PRD_NO; },
    getTypeId: function(state) { return state.typeId; },
    getMonthlyMemoStatus: function(state) { return state.monthlyMemoLoaded; },
    getSelectedRawMatIndex: function(state) { return state.selectedRawMatIndex; },
    getEnableBatchReservation: function(state) { return state.enableBatchReservation; },
    getMonthlyMemo: function(state) {
        if (state.monthlyMemoLoaded === false) {
            return null;
        } else {
            return state.monthlyMemo;
        }
    },
    getRelevantSchedule: function(state) {
        let relevantSchedule = [];
        let selectedRawMaterial = state.rawMatList[state.selectedRawMatIndex];
        state.planSchedule.forEach(function(shipment) {
            if (
                (shipment.CUS_NO === selectedRawMaterial.CUS_NO) &&
                (shipment.PRD_NO === selectedRawMaterial.PRD_NO) &&
                (shipment.typeId === selectedRawMaterial.typeId)
            ) {
                relevantSchedule.push(shipment);
            }
        });
        return relevantSchedule;
    },
    getBatchReservationQueue: function(state) {
        return state.batchReservationQueue;
    },
    getYearList: function(state) {
        return state.yearList;
    }
};
