export default {
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'login';
        }
    },
    getRole: function(state) {
        return state.role;
    },
    getUserName: function(state) {
        return state.userName;
    }
};
