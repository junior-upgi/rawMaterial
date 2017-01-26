import { mapGetters, mapMutations, mapActions } from 'vuex';

import { store } from '../store/store.js';

export let scheduleSelector = {
    name: 'scheduleSelector',
    store: store,
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            yearList: 'getYearList'
        })
    },
    data: function() {
        return {
            monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        };
    },
    methods: {
        ...mapActions({
            initPlanSchedule: 'initPlanSchedule',
            initMonthlyMemo: 'initMonthlyMemo'
        }),
        ...mapMutations({
            updateStatusMessage: 'updateStatusMessage',
            newYearSelection: 'newYearSelection',
            newMonthSelection: 'newMonthSelection'
        }),
        selectYear: function(newYearSelection) {
            if (newYearSelection !== this.selectedYear) {
                this.newYearSelection(newYearSelection);
                this.updateStatusMessage(`讀取 ${this.selectedYear} 年 ${this.selectedMonth} 月份進貨資料...`);
                this.initPlanSchedule({
                    type: 'initPlanSchedule',
                    selectedYear: this.selectedYear,
                    selectedMonth: this.selectedMonth
                });
                this.updateStatusMessage(`${this.selectedYear} 年 ${this.selectedMonth + 1} 月份留言板初始化...`);
                this.initMonthlyMemo({
                    type: 'initMonthlyMemo',
                    selectedYear: newYearSelection,
                    selectedMonth: this.selectedMonth
                });
            }
        },
        selectMonth: function(newMonthSelection) {
            if (newMonthSelection !== this.selectedMonth) {
                this.newMonthSelection(newMonthSelection);
                this.updateStatusMessage(`讀取 ${this.selectedYear} 年 ${this.selectedMonth} 月份進貨資料...`);
                this.initPlanSchedule({
                    type: 'initPlanSchedule',
                    selectedYear: this.selectedYear,
                    selectedMonth: newMonthSelection
                });
                this.updateStatusMessage(`${this.selectedYear} 年 ${this.selectedMonth + 1} 月份留言板初始化...`);
                this.initMonthlyMemo({
                    type: 'initMonthlyMemo',
                    selectedYear: this.selectedYear,
                    selectedMonth: newMonthSelection
                });
            }
        }
    },
    template: `
        <ul class="nav navbar-nav">
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">{{ selectedYear }}&nbsp;<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li v-for="year in yearList" v-on:click="selectYear(year)"><a style="font-size: 6px;">{{ year }}</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">{{ monthList[selectedMonth] }}&nbsp;<span class="caret"></span></a>
                <ul style="font-size: 6px;" class="dropdown-menu">
                    <li style="font-size: 6px;" v-for="(month, index) in monthList" v-on:click="selectMonth(index)"><a style="font-size: 6px;">{{ month }}</a></li>
                </ul>
            </li>
        </ul>`
};
