import numeral from 'numeral';
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
        convertToWeekday: function(dateString) {
            let weekdayIndex = new Date(dateString).getDay();
            return this.weekdayList[weekdayIndex];
        },
        showEstWeight: function(estWeight, unitOfMeasure) {
            return `預計 ${numeral(estWeight).format('0,0')} ${unitOfMeasure}`;
        },
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
    filters: {
        toTonnage: function(value) {
            return `${numeral(Math.round(value / 1000)).format('0,0')} 噸`;
        }
    },
    template: `
        <tr class="row">
            <!-- action buttons -->
            <td>
                <s v-if="shipment.deprecated"></s>
                <template v-else>
                    <button type="button" class="btn btn-danger btn-xs" v-on:click="cancelShipment({type:'cancelShipment',shipment:shipment})">
                        <span class="glyphicon glyphicon-trash"></span><small>取消</small>
                    </button>
                </template>
            </td>
            <!-- requestDate -->
            <td class="text-center">
                <s v-if="shipment.deprecated"><small>{{shipment.requestDate}}&nbsp;{{convertToWeekday(shipment.requestDate)}}</small></s>
                <template v-else>{{shipment.requestDate}}&nbsp;{{convertToWeekday(shipment.requestDate)}}</template>
            </td>
            <!-- composite field display what kind of rawMat shipment is scheduled -->
            <td>
                <small>
                    <s v-if="shipment.deprecated"><small>{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</small></s>
                    <template v-else>
                        {{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}
                    </template>
                </small>
            </td>
            <!-- scheduled q'ty of truck shipments -->
            <td class="text-center">
                <s v-if="shipment.deprecated"><small>{{shipment.quantity}}</small></s>
                <input v-else class="form-control input-sm text-center" type="number" min="1" v-model="shipment.quantity" :title="shipment.estWeight|toTonnage" />
            </td>

            <!--  v-on:focus="recordReqQty(shipment.quantity)" v-on:blur="updateReqQtyTriggered({type:'reviseShipment',shipment:shipment})" -->

            <!-- date of arrival -->
            <td>
                <s v-if="shipment.deprecated"><small>{{shipment.arrivalDate}}</small></s>
                <input v-else class="form-control input-sm text-center" type="date" v-model="shipment.arrivalDate" />
            </td>
            <!-- weight on supplier's shipment bill -->
            <td>
                <s v-if="shipment.deprecated"><small>{{shipment.supplierWeight}}</small></s>
                <input v-else class="form-control input-sm text-center" type="number" min="1" v-model="shipment.supplierWeight" />
            </td>
            <!-- full truck enter weight -->
            <td>
                <s v-if="shipment.deprecated"><small>{{shipment.fullWeight}}</small></s>
                <input v-else class="form-control input-sm text-center" type="number" min="1" v-model="shipment.fullWeight" />
            </td>
            <!-- empty truck exit weight -->
            <td>
                <s v-if="shipment.deprecated"><small>{{shipment.emptyWeight}}</small></s>
                <input v-else class="form-control input-sm text-center" type="number" min="1" v-model="shipment.emptyWeight" />
            </td>
            <!-- notes -->
            <td>
                <s v-if="shipment.deprecated"><small>{{shipment.note}}</small></s>
                <input v-else class="form-control input-sm text-center" type="text" maxlength="255" v-model="shipment.note" />
            </td>
        </tr>`
};
