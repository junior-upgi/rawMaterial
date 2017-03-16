<template>
    <div v-if="releventShipmentSchedule.length > 0" class="panel" :class="{'panel-success':!isWeekend, 'panel-danger':isWeekend}">
        <div class="panel-heading" role="tab" :id="'dailySummaryRecord' + workingDay">
            <h4 class="panel-title text-left" role="button" data-toggle="collapse" data-parent="#monthlySummary" :href="'#' + workingDay" @click="changeActiveShipmentEditorDate(workingDateString)">
                    {{workingDateString}} ({{weekdayReferenceList[weekday]}}) 【{{selectedRawMaterial.PRDT_SNM}}】 進貨明細
                </h4>
        </div>
        <div :id="workingDay" class="panel-collapse collapse" role="tabpanel">
            <div class="panel-body" style="font-size:75%;padding:0px;">
                <dailyShipmentTable :shipmentSchedule="releventShipmentSchedule">
                </dailyShipmentTable>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import dailyShipmentTable from './dailyShipmentTable/dailyShipmentTable.vue';

export default {
    name: 'dailySummaryItem',
    components: { dailyShipmentTable },
    props: [
        'shipmentSchedule',
        'workingDateString',
        'workingDay'
    ],
    computed: {
        ...mapGetters({ selectedRawMaterial: 'selectedRawMaterial' }),
        releventShipmentSchedule: function() {
            return this.shipmentSchedule.filter((shipment) => {
                return shipment.workingDate === this.workingDateString;
            });
        },
        weekday: function() {
            return new Date(this.workingDateString).getDay();
        },
        isWeekend: function() {
            return ((this.weekday === 0) || (this.weekday === 6)) ? true : false;
        }
    },
    data: function() {
        return {
            weekdayReferenceList: ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
        };
    },
    methods: {
        ...mapMutations({ changeActiveShipmentEditorDate: 'changeActiveShipmentEditorDate' })
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
