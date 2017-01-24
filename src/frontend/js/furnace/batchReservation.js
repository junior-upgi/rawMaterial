import moment from 'moment-timezone';

import { mapGetters } from 'vuex';

let reservationButton = {
    name: 'reservationButton',
    props: ['weekIndex', 'weekdayIndex', 'dayInMonthIndex'],
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            relevantSchedule: 'getRelevantSchedule'
        }),
        date: function() {
            return moment(new Date(this.selectedYear, this.selectedMonth, this.dayInMonthIndex), 'YYYY-MM-DD HH:mm:ss');
        },
        dateLabel: function() {
            return this.date.format('MM/DD');
        },
        disallowReservation: function() {
            let date = new Date(this.selectedYear, this.selectedMonth, this.dayInMonthIndex);
            let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            if (today >= date) {
                return true;
            } else {
                return false;
            }
        },
        scheduled: function() {
            let scheduled = false;
            let date = this.date;
            this.relevantSchedule.forEach(function(relevantShipment) {
                if ((relevantShipment.requestDate === date.format('YYYY-MM-DD')) && !relevantShipment.deprecated) {
                    scheduled = true;
                }
            });
            return scheduled;
        }
    },
    methods: {
        processScheduleRequest: function() {
            console.log('processing');
        }
    },
    template: `
        <button
            type="button" class="btn btn-xs"
            :disabled="disallowReservation"
            :class="{'btn-primary':scheduled,'btn-default':!scheduled}"
            @click="processScheduleRequest">
            {{dateLabel}}
        </button>`
};

export default {
    name: 'batchReservation',
    components: { 'reservation-button': reservationButton },
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            weekdayList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
        };
    },
    computed: {
        ...mapGetters({ relevantSchedule: 'getRelevantSchedule' }),
        daysInMonth: function() {
            return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        }
    },
    methods: {
        dateLabel: function(datePart) {
            let date = new Date(`${this.selectedYear.toString()}-${(this.selectedMonth + 1).toString()}-${datePart.toString()}`);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        dateMatching(weekIndex, weekdayIndex, dayInMonthIndex) {
            let weekdayIndexOfFirst = new Date(`${this.selectedYear.toString()}-${(this.selectedMonth + 1).toString()}-1`).getDay();
            let actualWeekdayIndex = new Date(`${this.selectedYear}-${this.selectedMonth + 1}-${dayInMonthIndex}`).getDay();
            let actualWeekIndex = Math.ceil((dayInMonthIndex + weekdayIndexOfFirst) / 7);
            if (((actualWeekIndex) === weekIndex) && (actualWeekdayIndex === (weekdayIndex - 1))) {
                return true;
            } else {
                return false;
            }
        }
    },
    template: `
        <div class="row">
            <div class="col-xs-offset-3 col-xs-6">
                <table class="table table-bordered table-hover table-condensed">
                    <caption class="text-center">
                        <h3>{{selectedYear}} 年 {{selectedMonth+1}} 月份批次預約</h3>
                    </caption>
                    <thead>
                        <tr>
                            <td v-for="weekdayIndex in 7" class="text-center">{{weekdayList[weekdayIndex-1]}}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="weekIndex in 5">
                            <td v-for="weekdayIndex in 7" class="text-center" style="border:1px sold black;">
                                <reservation-button
                                    v-for="dayInMonthIndex in daysInMonth"
                                    v-if="dateMatching(weekIndex,weekdayIndex,dayInMonthIndex)"
                                    :day-in-month-index="dayInMonthIndex">
                                </reservation-button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="row text-center" colspan="7">
                                <button type="button" class="btn btn-primary btn-md">預約</button>
                                <button type="button" class="btn btn-danger btn-md">取消</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <br><br><br>
            </div>
        </div>`
};
