<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector
                    @workingTimeChange="dateInEditMode=null">
                </workingTimeSelector>
                &nbsp;進廠預約作業
            </h4>
        </div>
        <div class="panel-body">
            <workingMaterialSelector
                @workingMaterialChange="dateInEditMode=null">
            </workingMaterialSelector>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr class="info">
                        <td v-for="weekdayIndex in 7" class="text-center">
                            <span class="label label-primary">{{weekdayList[weekdayIndex-1]}}</span>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="weekIndex in weekCount">
                        <td v-for="weekdayIndex in 7">
                            <reservationCell
                                v-if="visible(weekIndex,weekdayIndex)"
                                :cellDateString="cellDate(weekIndex,weekdayIndex)"
                                :shipmentSchedule="filterShipmentSchedule(cellDate(weekIndex,weekdayIndex))"
                                :shipmentSummary="filterShipmentSummary(weekIndex,weekdayIndex)">
                            </reservationCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import workingTimeSelector from '../../common/workingTimeSelector.vue';
    import workingMaterialSelector from '../../common/workingMaterialSelector.vue';
    import reservationCell from './reservationCell.vue';

    export default {
        name: 'batchReservation',
        components: {
            workingMaterialSelector,
            workingTimeSelector,
            reservationCell
        },
        data: function() {
            return {
                weekdayList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
            };
        },
        computed: {
            ...mapGetters({
                rawMaterialList: 'rawMaterialList',
                shipmentSchedule: 'filteredShipmentSchedule',
                shipmentSummary: 'filteredShipmentSummary',
                selectedRawMaterial: 'selectedRawMaterial',
                workingMonth: 'workingMonth',
                workingYear: 'workingYear'
            }),
            weekCount: function() {
                let firstOfMonth = new Date(this.workingYear, this.workingMonth - 1, 1);
                let lastOfMonth = new Date(this.workingYear, this.workingMonth, 0);
                return Math.ceil((firstOfMonth.getDay() + 1 + (lastOfMonth.getDate() - firstOfMonth.getDate())) / 7);
            }
        },
        methods: {
            cellDate: function(weekIndex, weekdayIndex) {
                return moment(
                    new Date(
                        this.workingYear,
                        this.workingMonth - 1,
                        this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirst()
                    )
                ).format('YYYY-MM-DD');
            },
            cellIndex: function(weekIndex, weekdayIndex) {
                return (parseInt(weekIndex) - 1) * 7 + parseInt(weekdayIndex);
            },
            filterShipmentSchedule: function(dateString) {
                return this.shipmentSchedule.filter((shipment) => {
                    return shipment.workingDate === dateString;
                });
            },
            filterShipmentSummary: function(weekIndex, weekdayIndex) {
                return this.shipmentSummary.filter((shipmentSummaryItem) => {
                    return shipmentSummaryItem.workingDate === this.cellDate(weekIndex, weekdayIndex);
                });
            },
            lastOfMonth: function() {
                return parseInt(
                    moment(new Date(this.workingYear, this.workingMonth - 1, 1))
                    .add(1, 'month')
                    .subtract(1, 'day')
                    .format('D'));
            },
            visible: function(weekIndex, weekdayIndex) {
                let cellIndex = this.cellIndex(weekIndex, weekdayIndex);
                return (
                    (cellIndex > this.weekdayOfFirst()) &&
                    (cellIndex - this.weekdayOfFirst()) <= this.lastOfMonth()
                );
            },
            weekdayOfFirst: function() {
                return new Date(this.workingYear, this.workingMonth - 1, 1).getDay();
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
