import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapGetters, mapActions } from 'vuex';

import { store } from '../store/store.js';

export let shipmentTable = {
    name: 'shipmentTable',
    store: store,
    data: function() { return { originalValue: null }; },
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
        }),
        recordReqQty: function(originalValue) {
            this.originalValue = originalValue;
        },
        updateReqQtyTriggered: function(payload) {
            if (this.originalValue !== payload.shipment.quantity) {
                let confirmationMessage = `請確認是否修改 ${payload.shipment.requestDate} ${payload.shipment.PRDT_SNM} 需求數量`;
                if (confirm(confirmationMessage)) {
                    this.reviseReqQty(payload);
                } else {
                    this.originalValue = null;
                    this.updatePlanSchedule({ type: 'updatePlanSchedule', selectedYear: this.selectedYear, selectedMonth: this.selectedMonth });
                }
            }
        }
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
                            <td>
                                <s v-if="shipment.deprecated"></s>
                                <template v-else>
                                    <button type="button" class="btn btn-danger btn-xs" v-on:click="cancelShipment({type:'cancelShipment',shipment:shipment})">
                                        <span class="glyphicon glyphicon-trash"></span> <small>取消</small>
                                    </button>
                                </template>
                            </td>
                            <td class="text-center">
                                <s v-if="shipment.deprecated">{{shipment.requestDate}}</s>
                                <template v-else>{{shipment.requestDate}}</template>
                            </td>
                            <td>
                                <small>
                                    <s v-if="shipment.deprecated">{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</s>
                                    <template v-else>{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</template>
                                </small>
                            </td>
                            <td class="text-center">
                                <s v-if="shipment.deprecated">{{shipment.quantity}}</s>
                                <input class="form-control input-sm text-center" type="number" min="1" v-else v-model="shipment.quantity" v-on:focus="recordReqQty(shipment.quantity)" v-on:blur="updateReqQtyTriggered({type:'reviseShipment',shipment:shipment})">
                            </td>
                            <td>
                                <s v-if="shipment.deprecated"></s>
                                <template v-else></template>
                            </td>
                            <td>
                                <s v-if="shipment.deprecated">{{shipment.note}}</s>
                                <template v-else>{{shipment.note}}</template>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="shipment in planSchedule" v-if="(shipment.PRD_NO === PRD_NO) && ((!shipment.deprecated) || (showRevision))">
                            <td>
                                <s v-if="shipment.deprecated"></s>
                                <template v-else>
                                    <button type="button" class="btn btn-danger btn-xs" v-on:click="cancelShipment({type:'cancelShipment',shipment:shipment})">
                                        <span class="glyphicon glyphicon-trash"></span> <small>取消</small>
                                    </button>
                                </template>
                            </td>
                            <td class="text-center">
                                <s v-if="shipment.deprecated">{{shipment.requestDate}}</s>
                                <template v-else>{{shipment.requestDate}}</template>
                            </td>
                            <td>
                                <small>
                                    <s v-if="shipment.deprecated">{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</s>
                                    <template v-else>{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</template>
                                </small>
                            </td>
                            <td class="text-center" contenteditable="true">
                                <s v-if="shipment.deprecated">{{shipment.quantity}}</s>
                                <input class="form-control input-sm text-center" type="number" min="1" v-else v-model="shipment.quantity" v-on:focus="recordReqQty(shipment.quantity)" v-on:blur="updateReqQtyTriggered({type:'reviseShipment',shipment:shipment})">
                            </td>
                            <td>
                                <s v-if="shipment.deprecated"></s>
                                <template v-else></template>
                            </td>
                            <td>
                                <s v-if="shipment.deprecated">{{shipment.note}}</s>
                                <template v-else>{{shipment.note}}</template>
                            </td>
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
