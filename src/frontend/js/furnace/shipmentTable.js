import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapGetters, mapActions } from 'vuex';

import { store } from '../store/store.js';

import { shipmentEntry } from './shipmentEntry.js';

let emptyShipmentScheduleEntry = {
    name: 'emptyShipmentScheduleEntry',
    props: ['selectedYear', 'selectedMonth'],
    template: `
        <tr>
            <td colspan="9" class="text-center">
                <h4>{{selectedYear}} 年 {{selectedMonth+1}} 月份查無資料</h4>
            </td>
        </tr>`
};

export let shipmentTable = {
    name: 'shipmentTable',
    store: store,
    data: function() {
        return {
            originalValue: null,
            weekdayList: ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)']
        };
    },
    components: {
        'emptyShipmentScheduleEntry': emptyShipmentScheduleEntry,
        'shipmentEntry': shipmentEntry
    },
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            showRevision: 'getShowRevision',
            planSchedule: 'getPlanSchedule',
            PRD_NO: 'getRawMatErpId'
        })
    },
    methods: {
        ...mapActions({
            updatePlanSchedule: 'updatePlanSchedule',
            cancelShipment: 'cancelShipment',
            reviseReqQty: 'reviseReqQty'
        })
    },
    created: function() {
        this.updatePlanSchedule({ type: 'updatePlanSchedule', selectedYear: this.selectedYear, selectedMonth: this.selectedMonth });
    },
    template: `
        <table class="table table-striped table-hover table-condensed">
            <thead>
                <th class="text-center"></th>
                <th class="text-center"><strong>需求日期</strong></th>
                <th class="text-center"><strong>原料項目</strong></th>
                <th class="text-center"><strong>預約車次</strong></th>
                <th class="text-center"><strong>進場日期</strong></th>
                <th class="text-center"><strong>出車秤重</strong></th>
                <th class="text-center"><strong>入廠秤重</strong></th>
                <th class="text-center"><strong>出廠秤重</strong></th>
                <th><strong>備註</strong></th>
            </thead>
            <tbody>
                <emptyShipmentScheduleEntry v-if="planSchedule.length===0" :selected-year="selectedYear" :selected-month="selectedMonth"></emptyShipmentScheduleEntry>
                <template v-else>
                    <template v-if="PRD_NO===null">
                        <shipmentEntry v-for="shipment in planSchedule" v-if="((!shipment.deprecated)||(showRevision))" :shipment="shipment"></shipmentEntry>
                    </template>
                    <template v-else>
                        <shipmentEntry v-for="shipment in planSchedule" v-if="(shipment.PRD_NO === PRD_NO)&&((!shipment.deprecated)||(showRevision))" :shipment="shipment"></shipmentEntry>
                    <template>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="9">
                        <h4>注意事項</h4>
                        <textarea rows="5" style="width:100%;border:none;"></textarea>
                    </td>
                </tr>
            </tfoot>
        </table>`
};