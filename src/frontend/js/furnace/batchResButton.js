import moment from 'moment-timezone';

import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'batchResButton',
    props: ['weekIndex', 'weekdayIndex', 'dayInMonthIndex'],
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            relevantSchedule: 'getRelevantSchedule',
            CUS_NO: 'getSupplierErpId',
            PRD_NO: 'getRawMatErpId',
            typeId: 'getTypeId'
        }),
        date: function() {
            return moment(new Date(this.selectedYear, this.selectedMonth, this.dayInMonthIndex), 'YYYY-MM-DD HH:mm:ss');
        },
        dateLabel: function() { return this.date.format('MM/DD'); },
        disallowReservation: function() { // disable the template button based on date and whether it's already toggled or not
            let date = new Date(this.selectedYear, this.selectedMonth, this.dayInMonthIndex);
            let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            if ((today >= date) || (this.modified === true)) {
                return true;
            } else {
                return false;
            }
        },
        scheduled: function() { // return true or false by checking if the template button is associated with an existing schedule shipment
            let scheduled = false;
            let date = this.date;
            this.relevantSchedule.forEach(function(shipment) {
                if ((shipment.requestDate === date.format('YYYY-MM-DD')) && !shipment.deprecated) {
                    scheduled = true;
                }
            });
            return scheduled;
        }
    },
    data: function() { return { modified: false }; },
    updated: function() { this.modified = false; },
    methods: {
        ...mapMutations({ pushBatchReservation: 'pushBatchReservation' }),
        processScheduleRequest: function() {
            if (this.scheduled) { // if it's on the existing schedule, it's registered for cancellation(to deprecate)
                this.pushBatchReservation({
                    type: 'pushBatchReservation',
                    action: 'delete',
                    shipment: this.relevantShipment()
                });
            } else { // if it's not scheduled yet, push a new object on to the batchReservationQueue in the store
                this.pushBatchReservation({
                    type: 'pushBatchReservation',
                    action: 'post',
                    shipment: {
                        requestDate: this.date.format('YYYY-MM-DD'),
                        CUS_NO: this.CUS_NO,
                        PRD_NO: this.PRD_NO,
                        typeId: this.typeId,
                        quantity: 1
                    }
                });
            }
            this.modified = true;
        },
        relevantShipment: function() {
            return this.relevantSchedule.filter((shipment) => {
                return ((shipment.requestDate === this.date.format('YYYY-MM-DD')) && (!shipment.deprecated));
            })[0];
        }
    },
    template: `
        <button
            type="button" class="btn"
            :disabled="disallowReservation"
            :class="{'btn-primary':scheduled,'btn-default':!scheduled,'btn-xs':!modified,'btn-lg':modified}"
            @click="processScheduleRequest">
            {{dateLabel}}
        </button>`
};
