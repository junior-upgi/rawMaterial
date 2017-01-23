export default {
    name: 'batchReservation',
    props: ['selectedYear', 'selectedMonth'],
    data: function() {
        return {
            weekdayList: ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)']
        };
    },
    computed: {
        daysInMonth: function() {
            return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        }
    },
    methods: {
        dateLabel: function(datePart) {
            let date = new Date(`${this.selectedYear.toString()}-${(this.selectedMonth + 1).toString()}-${datePart.toString()}`);
            return `${date.getDate()} ${this.weekdayList[date.getDay()]}`;
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
                    <caption class="text-center"><h3>{{selectedYear}} 年 {{selectedMonth+1}} 月份批次預約</h3></caption>
                    <thead>
                        <tr>
                            <td v-for="weekdayIndex in 7" class="text-center">{{weekdayList[weekdayIndex-1]}}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="weekIndex in 5">
                            <td v-for="weekdayIndex in 7" class="text-center" style="border:1px sold black;">
                                <button v-for="dayInMonthIndex in daysInMonth" v-if="dateMatching(weekIndex,weekdayIndex,dayInMonthIndex)" type="button" class="btn btn-default btn-xs">{{dateLabel(dayInMonthIndex)}}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`
};
