<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import { currentDatetime } from '../../utility.js';
    import reservationCell from './reservationCell.vue';

    export default {
        name: 'batchReservation',
        components: { reservationCell },
        computed: {
            ...mapGetters({
                rawMatList: 'getRawMatList',
                releventShipmentSchedule: 'getReleventShipmentSchedule'
            }),
            weekCount: function() {
                let firstOfMonth = new Date(this.workingYear, this.workingMonth - 1, 1);
                let lastOfMonth = new Date(this.workingYear, this.workingMonth, 0);
                return Math.ceil((firstOfMonth.getDay() + 1 + (lastOfMonth.getDate() - firstOfMonth.getDate())) / 7);
            }
        },
        data: function() {
            return {
                workingYear: parseInt(currentDatetime().format('YYYY')),
                workingMonth: parseInt(currentDatetime().format('M')),
                weekdayList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
            };
        },
        updated: function() {
            this.workingYear = parseInt(currentDatetime().format('YYYY'));
            this.workingMonth = parseInt(currentDatetime().format('M'));
        },
        methods: {
            cellDate: function(weekIndex, weekdayIndex) {
                return moment(new Date(this.workingYear, parseInt(this.workingMonth) - 1, this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirst())).format('YYYY-MM-DD');
            },
            cellIndex: function(weekIndex, weekdayIndex) {
                return (parseInt(weekIndex) - 1) * 7 + parseInt(weekdayIndex);
            },
            releventShipmentFilter: function(weekIndex, weekdayIndex) {
                let releventShipment = this.releventShipmentSchedule.filter((shipment) => {
                    return shipment.requestDate === this.cellDate(weekIndex, weekdayIndex);
                });
                return releventShipment[0];
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
    <div>
        <h4>{{workingYear}} 年 {{workingMonth}} 月份批次預約</h4>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr class="success">
                        <td v-for="weekdayIndex in 7" class="text-center">{{weekdayList[weekdayIndex-1]}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="weekIndex in weekCount">
                        <td v-for="weekdayIndex in 7">
                            <reservation-cell v-if="visible(weekIndex,weekdayIndex)" :cell-date-string="cellDate(weekIndex,weekdayIndex)" :shipment="releventShipmentFilter(weekIndex,weekdayIndex)"></reservation-cell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
