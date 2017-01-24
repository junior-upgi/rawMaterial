import moment from 'moment-timezone';
import numeral from 'numeral';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapActions } from 'vuex';

import { store } from '../store/store.js';

export let shipmentEntry = {
    name: 'shipmentEntry',
    store: store,
    props: ['shipment'],
    computed: {
        isWeekend: function() {
            let weekdayIndex = new Date(this.shipment.requestDate).getDay();
            if ((weekdayIndex === 0) || (weekdayIndex === 6)) {
                return true;
            } else {
                return false;
            }
        },
        isToday: function() {
            let today = moment(new Date(), 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
            return (today === this.shipment.requestDate) ? true : false;
        }
    },
    data: function() {
        return {
            prestine: null,
            tempRecord: {
                quantity: this.shipment.quantity,
                arrivalDate: this.shipment.arrivalDate,
                supplierWeight: this.shipment.supplierWeight,
                fullWeight: this.shipment.fullWeight,
                emptyWeight: this.shipment.emptyWeight,
                note: this.shipment.note
            }
        };
    },
    created: function() {
        this.prestine = true;
    },
    watch: {
        shipment: function(updatedShipmentObject) {
            this.restoreRecord();
        }
    },
    methods: {
        ...mapActions({
            cancelShipment: 'cancelShipment',
            updateRecord: 'updateRecord'
        }),
        restoreRecord: function() {
            this.tempRecord.quantity = this.shipment.quantity;
            this.tempRecord.arrivalDate = this.shipment.arrivalDate;
            this.tempRecord.supplierWeight = this.shipment.supplierWeight;
            this.tempRecord.fullWeight = this.shipment.fullWeight;
            this.tempRecord.emptyWeight = this.shipment.emptyWeight;
            this.tempRecord.note = this.shipment.note;
            this.prestine = true;
        },
        checkArrivalDate: function() {
            let limit = moment(moment(), 'YYYY-MM-DD HH:mm:ss');
            let arrivalDate = moment(this.tempRecord.arrivalDate, 'YYYY-MM-DD');
            if (arrivalDate > limit) {
                return false;
            } else {
                return true;
            }
        },
        processEmptyField: function(fieldName) {
            // change empty field to null for eaiser backend handling
            if ((this.tempRecord[fieldName] === '') && (this.shipment[fieldName] === null)) {
                this.tempRecord[fieldName] = null;
            }
        },
        checkForDifference: function(fieldName) {
            // checking if any actual modification exists
            let diffCount = 0; // hold count of difference
            for (let index in this.tempRecord) { // loop through tempRecord properties
                // compare each property with data from shipment record(original value)
                if (this.tempRecord[index] !== this.shipment[index]) {
                    diffCount++; // count difference
                }
            }
            this.prestine = (diffCount > 0) ? false : true; // if count is greater than 0, than mark dirty(unprestine)
        },
        markUnprestine: function(fieldName) {
            switch (fieldName) {
                case 'quantity':
                    if (this.tempRecord.quantity === '') {
                        alert('預約車次必須有數值且大於\'1\'，若要取消請使用取消按鈕。\n\n資料將還原至原始狀態');
                        this.restoreRecord();
                        break;
                    } else {
                        this.checkForDifference(fieldName);
                        break;
                    }
                case 'arrivalDate':
                    // check date so no future date is picked
                    if (!this.checkArrivalDate()) {
                        alert('到場日期不可為未來日期。\n\n資料將還原至原始狀態');
                        this.restoreRecord();
                        break;
                    } else {
                        this.processEmptyField(fieldName);
                        this.checkForDifference(fieldName);
                        break;
                    }
                default:
                    this.processEmptyField(fieldName);
                    this.checkForDifference(fieldName);
                    break;
            }
        },
        submitUpdate: function() {
            let confirmationMessage = `請確認是否修改 ${this.shipment.requestDate} ${this.shipment.PRDT_SNM} 的進貨預約資料`;
            if (confirm(confirmationMessage)) {
                let payload = {
                    type: 'updateRecord',
                    original: this.shipment,
                    updated: {
                        quantity: this.tempRecord.quantity,
                        arrivalDate: this.tempRecord.arrivalDate,
                        supplierWeight: this.tempRecord.supplierWeight,
                        fullWeight: this.tempRecord.fullWeight,
                        emptyWeight: this.tempRecord.emptyWeight,
                        note: this.tempRecord.note
                    }
                };
                this.updateRecord(payload);
            }
        }
    },
    filters: {
        toTonnage: function(value, origQty, tempQty) {
            return `${numeral(Math.round((value / origQty * tempQty) / 1000)).format('0,0')} 噸`;
        },
        formatWeight: function(value, unit) {
            return `${numeral(value).format('0,0')} ${unit}`;
        },
        toWeekday: function(dateString) {
            let weekdayList = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
            let weekdayIndex = new Date(dateString).getDay();
            return weekdayList[weekdayIndex];
        }
    },
    template: `
        <tr class="row" :class="{'bg-danger':isWeekend,'bg-primary':isToday}">
            <!-- cancel buttons -->
            <td class="text-center">
                <button v-if="(!shipment.deprecated)&&(!shipment.finalized)" type="button" class="btn btn-danger btn-sm" @click="cancelShipment({type:'cancelShipment',shipment:shipment})">
                    <span class="glyphicon glyphicon-trash"></span>&nbsp;<small>取消</small>
                </button>
                <template v-else-if="!shipment.finalized"><span class="glyphicon glyphicon-trash"></span>&nbsp;<b><small>取消</small></b></template>
                <template v-else><span class="glyphicon glyphicon-ok-circle"></span>&nbsp;<b><small>結案</small></b></template>
            </td>
            <!-- requestDate -->
            <td class="text-center">
                <s v-if="shipment.deprecated"><small>{{shipment.requestDate}}&nbsp;{{shipment.requestDate|toWeekday}}</small></s>
                <b v-else-if="shipment.finalized"><small>{{shipment.requestDate}}&nbsp;{{shipment.requestDate|toWeekday}}</small></b>
                <template v-else><small>{{shipment.requestDate}}&nbsp;{{shipment.requestDate|toWeekday}}</small></template>
            </td>
            <!-- composite field display what kind of rawMat shipment is scheduled -->
            <td>
                <small>
                    <s v-if="shipment.deprecated"><small>{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</small></s>
                    <b v-else-if="shipment.finalized"><small>{{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}</small></b>
                    <template v-else>
                        {{shipment.PRDT_SNM}}&nbsp;【{{shipment.CUS_SNM}}】&nbsp;{{shipment.specification}}
                    </template>
                </small>
            </td>
            <!-- scheduled q'ty of truck shipments -->
            <td class="text-center">
                <s v-if="shipment.deprecated"><small>{{shipment.quantity}}</small></s>
                <b v-else-if="shipment.finalized"><small>{{shipment.quantity}}</small></b>
                <input v-else class="form-control input-sm text-center" type="number" min="1" v-model="tempRecord.quantity" :title="shipment.estWeight|toTonnage(shipment.quantity,tempRecord.quantity)" @change="markUnprestine('quantity')" style="border:none;" />
            </td>
            <!-- date of arrival -->
            <td class="text-center">
                <s v-if="shipment.deprecated"><small>{{shipment.arrivalDate}}</small></s>
                <b v-else-if="shipment.finalized">&nbsp;<small>{{shipment.arrivalDate}}</small></b>
                <input v-else class="form-control input-sm text-center" type="date" v-model="tempRecord.arrivalDate" @change="markUnprestine('arrivalDate')" style="border:none;" />
            </td>
            <!-- weight on supplier's shipment bill -->
            <td class="text-right">
                <span v-if="shipment.deprecated && shipment.supplierWeight===null"></span>
                <span v-else-if="shipment.deprecated">
                    <s><small>{{shipment.supplierWeight|formatWeight(shipment.UT)}}</small></s>&nbsp;
                </span>
                <b v-else-if="shipment.finalized">&nbsp;<small>{{shipment.supplierWeight|formatWeight(shipment.UT)}}</small>&nbsp;</b>
                <input v-else class="form-control input-sm text-right" type="number" min="1" v-model="tempRecord.supplierWeight" @change="markUnprestine('supplierWeight')" style="border:none;" />
            </td>
            <!-- full truck enter weight -->
            <td class="text-right">
                <span v-if="shipment.deprecated && shipment.fullWeight===null"></span>
                <span v-else-if="shipment.deprecated">
                    <s><small>{{shipment.fullWeight|formatWeight(shipment.UT)}}</small></s>&nbsp;
                </span>
                <b v-else-if="shipment.finalized">&nbsp;<small>{{shipment.fullWeight|formatWeight(shipment.UT)}}</small>&nbsp;</b>
                <input v-else class="form-control input-sm text-right" type="number" min="1" v-model="tempRecord.fullWeight" @change="markUnprestine('fullWeight')" style="border:none;" />
            </td>
            <!-- empty truck exit weight -->
            <td class="text-right">
                <span v-if="shipment.deprecated && shipment.emptyWeight===null"></span>
                <span v-else-if="shipment.deprecated">
                    <s><small>{{shipment.emptyWeight|formatWeight(shipment.UT)}}</small></s>&nbsp;
                </span>
                <b v-else-if="shipment.finalized">&nbsp;<small>{{shipment.emptyWeight|formatWeight(shipment.UT)}}</small>&nbsp;</b>
                <input v-else class="form-control input-sm text-right" type="number" min="1" v-model="tempRecord.emptyWeight" @change="markUnprestine('emptyWeight')" style="border:none;" />
            </td>
            <!-- notes -->
            <td>
                <span v-if="shipment.deprecated">
                    &nbsp;<s><small>{{shipment.note}}</small></s>
                </span>
                <b v-else-if="shipment.finalized">&nbsp;<small>{{shipment.note}}</small></b>
                <input v-else class="form-control input-sm" type="text" maxlength="255" v-model="tempRecord.note" @change="markUnprestine('note')" style="border:none;" />
            </td>
            <!-- save buttons -->
            <td class="text-center">
                <button v-if="(!shipment.deprecated)&&(!shipment.finalized)" :disabled="prestine" type="button" class="btn btn-success btn-sm" @click="submitUpdate">
                    <span class="glyphicon glyphicon-pencil"></span>&nbsp;<small>儲存</small>
                </button>
            </td>
            <!-- restore buttons -->
            <td class="text-center">
                <button v-if="(!shipment.deprecated)&&(!shipment.finalized)" :disabled="prestine" type="button" class="btn btn-primary btn-sm" @click="restoreRecord">
                    <span class="glyphicon glyphicon-refresh"></span>&nbsp;<small>還原</small>
                </button>
            </td>
        </tr>`
};
