<template lang="html">
    <tr>
        <td>{{index}}</td>
        <statusCell :shipment="shipment" @recordStateDetermined="processRecordState($event)">
        </statusCell>
        <td>
            <del v-if="revocationPending" style="white-space:nowrap;">【{{shipment.CUST_SNM}}】{{shipment.PRDT_SNM}} - {{shipment.specification}}</del>
            <span v-else style="white-space:nowrap;">【{{shipment.CUST_SNM}}】{{shipment.PRDT_SNM}} - {{shipment.specification}}</span>
        </td>
        <workingDateCell :pOClosed="pOClosed" :revocationPending="revocationPending" :workingDateString="this.workingDate" @workingDateFieldUpdateEvent="processWorkingDateFieldUpdateEvent($event)">
        </workingDateCell>
        <td>
            <span v-if="pOClosed" style="white-space:nowrap;">{{shipment.workingWeight|tonnage}} (結案)</span>
            <del v-else-if="revocationPending" style="white-space:nowrap;">{{shipment.requestWeight|tonnage}} (需求)</del>
            <span v-else style="white-space:nowrap;">{{shipment.requestWeight|tonnage}} (需求)</span>
        </td>
        <supplierWeightCell :pOClosed="pOClosed" :pOPending="pOPending" :revocationPending="revocationPending" :isFutureDate="isFutureDate" :supplierWeight="supplierWeight" @supplierWeightFieldUpdateEvent="processSupplierWeightFieldUpdateEvent($event)">
        </supplierWeightCell>
        <actualWeightCell :pOClosed="pOClosed" :pOPending="pOPending" :revocationPending="revocationPending" :isFutureDate="isFutureDate" :actualWeight="actualWeight" @actualWeightFieldUpdateEvent="processActualWeightFieldUpdateEvent($event)">
        </actualWeightCell>
        <noteCell :revocationPending="revocationPending" :pOClosed="pOClosed" :id="this.shipment.id" :workingDate="this.shipment.workingDate" :supplierWeight="this.shipment.supplierWeight" :actualWeight="this.shipment.actualWeight" :note="this.shipment.note">
        </noteCell>
        <submitControl :pristine="pristine" :fulfilled="fulfilled" :weightDataReady="weightDataReady" :workingDateReady="workingDateReady" @submitRecordEvent="processSubmitRecordEvent()">
        </submitControl>
    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import numeral from 'numeral';
import statusCell from './statusCell.vue';
import workingDateCell from './workingDateCell.vue';
import supplierWeightCell from './supplierWeightCell.vue';
import actualWeightCell from './actualWeightCell.vue';
import noteCell from './noteCell.vue';
import submitControl from './submitControl.vue';

export default {
    name: 'shipmentRecord',
    components: {
        statusCell,
        supplierWeightCell,
        actualWeightCell,
        workingDateCell,
        noteCell,
        submitControl
    },
    props: ['index', 'shipment'],
    computed: {
        ...mapGetters({ activeShipmentEditorDate: 'activeShipmentEditorDate' }),
        fulfilled: function() {
            if (this.recordState.stateCode === 'fulfilled') { return true; } else { return false; }
        },
        revocationPending: function() {
            if (this.recordState.stateCode === 'revocationPending') { return true; } else { return false; }
        },
        pOClosed: function() {
            if (this.recordState.stateCode === 'pOClosed') { return true; } else { return false; }
        },
        pOPending: function() {
            if (this.recordState.stateCode === 'pOPending') { return true; } else { return false; }
        },
        isFutureDate: function() {
            let today = new Date();
            let referenceDate = new Date(this.shipment.workingDate);
            today.setHours(0, 0, 0, 0);
            referenceDate.setHours(0, 0, 0, 0);
            return (referenceDate > today) ? true : false;
        },
        pristine: function() {
            return (
                (this.shipment.workingDate === this.workingDate) &&
                (this.shipment.supplierWeight === this.supplierWeight) &&
                (this.shipment.actualWeight === this.actualWeight)
            ) ? true : false;
        },
        weightDataReady: function() {
            return ((this.supplierWeight !== null) === (this.actualWeight !== null));
        },
        workingDateReady: function() {
            let today = new Date();
            let referenceDate = new Date(this.workingDate);
            today.setHours(0, 0, 0, 0);
            referenceDate.setHours(0, 0, 0, 0);
            return ((this.workingDate !== null) && (referenceDate <= today)) ? true : false;
        }
    },
    data: function() {
        return {
            recordState: {
                stateCode: 'uninitialized',
                stateMessage: '待介面初始化'
            },
            workingDate: this.shipment.workingDate,
            supplierWeight: this.shipment.supplierWeight,
            actualWeight: this.shipment.actualWeight,
            note: this.shipment.note
        };
    },
    watch: {
        workingDate: function(newDateValue) {
            if (newDateValue === '') { this.workingDate = null; }
        },
        activeShipmentEditorDate: function() {
            this.workingDate = this.shipment.workingDate;
            this.supplierWeight = this.shipment.supplierWeight;
            this.actualWeight = this.shipment.actualWeight;
            this.note = this.shipment.note;
        }
    },
    filters: {
        tonnage: function(value) {
            return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
        }
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            updateShipment: 'updateShipment'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        processWorkingDateFieldUpdateEvent: function($event) {
            this.workingDate = $event;
        },
        processSupplierWeightFieldUpdateEvent: function($event) {
            this.supplierWeight = $event;
        },
        processActualWeightFieldUpdateEvent: function($event) {
            this.actualWeight = $event;
        },
        processRecordState: function(recordStateObject) { this.recordState = recordStateObject; },
        processRecordRestoreEvent: function() {
            this.workingDate = this.shipment.workingDate;
            this.supplierWeight = this.shipment.supplierWeight;
            this.actualWeight = this.shipment.actualWeight;
            this.note = this.shipment.note;
        },
        processSubmitRecordEvent: function() {
            this.processingDataSwitch(true);
            this.updateShipment({
                id: this.shipment.id,
                workingDate: this.workingDate,
                supplierWeight: this.supplierWeight,
                actualWeight: this.actualWeight
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'noteCell',
                    method: 'processSubmitRecordEvent',
                    situation: '更新進貨資料錯誤',
                    systemErrorMessage: error
                });
            });
        }
    }
};
</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
