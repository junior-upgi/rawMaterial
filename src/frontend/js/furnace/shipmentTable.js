import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapGetters, mapActions } from 'vuex';

import { store } from '../store/store.js';

export let shipmentTable = {
    name: 'shipmentTable',
    store: store,
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
            updatePlanSchedule: 'updatePlanSchedule'
        })
    },
    created: function() {
        this.updatePlanSchedule({ type: 'updatePlanSchedule', selectedYear: this.selectedYear, selectedMonth: this.selectedMonth });
    },
    template: `
        <table class="table table-striped table-hover">
            <thead>
                <th class="text-center"></th>
                <th class="text-center"><strong>需求日期</strong></th>
                <th class="text-center"><strong>原料項目</strong></th>
                <th class="text-center"><strong>需求數量</strong></th>
                <th class="text-center"><strong>進場日期</strong></th>
                <th><strong>備註</strong></th>
            </thead>
            <tbody>
                <tr v-if="planSchedule.length===0">
                    <td colspan="6" class="text-center">
                        <h4>{{selectedYear}} 年度 {{selectedMonth+1}} 月份查無資料</h4>
                    </td>
                </tr>
                <template v-else>
                    <template v-if="PRD_NO===null">
                        <tr v-for="shipment in planSchedule" v-if="((!shipment.deprecated) || (showRevision))">
                            <td></td>
                            <td class="text-center">{{shipment.requestDate}}</td>
                            <td>
                                <small>
                                    {{shipment.CUS_SNM}}&nbsp;{{shipment.PRDT_SNM}}&nbsp;{{shipment.specification}}
                                </small>
                            </td>
                            <td class="text-center">{{shipment.quantity}}</td>
                            <td></td>
                            <td>{{shipment.note}}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="shipment in planSchedule" v-if="(shipment.PRD_NO === PRD_NO) && ((!shipment.deprecated) || (showRevision))">
                            <td></td>
                            <td class="text-center">{{shipment.requestDate}}</td>
                            <td>
                                <small>
                                    {{shipment.CUS_SNM}}&nbsp;{{shipment.PRDT_SNM}}&nbsp;{{shipment.specification}}
                                </small>
                            </td>
                            <td class="text-center">{{shipment.quantity}}</td>
                            <td></td>
                            <td>{{shipment.note}}</td>
                        </tr>
                    <template>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6">
                        <h4>注意事項</h4>
                        <textarea rows="6" style="width:100%;border:none;"></textarea>
                    </td>
                </tr>
            </tfoot>
        </table>`
};
