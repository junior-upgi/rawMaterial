import { store } from './store/store.js';
import { mapGetters } from 'vuex';

export default {
    name: 'statusComponent',
    store: store,
    computed: { ...mapGetters({
            statusMessage: 'getLastStatusMessage',
            accessExp: 'getAccessExp'
        })
    },
    template: `
        <footer class="navbar-fixed-bottom" style="background-color:white;">
            <div class="col-xs-8 text-left">
                <span>{{ statusMessage }}</span>
            </div>
            <div class="col-xs-4 text-right">
                使用權限到期時間:&nbsp;<span>{{ accessExp }}</span>
            </div>
        </footer>`
};
