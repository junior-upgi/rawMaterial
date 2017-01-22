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
        })
    },
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            currentContent: null
        };
    },
    watch: {
        monthlyMemo: function(value) {
            if (this.monthlyMemoStatus) { this.currentContent = value; }
        },
        monthlyMemoStatus: function(loadingStatus) {
            if (!loadingStatus) { this.currentContent = null; }
        }
        /* ,
        selectedYear: function(newYearSelection) {
            this.currentContent = null;
            this.initMonthlyMemo({
                type: 'initMonthlyMemo',
                selectedYear: newYearSelection,
                selectedMonth: this.selectedMonth
            });
        },
        selectedMonth: function(newMonthSelection) {
            this.currentContent = null;
            this.initMonthlyMemo({
                type: 'initMonthlyMemo',
                selectedYear: this.selectedYear,
                selectedMonth: newMonthSelection
            });
        }
        */
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
        <textarea style="width:100%;border:none;" v-model="currentContent"></textarea>`
};
