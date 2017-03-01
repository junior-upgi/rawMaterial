<template>
    <tr>
        <td>
            <span class="label label-default" v-if="finalized">已結案</span>
            <span class="label label-primary" v-if="received && !finalized">已入廠</span>
            <span class="label label-success" v-if="confirmed && !received">訂單確認</span>
            <span class="label label-info" v-if="ordered && !confirmed">已下單</span>
            <span class="label label-warning" v-if="requested && !ordered && !confirmed">未下單</span>
            <span class="label label-danger" v-if="pending">異常</span>
        </td>
        <td>{{index}}</td>
        <workingDateCell
            :workingDate="shipment.workingDate">
        </workingDateCell>
        <supplierWeightCell
            :supplierWeight="shipment.supplierWeight">
        </supplierWeightCell>
        <actualWeightCell
            :actualWeight="shipment.actualWeight">
        </actualWeightCell>
        <noteCell
            :note="shipment.note">
        </noteCell>
        <td></td>
        <!--
        <td>
            <span v-if="shipment.pOId!==null" class="glyphicon glyphicon-ok-sign"></span>
            <span v-if="shipment.pOId!==null">已下單</span>
            <span v-if="shipment.pOId===null" class="glyphicon glyphicon-question-sign"></span>
            <span v-if="shipment.pOId===null">未下單</span>
        </td>
        <td><span class="badge">{{index+1}}</span></td>
        <td>
            <input
                type="date"
                class="form-control input-sm text-center"
                style="border:0px;"
                :disabled="dataProcessingState?true:false"
                v-model.lazy="workingDate" />
        </td>
        <td>
            <input
                type="number"
                class="form-control input-sm text-center valueInput"
                style="border:0px;"
                min="1000"
                max="99999"
                step="1"
                :disabled="!isPastDate()||dataProcessingState?true:false"
                v-model.lazy.number="supplierWeight" />
        </td>
        <td>
            <input
                type="number"
                pattern="[0-9.]+"
                class="form-control input-sm text-center valueInput"
                style="border:0px;"
                min="1000"
                max="99999"
                step="1"
                :disabled="!isPastDate()||dataProcessingState?true:false"
                v-model.lazy.number="actualWeight" />
        </td>
        <td>
            <input
                type="text"
                class="form-control input-sm"
                style="border:0px;"
                :disabled="dataProcessingState?true:false"
                v-model.lazy.trim="note" />
        </td>
        <submit-control
            :pristine="pristine"
            :shipped="shipped"
            :weightDataReady="weightDataReady"
            :workingDateReady="workingDateReady"
            @cancel="cancelShipment()"
            @update="updateShipment()">
        </submit-control>
        -->
    </tr>
</template>

<script>
    import workingDateCell from './workingDateCell.vue';
    import supplierWeightCell from './supplierWeightCell.vue';
    import actualWeightCell from './actualWeightCell.vue';
    import noteCell from './noteCell.vue';
    // import { mapGetters, mapActions, mapMutations } from 'vuex';
    // import submitControl from './submitControl.vue';

    export default {
        name: 'shipmentEditor',
        components: {
            workingDateCell,
            supplierWeightCell,
            actualWeightCell,
            noteCell
        },
        props: ['index', 'shipment'],
        data: function() {
            return {
                workingDate: null,
                actualWeight: null,
                supplierWeight: null,
                note: null
            };
        },
        computed: {
            finalized: function() { return this.shipment.LZ_CLS_ID === 'T' ? true : false; },
            received: function() {
                if (
                    (this.shipment.actualWeight && this.shipment.supplierWeight) &&
                    (
                        (this.shipment.actualWeight === this.shipment.PS_QTY) ||
                        (this.shipment.supplierWeight === this.shipment.PS_QTY)
                    )
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            confirmed: function() { return ((this.shipment.OS_NO !== null) && (this.shipment.PRE_ID === 'T')) ? true : false; },
            ordered: function() { return ((this.shipment.OS_NO !== null) && (this.shipment.PRE_ID !== 'T')) ? true : false; },
            requested: function() { return this.shipment.SQ_NO !== null ? true : false; },
            pending: function() {
                if (
                    (!this.finalized) &&
                    (!(this.received && !this.finalized)) &&
                    (!(this.confirmed && !this.received)) &&
                    (!(this.ordered && !this.confirmed)) &&
                    (!(this.requested && !this.ordered && !this.confirmed))
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        /* ,
        components: { submitControl },
        computed: {
            ...mapGetters({ dataProcessingState: 'checkDataProcessingState' }),
            pristine: function() {
                return (
                    (this.shipment.workingDate === this.workingDate) &&
                    (this.shipment.supplierWeight === this.supplierWeight) &&
                    (this.shipment.actualWeight === this.actualWeight)
                ) ? true : false;
            },
            shipped: function() {
                return this.shipment.received ? true : false;
            },
            weightDataReady: function() {
                return ((this.supplierWeight !== null) === (this.actualWeight !== null));
            },
            workingDateReady: function() {
                return this.workingDate !== null;
            }
        },
        watch: {
            actualWeight: function(newValue) {
                if ((newValue === '') || (newValue <= 1000) || (newValue > 99999)) { this.actualWeight = null; }
            },
            note: function(newNoteText) {
                if (newNoteText === '') { this.note = null; }
                this.updateNote();
            },
            supplierWeight: function(newValue) {
                if ((newValue === '') || (newValue <= 1000) || (newValue > 99999)) { this.supplierWeight = null; }
            },
            workingDate: function(newDate) {
                if (newDate === '') { this.workingDate = null; }
            }
        },
        created: function() {
            this.requestDate = this.shipment.requestDate;
            this.arrivalDate = this.shipment.arrivalDate;
            this.workingDate = this.shipment.workingDate;
            this.actualWeight = this.shipment.actualWeight;
            this.supplierWeight = this.shipment.supplierWeight;
            this.note = this.shipment.note;
        },
        methods: {
            ...mapActions({
                updateShipmentAction: 'updateShipment',
                cancelShipmentAction: 'cancelShipment'
            }),
            ...mapMutations({
                rebuildData: 'rebuildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            cancelShipment: function() {
                this.processingDataSwitch(true);
                this.cancelShipmentAction({
                    id: this.shipment.id
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨取消發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            },
            isPastDate: function() {
                let today = new Date();
                let referenceDate = new Date(this.workingDate);
                today.setHours(0, 0, 0, 0);
                referenceDate.setHours(0, 0, 0, 0);
                return (referenceDate <= today) ? true : false;
            },
            updateNote: function() {
                this.processingDataSwitch(true);
                this.updateShipmentAction({
                    id: this.shipment.id,
                    note: this.note
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨備註資料寫入發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            },
            updateShipment: function() {
                this.processingDataSwitch(true);
                this.updateShipmentAction({
                    id: this.shipment.id,
                    workingDate: this.workingDate,
                    supplierWeight: this.supplierWeight,
                    actualWeight: this.actualWeight,
                    note: this.note
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨資料寫入發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            },
            removeData: function() {
                this.processingDataSwitch(true);
                this.workingDate = this.shipment.workingDate;
                this.supplierWeight = null;
                this.actualWeight = null;
                this.note = null;
                this.updateShipment({
                    id: this.shipment.id,
                    workingDate: null,
                    supplierWeight: null,
                    actualWeight: null,
                    note: null
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨資料登入發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            }
        }
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    input.valueInput::-webkit-inner-spin-button,
    input.valueInput::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
