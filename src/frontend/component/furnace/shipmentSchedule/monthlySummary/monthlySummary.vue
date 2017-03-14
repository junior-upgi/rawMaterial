<template>
    <div
        v-if="releventShipmentSchedule.length > 0"
        class="panel-group" id="monthlySummary" role="tablist">
        <dailySummaryItem
            v-for="index in daysInCurrentWorkingMonth"
            :workingDateString="getWorkingDateString(index + 1)"
            :workingDay="index + 1"
            :shipmentSchedule="releventShipmentSchedule"
            @editModeToggled="editModeToggled($event)">
        </dailySummaryItem>
    </div>
    <div v-else>尚無下單資料</div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import dailySummaryItem from './dailySummaryItem.vue';

    export default {
        name: 'monthlySummary',
        components: {
            dailySummaryItem
            // editPane
        },
        computed: {
            ...mapGetters({
                selectedRawMaterial: 'selectedRawMaterial',
                shipmentSchedule: 'shipmentSchedule',
                workingYear: 'workingYear',
                workingMonth: 'workingMonth'
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
        methods: {
            getWorkingDateString: function(workingDay) {
                return moment(new Date(this.workingYear, this.workingMonth - 1, workingDay)).format('YYYY-MM-DD');
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
