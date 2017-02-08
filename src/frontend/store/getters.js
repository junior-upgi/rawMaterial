export default {
    getActiveView: function(state) {
        if (state.activeView) {
            return state.activeView;
        } else {
            return 'Login';
        }
    }
};
