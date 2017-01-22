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
    getRawMatErpId: function(state) { return state.PRD_NO; },
    getMonthlyMemoStatus: function(state) { return state.monthlyMemoLoaded; },
    getMonthlyMemo: function(state) {
        if (state.monthlyMemoLoaded === false) {
            return null;
        } else {
            return state.monthlyMemo;
        }
    }
};
