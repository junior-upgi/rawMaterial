import Vue from 'vue';
import VueResource from 'vue-resource';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { store } from '../store/store.js';
Vue.use(VueResource);

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
        }
    },
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            currentContent: null
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
        }
    },
    created: function() {
        this.initMonthlyMemo({
            type: 'initMonthlyMemo',
            selectedYear: this.selectedYear,
            selectedMonth: this.selectedMonth
        });
    },
    updated: function() {
        let monthlyMemoBulletin = document.getElementById('monthlyMemoBulletin');
        monthlyMemoBulletin.scrollTop = monthlyMemoBulletin.scrollHeight;
    },
    template: `
        <footer class="navbar-fixed-bottom">
            <div class="panel panel-primary">
                <div class="panel-heading">{{bulletinTitle}}</div>
                <div class="panel-body">
                    <textarea class="form-control" id="monthlyMemoBulletin" rows="5" placeholder="請輸入備忘項目" style="width:100%;border:none;resize:none;" v-model="currentContent" @blur="updateMemo(currentContent)"></textarea>
                </div>
            </div>
        </footer>`
};
