import { store } from './store/store.js';
import { mapGetters } from 'vuex';

export default {
    name: 'statusComponent',
    store: store,
    computed: {
        ...mapGetters({
            statusMessage: 'getLastStatusMessage',
            accessExp: 'getAccessExp'
        }),
        expired: function() { return this.countdownTimer > 0 ? false : true; }
    },
    data: function() {
        return {
            countdownTimer: 5,
            countdownTracker: null,
            elapsedTimer: 0,
            elapsedTimeTracker: null
        };
    },
    created: function() { this.resetCountdownTimer(); },
    mounted: function() { this.startCountdownTimer(); },
    watch: {
        statusMessage: function(newMessage) {
            this.revokeCountdownTimer();
            this.startCountdownTimer();
        }
    },
    methods: {
        resetCountdownTimer: function() {
            this.countdownTimer = 5;
            this.elaspedTimer = 0;
        },
        startCountdownTimer: function() {
            this.resetCountdownTimer();
            this.elapsedTimeTracker = setInterval(() => {
                this.elapsedTimer++;
            }, 1000);
            this.countdownTracker = setTimeout(() => {
                this.countdownTimer = 0;
                clearInterval(this.elapsedTimeTracker);
            }, this.countdownTimer * 1000);
        },
        revokeCountdownTimer: function() {
            clearInterval(this.elapsedTimeTracker);
            clearTimeout(this.countdownTracker);
            this.resetCountdownTimer();
            this.startCountdownTimer();
        }
    },
    template: `
        <footer class="navbar-fixed-bottom" style="background-color:white;">
            <div class="col-xs-8 text-left">
                <span v-if="expired"></span>
                <span v-else>{{statusMessage}}</span>
            </div>
            <div class="col-xs-4 text-right">
                使用權限到期時間:&nbsp;<span>{{accessExp}}</span>
            </div>
        </footer>`
};
