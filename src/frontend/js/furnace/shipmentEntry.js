import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapGetters, mapActions } from 'vuex';

import { store } from '../store/store.js';

export let shipmentEntry = {
    name: 'shipmentEntry',
    store: store,
    props: ['shipment'],
    data: function() {
        return {
            originalValue: null,
            weekdayList: ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)']
        };
    },
    computed: { ...mapGetters({}) },
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
        },
        convertToWeekday: function(dateString) {
            let weekdayIndex = new Date(dateString).getDay();
            return this.weekdayList[weekdayIndex];
        }
    },
    template: `
        <tr>
            <td>
                <s v-if="shipment.deprecated"></s>
                <template v-else>
                    <button type="button" class="btn btn-danger btn-xs" v-on:click="cancelShipment({type:'cancelShipment',shipment:shipment})">
                        <span class="glyphicon glyphicon-trash"></span><small>取消</small>
                    </button>
                </template>
            </td>
            <td class="text-center">
                <s v-if="shipment.deprecated">{{shipment.requestDate}}&nbsp;{{convertToWeekday(shipment.requestDate)}}</s>
                <template v-else>{{shipment.requestDate}}&nbsp;{{convertToWeekday(shipment.requestDate)}}</template>
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
                <s v-if="shipment.deprecated"></s>
                <template v-else></template>
            </td>
            <td>
                <s v-if="shipment.deprecated"></s>
                <template v-else></template>
            </td>
            <td>
                <s v-if="shipment.deprecated"></s>
                <template v-else></template>
            </td>
            <td>
                <s v-if="shipment.deprecated">{{shipment.note}}</s>
                <template v-else>{{shipment.note}}</template>
            </td>
        </tr>`
};
