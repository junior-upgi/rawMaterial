<template>
    <div class="panel-group" id="monthlySummary" role="tablist">
        <dailySummaryRecord
            v-for="index in daysInCurrentWorkingMonth"
            :workingDateString="getWorkingDateString(index + 1)"
            :workingDay="index + 1">
        </dailySummaryRecord>
    </div>
    <!--
    <template v-for="shipmentSummaryItem in shipmentSummary">
        <dailySummaryRecord
            :dateInEditMode="dateInEditMode"
            :shipmentSummaryItem="shipmentSummaryItem"
            @dailySummaryRecordSelected="$emit('dailySummaryRecordSelected',$event)">
        </dailySummaryRecord>
        <editPane
            v-if="shipmentSummaryItem.workingDate===dateInEditMode"
            :dateInEditMode="dateInEditMode"
            :shipmentSchedule="filterShipmentSchedule()">
        </editPane>
    </template>
    -->
    <!--
    <div class="table-responsive" style="height:500px;overflow:auto;">
    <table
        class="table table-striped"
        :class="{'table-hover':dateInEditMode===null}">
        <thead>
            <tr class="info">
                <th
                    v-for="thItem in thList"
                    class="text-center"
                    style="padding-top:3px;padding-bottom:3px;margin-top:3px;margin-bottom:3px;">
                    {{thItem}}
                </th>
            </tr>
        </thead>
        <monthlySummary
            :dateInEditMode="dateInEditMode"
            @dailySummaryRecordSelected="editModeToggle($event)">
        </monthlySummary>
    </table>
    </div>
        -->
</template>

<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import dailySummaryRecord from './dailySummaryRecord.vue';
    /*
    import editPane from './editPane.vue';
    */

    export default {
        name: 'monthlySummary',
        computed: {
            ...mapGetters({
                selectedRawMaterial: 'selectedRawMaterial',
                shipmentSchedule: 'shipmentSchedule',
                workingYear: 'workingYear',
                workingMonth: 'workingMonth'
                // shipmentSummary: 'filteredShipmentSummaryByPrdNo'
            }),
            releventShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return (
                        (new Date(shipment.workingDate).getFullYear() === this.workingYear) &&
                        ((new Date(shipment.workingDate).getMonth() + 1) === this.workingMonth) &&
                        (shipment.PRD_NO === this.selectedRawMaterial.PRD_NO)
                    );
                });
            },
            daysInCurrentWorkingMonth: function() {
                return new Date(this.workingYear, this.workingMonth, 0).getDate();
            }
        },
        components: {
            dailySummaryRecord
            // editPane
        },
        methods: {
            getWorkingDateString: function(workingDay) {
                return moment.utc(new Date(this.workingYear, this.workingMonth - 1, workingDay)).format('YYYY-MM-DD');
            }
        }
        /* ,
        data: function() {
            return {
                dateInEditMode: null,
                thList: ['狀態', '日期', '廠商', '項目', '規格', '車次', '重量']
            };
        },
        props: ['dateInEditMode'],
        methods: {
            filterShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return shipment.workingDate === this.dateInEditMode;
                });
            }
        }
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
