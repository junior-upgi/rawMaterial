<template>
    <tr>
        <td>
            <span class="badge">{{index+1}}</span>
        </td>
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
    </tr>
</template>

<script>
    import { mapGetters, mapActions, mapMutations } from 'vuex';
    import submitControl from './submitControl.vue';

    export default {
        name: 'shipmentEditor',
        components: { submitControl },
        props: ['index', 'shipment'],
        data: function() {
            return {
                requestDate: null,
                arrivalDate: null,
                workingDate: null,
                actualWeight: null,
                supplierWeight: null,
                note: null
            };
        },
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
