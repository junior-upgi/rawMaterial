<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                    <workingTimeSelector
                        @workingTimeChange="dateInEditMode=null">
                    </workingTimeSelector>
                    &nbsp;原料批次進廠預約作業
                </h4>
        </div>
        <div class="panel-body">
            <workingMaterialSelector @workingMaterialChange="dateInEditMode=null">
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
                            <reservationCell v-if="checkVisibility(weekIndex,weekdayIndex)" :cellDateString="cellDate(weekIndex,weekdayIndex)" :shipmentSchedule="filterShipmentSchedule(cellDate(weekIndex,weekdayIndex))">
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
import { mapActions, mapGetters } from 'vuex';
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
            shipmentSchedule: 'shipmentSchedule',
            selectedRawMaterial: 'selectedRawMaterial',
            workingMonth: 'workingMonth',
            workingYear: 'workingYear'
        }),
        weekCount: function() {
            const firstOfMonth = new Date(this.workingYear, this.workingMonth - 1, 1);
            const lastOfMonth = new Date(this.workingYear, this.workingMonth, 0);
            return Math.ceil((firstOfMonth.getDay() + 1 + (lastOfMonth.getDate() - firstOfMonth.getDate())) / 7);
        },
        lastDayOfMonth: function() {
            return parseInt(
                moment(new Date(this.workingYear, this.workingMonth - 1, 1))
                    .add(1, 'month')
                    .subtract(1, 'day')
                    .format('D'));
        },
        weekdayOfFirstOfMonth: function() {
            return new Date(this.workingYear, this.workingMonth - 1, 1).getDay();
        }
    },
    methods: {
        ...mapActions({ componentErrorHandler: 'componentErrorHandler' }),
        cellIndex: function(weekIndex, weekdayIndex) {
            return (parseInt(weekIndex) - 1) * 7 + parseInt(weekdayIndex);
        },
        cellDate: function(weekIndex, weekdayIndex) {
            return moment(
                new Date(
                    this.workingYear,
                    this.workingMonth - 1,
                    this.cellIndex(weekIndex, weekdayIndex) - this.weekdayOfFirstOfMonth
                )
            ).format('YYYY-MM-DD');
        },
        checkVisibility: function(weekIndex, weekdayIndex) {
            const cellIndex = this.cellIndex(weekIndex, weekdayIndex);
            return (
                (cellIndex > this.weekdayOfFirstOfMonth) &&
                ((cellIndex - this.weekdayOfFirstOfMonth) <= this.lastDayOfMonth)
            );
        },
        filterShipmentSchedule: function(dateString) {
            return this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.workingDate === dateString) &&
                    (shipment.CUS_NO === this.selectedRawMaterial.CUS_NO) &&
                    (shipment.PRD_NO === this.selectedRawMaterial.PRD_NO) &&
                    (shipment.typeId === this.selectedRawMaterial.typeId)
                );
            });
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
