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
            return `  ${this.selectedYear} 年 ${this.selectedMonth + 1} 月份注意事項留言板`;
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
        ...mapActions({ initMonthlyMemo: 'initMonthlyMemo' }),
        ...mapMutations({ updateStatusMessage: 'updateStatusMessage' })
    },
    created: function() {
        this.initMonthlyMemo({
            type: 'initMonthlyMemo',
            selectedYear: this.selectedYear,
            selectedMonth: this.selectedMonth
        });
    },
    template: `
        <footer class="navbar-fixed-bottom">
            <textarea class="form-control" id="monthlyMemoBulletin" rows="10" :placeholder="bulletinTitle" style="width:100%;resize:none;background-color:#B3FFFF;" v-model="currentContent"></textarea>
            <br>
        </footer>`
};
