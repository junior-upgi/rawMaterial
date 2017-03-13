<template>
    <tr>
        <td>{{index}}</td>
        <statusCell
            :shipment="shipment"
            @recordStateDetermined="processRecordState($event)">
        </statusCell>
        <td>
            <del v-if="revocationPending" style="white-space:nowrap;">【{{shipment.CUST_SNM}}】{{shipment.PRDT_SNM}} - {{shipment.specification}}</del>
            <span v-else style="white-space:nowrap;">【{{shipment.CUST_SNM}}】{{shipment.PRDT_SNM}} - {{shipment.specification}}</span>
        </td>
        <td>
            <span v-if="pOClosed">{{shipment.workingDate}}</span>
            <del v-else-if="revocationPending">{{shipment.requestDate}}</del>
            <workingDateCell
                v-else
                :workingDateString="this.shipment.workingDate"
                :recordState="recordState"
                @workingDateUpdated="getWorkingDateValue($event)">
            </workingDateCell>
        </td>
        <td>
            <span v-if="pOClosed" style="white-space:nowrap;">{{shipment.workingWeight|tonnage}} (結案)</span>
            <span v-else style="white-space:nowrap;">{{shipment.requestWeight|tonnage}} (需求)</span>
        </td>
        <td>
            <supplierWeightCell
                v-if="!revocationPending && !isFutureDate"
                :supplierWeight="this.shipment.supplierWeight"
                :recordState="recordState"
                @supplierWeightUpdated="getSupplierWeightValue($event)">
            </supplierWeightCell>
            <span v-else>{{this.shipment.supplierWeight|tonnage}}</span>
        </td>
        <td>
            <actualWeightCell
                v-if="!revocationPending && !isFutureDate"
                :actualWeight="this.shipment.actualWeight"
                :recordState="recordState"
                @actualWeightUpdated="getActualWeightValue($event)">
            </actualWeightCell>
            <span v-else>{{this.shipment.actualWeight|tonnage}}</span>
        </td>
        <td>
            <span
                v-if="revocationPending || pOClosed"
                style="white-space:nowrap;">
                {{this.shipment.note}}
            </span>
            <noteCell
                v-else
                :id="this.shipment.id"
                :workingDate="this.shipment.workingDate"
                :supplierWeight="this.shipment.supplierWeight"
                :actualWeight="this.shipment.actualWeight"
                :note="this.shipment.note">
            </noteCell>
        </td>
        <td></td>
    </tr>
</template>

<script>
    import numeral from 'numeral';
    import statusCell from './statusCell.vue';
    import workingDateCell from './workingDateCell.vue';
    import supplierWeightCell from './supplierWeightCell.vue';
    import actualWeightCell from './actualWeightCell.vue';
    import noteCell from './noteCell.vue';

    export default {
        name: 'shipmentRecord',
        components: {
            statusCell,
            supplierWeightCell,
            actualWeightCell,
            workingDateCell,
            noteCell
        },
        props: ['index', 'shipment'],
        computed: {
            revocationPending: function() {
                if (this.recordState.stateCode === 'revocationPending') { return true; } else { return false; }
            },
            pOClosed: function() {
                if (this.recordState.stateCode === 'pOClosed') { return true; } else { return false; }
            },
            isFutureDate: function() {
                let today = new Date();
                let referenceDate = new Date(this.shipment.workingDate);
                today.setHours(0, 0, 0, 0);
                referenceDate.setHours(0, 0, 0, 0);
                return(referenceDate > today) ? true : false;
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
            }
        },
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
            }
        },
        methods: {
            getWorkingDateValue: function($event) { this.workingDate = $event; },
            getSupplierWeightValue: function($event) {
                if (($event === '') || ($event <= 1000) || ($event > 99999)) {
                    this.supplierWeight = this.shipment.supplierWeight;
                } else {
                    this.supplierWeight = $event;
                }
            },
            getActualWeightValue: function($event) {
                if (($event === '') || ($event <= 1000) || ($event > 99999)) {
                    this.actualWeight = this.shipment.actualWeight;
                } else {
                    this.actualWeight = $event;
                }
            },
            processRecordState: function(recordStateObject) { this.recordState = recordStateObject; }
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
