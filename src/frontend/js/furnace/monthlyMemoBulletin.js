import { mapActions, mapGetters, mapMutations } from 'vuex';
import { store } from '../store/store.js';

export let monthlyMemoBulletin = {
    name: 'monthlyMemoBulletin',
    store: store,
    computed: { ...mapGetters({
            monthlyMemoStatus: 'getMonthlyMemoStatus',
            monthlyMemo: 'getMonthlyMemo'
        }),
        bulletinTitle: function() {
            if ((this.currentContent !== this.monthlyMemo) && (this.monthlyMemoStatus === true)) {
                return `${this.selectedYear} 年 ${this.selectedMonth + 1} 月份注意事項留言板 (新增內容待儲存)`;
            } else {
                return `${this.selectedYear} 年 ${this.selectedMonth + 1} 月份注意事項留言板`;
            }
        },
        memoSize: function() { // v-bind to rows property of the textarea (for minimizing)
            if (this.minimizedState) {
                return 1;
            } else {
                return 10;
            }
        },
        disallowEdit: function() { // v-bind to disabled property of the textarea (past bulletin does not allow edit)
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            if (currentYear < this.selectedYear) {
                return false;
            } else if (currentYear > this.selectedYear) {
                return true;
            } else {
                return currentMonth > this.selectedMonth ? true : false;
            }
        }
    },
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            currentContent: null,
            minimizedState: true
        };
    },
    watch: {
        monthlyMemo: function(value) {
            if (this.monthlyMemoStatus) {
                this.currentContent = value;
                let monthlyMemoBulletin = document.getElementById('monthlyMemoBulletin');
                monthlyMemoBulletin.scrollTop = monthlyMemoBulletin.scrollHeight;
            }
        },
        monthlyMemoStatus: function(loadingStatus) {
            if (!loadingStatus) { this.currentContent = null; }
        }
    },
    methods: {
        ...mapActions({
            initMonthlyMemo: 'initMonthlyMemo',
            updateMonthlyMemo: 'updateMonthlyMemo'
        }),
        ...mapMutations({ updateStatusMessage: 'updateStatusMessage' }),
        updateMemo: function(currentContent) {
            if (currentContent !== this.monthlyMemo) {
                this.updateMonthlyMemo({
                    type: 'updateMonthlyMemo',
                    selectedYear: this.selectedYear,
                    selectedMonth: this.selectedMonth,
                    content: this.currentContent
                });
            }
        },
        minimizeToggle: function() { // reverse minimize toggle of the bulletin pane
            this.minimizedState = !this.minimizedState;
        }
    },
    created: function() {
        this.updateStatusMessage(`${this.selectedYear} 年 ${this.selectedMonth + 1} 月份留言板初始化...`);
        this.initMonthlyMemo({
            type: 'initMonthlyMemo',
            selectedYear: this.selectedYear,
            selectedMonth: this.selectedMonth
        });
    },
    updated: function() { // keeps the textarea to always scroll to bottom at refresh
        let monthlyMemoBulletin = document.getElementById('monthlyMemoBulletin');
        monthlyMemoBulletin.scrollTop = monthlyMemoBulletin.scrollHeight;
    },
    template: `
        <footer class="navbar-fixed-bottom">
            <div class="panel panel-primary" style="border:none;">
                <div class="panel-heading">
                    <template v-if="minimizedState">
                        <span class="glyphicon glyphicon-triangle-top" @click="minimizeToggle"></span> {{bulletinTitle}}
                    </template>
                    <template v-else>
                        <span class="glyphicon glyphicon-triangle-bottom" @click="minimizeToggle"></span> {{bulletinTitle}}
                    </template>
                </div>
                <div class="panel-body">
                    <textarea
                        id="monthlyMemoBulletin" placeholder="請輸入備忘項目"
                        style="width:100%;border:none;resize:none;"
                        class="form-control"
                        :rows="memoSize"
                        :disabled="disallowEdit"
                        v-model="currentContent"
                        @blur="updateMemo(currentContent)"></textarea>
                </div>
            </div>
        </footer>`
};
