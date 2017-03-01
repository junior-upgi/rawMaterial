<template>
    <tbody>
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
</tbody>
</template>

<script>
    import dailySummaryRecord from './dailySummaryRecord.vue';
    import editPane from './editPane.vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'monthlySummary',
        components: {
            dailySummaryRecord,
            editPane
        },
        props: ['dateInEditMode'],
        computed: {
            ...mapGetters({
                shipmentSchedule: 'filteredShipmentSchedule',
                shipmentSummary: 'filteredShipmentSummary'
            })
        },
        methods: {
            filterShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return shipment.workingDate === this.dateInEditMode;
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
