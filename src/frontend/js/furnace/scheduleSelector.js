import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapGetters, mapMutations, mapActions } from 'vuex';

import { store } from '../store/store.js';

import { serverUrl } from '../config.js';

export let scheduleSelector = {
    name: 'scheduleSelector',
    store: store,
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth'
        })
    },
    data: function() {
        return {
            yearList: [],
            monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        };
    },
    created: function() {
        this.updateStatusMessage('進度選項初始化...');
        Vue.http.get(`${serverUrl}/data/availability`, {
            headers: { 'x-access-token': sessionStorage.token }
        }).then((response) => {
            this.password = '';
            response.json().then((recordset) => {
                recordset.forEach((record) => {
                    this.yearList.push(record.year);
                });
            });
        }, (error) => {
            error.json().then((error) => {
                this.updateStatusMessage(`請向IT反應 (錯誤: ${error.errorMessage})`);
            });
        });
    },
    mounted: function() {
        setTimeout(() => { this.updateStatusMessage(''); }, 2000);
    },
    methods: {
        ...mapActions({
            updatePlanSchedule: 'updatePlanSchedule'
        }),
        ...mapMutations({
            updateStatusMessage: 'updateStatusMessage',
            newYearSelection: 'newYearSelection',
            newMonthSelection: 'newMonthSelection'
        }),
        selectYear: function(newYearSelection) {
            this.newYearSelection(newYearSelection);
            this.updatePlanSchedule({ type: 'updatePlanSchedule', selectedYear: this.selectedYear, selectedMonth: this.selectedMonth });
        },
        selectMonth: function(index) {
            this.newMonthSelection(index);
            this.updatePlanSchedule({ type: 'updatePlanSchedule', selectedYear: this.selectedYear, selectedMonth: index });
        }
    },
    template: `
        <ul class="nav navbar-nav">
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">{{ selectedYear }}&nbsp;<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li v-for="year in yearList" v-on:click="selectYear(year)"><a>{{ year }}</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">{{ monthList[selectedMonth] }}&nbsp;<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li v-for="(month, index) in monthList" v-on:click="selectMonth(index)"><a>{{ month }}</a></li>
                </ul>
            </li>
        </ul>`
};
