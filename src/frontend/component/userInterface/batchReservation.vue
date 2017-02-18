<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;進廠預約作業
            </h4>
        </div>
        <div class="panel-body">
            <raw-material-selector></raw-material-selector>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr class="info">
                        <td v-for="weekdayIndex in 7" class="text-center">
                            <span class="badge">{{weekdayList[weekdayIndex-1]}}<span>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="weekIndex in weekCount">
                        <td v-for="weekdayIndex in 7">
                            <reservation-cell
                                v-if="visible(weekIndex,weekdayIndex)"
                                :cellDateString="cellDate(weekIndex,weekdayIndex)"
                                :dailyShipmentList="dailyShipmentFilter(weekIndex,weekdayIndex)">
                            </reservation-cell>
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
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import reservationCell from './reservationCell.vue';
    import workingTimeSelector from './workingTimeSelector.vue';

    export default {
        name: 'batchReservation',
        components: {
            rawMaterialSelector,
            reservationCell,
            workingTimeSelector
        },
        computed: {
            ...mapGetters({
                rawMatList: 'getRawMatList',
                monthlyScheduleSummary: 'getMonthlyScheduleSummary',
                selectedRawMat: 'getSelectedRawMat',
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            }),
            weekCount: function() {
                let firstOfMonth = new Date(this.workingYear, this.workingMonth - 1, 1);
                let lastOfMonth = new Date(this.workingYear, this.workingMonth, 0);
                return Math.ceil((firstOfMonth.getDay() + 1 + (lastOfMonth.getDate() - firstOfMonth.getDate())) / 7);
            }
        },
        data: function() {
            return {
                weekdayList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
            };
        },
        methods: {
            cellDate: function(weekIndex, weekdayIndex) {
                return moment(
                    new Date(
                        this.workingYear,
                        parseInt(this.workingMonth) - 1,
                        this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirst()
                    )
                ).format('YYYY-MM-DD');
            },
            cellIndex: function(weekIndex, weekdayIndex) {
                return (parseInt(weekIndex) - 1) * 7 + parseInt(weekdayIndex);
            },
            dailyShipmentFilter: function(weekIndex, weekdayIndex) {
                return this.monthlyScheduleSummary.filter((dailyShipmentSummary) => {
                    return dailyShipmentSummary.workingDate === this.cellDate(weekIndex, weekdayIndex);
                });
            },
            lastOfMonth: function() {
                return parseInt(
                    moment(
                        new Date(
                            this.workingYear,
                            this.workingMonth - 1,
                            1)
                    )
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
                return new Date(
                        this.workingYear,
                        this.workingMonth - 1,
                        1)
                    .getDay();
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
