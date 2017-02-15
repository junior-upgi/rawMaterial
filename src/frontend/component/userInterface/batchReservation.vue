<script>
    import moment from 'moment-timezone';
    import { mapGetters, mapMutations } from 'vuex';
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import reservationCell from './reservationCell.vue';

    export default {
        name: 'batchReservation',
        components: {
            rawMaterialSelector,
            reservationCell
        },
        computed: {
            ...mapGetters({
                rawMatList: 'getRawMatList',
                releventDailyShipmentScheduleSummary: 'getReleventDailyShipmentScheduleSummary',
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
            ...mapMutations({
                nextWorkingMonth: 'nextWorkingMonth',
                prevWorkingMonth: 'prevWorkingMonth'
            }),
            cellDate: function(weekIndex, weekdayIndex) {
                return moment(new Date(this.workingYear, parseInt(this.workingMonth) - 1, this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirst())).format('YYYY-MM-DD');
            },
            cellIndex: function(weekIndex, weekdayIndex) {
                return (parseInt(weekIndex) - 1) * 7 + parseInt(weekdayIndex);
            },
            releventDailyShipmentSummaryFilter: function(weekIndex, weekdayIndex) {
                let releventDailyShipmentSummary = this.releventDailyShipmentScheduleSummary.filter((dailyShipment) => {
                    return dailyShipment.requestDate === this.cellDate(weekIndex, weekdayIndex);
                });
                return releventDailyShipmentSummary[0];
            },
            lastOfMonth: function() {
                return parseInt(moment(new Date(this.workingYear, this.workingMonth - 1, 1)).add(1, 'month').subtract(1, 'day').format('D'));
            },
            visible: function(weekIndex, weekdayIndex) {
                return (this.cellIndex(weekIndex, weekdayIndex) > this.weekdayOfFirst()) && ((this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirst()) <= this.lastOfMonth());
            },
            weekdayOfFirst: function() {
                return new Date(this.workingYear, this.workingMonth - 1, 1).getDay();
            }
        }
    };

</script>

<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <button class="btn btn-primary" style="border:0px;" @click="prevWorkingMonth">
                    <span class="glyphicon glyphicon-triangle-left"></span>
                </button>
                &nbsp;{{workingYear}} 年 {{workingMonth}} 月份&nbsp;
                <button class="btn btn-primary" style="border:0px;" @click="nextWorkingMonth">
                    <span class="glyphicon glyphicon-triangle-right"></span>
                </button>
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
                        <td v-for="weekdayIndex in 7" class="text-center">{{weekdayList[weekdayIndex-1]}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="weekIndex in weekCount">
                        <td v-for="weekdayIndex in 7">
                            <reservation-cell
                                v-if="visible(weekIndex,weekdayIndex)"
                                :cell-date-string="cellDate(weekIndex,weekdayIndex)"
                                :dailyShipment="releventDailyShipmentSummaryFilter(weekIndex,weekdayIndex)">
                            </reservation-cell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
