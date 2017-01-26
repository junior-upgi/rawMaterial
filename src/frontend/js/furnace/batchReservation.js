import { mapGetters, mapMutations, mapActions } from 'vuex';

import reservationButton from './batchResButton.js';

export default {
    name: 'batchReservation',
    components: { 'batch-res-button': reservationButton },
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            weekdayList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
        };
    },
    computed: {
        ...mapGetters({
            relevantSchedule: 'getRelevantSchedule',
            batchReservationQueue: 'getBatchReservationQueue'
        }),
        daysInMonth: function() {
            return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        },
        disallowBatchReservationCommit: function() {
            return this.batchReservationQueue.length === 0 ? true : false;
        }
    },
    methods: {
        ...mapMutations({ resetBatchReservationQueue: 'resetBatchReservationQueue' }),
        ...mapActions({ commitBatchReservation: 'commitBatchReservation' }),
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
        },
        triggerBatchReservation: function() {
            if (confirm(`請確認進行 ${this.selectedYear} 年 ${this.selectedMonth + 1} 月份批次預約`)) {
                this.commitBatchReservation({
                    type: 'commitBatchReservation',
                    batchReservationQueue: this.batchReservationQueue,
                    selectedYear: this.selectedYear,
                    selectedMonth: this.selectedMonth
                });
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
                            <td v-for="weekdayIndex in 7" class="text-center">
                                <batch-res-button
                                    v-for="dayInMonthIndex in daysInMonth"
                                    v-if="dateMatching(weekIndex,weekdayIndex,dayInMonthIndex)"
                                    :day-in-month-index="dayInMonthIndex">
                                </batch-res-button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="row text-center" colspan="7">
                                <button
                                    type="button" class="btn btn-primary btn-md"
                                    :disabled="disallowBatchReservationCommit"
                                    @click="triggerBatchReservation">
                                    預約
                                </button>
                                <button type="button" class="btn btn-danger btn-md" @click="resetBatchReservationQueue">取消</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <br><br><br>
            </div>
        </div>`
};
