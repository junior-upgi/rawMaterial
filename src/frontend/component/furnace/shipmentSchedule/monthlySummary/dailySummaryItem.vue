<template>
    <div
        v-if="releventShipmentSchedule.length > 0"
        class="panel panel-success">
        <div class="panel-heading" role="tab" :id="'dailySummaryRecord' + workingDay">
            <h4 class="panel-title text-left"
                role="button"
                data-toggle="collapse"
                data-parent="#monthlySummary"
                :href="'#' + workingDay"
                @click="changeActiveShipmentEditorDate(workingDateString)">
                {{workingDateString}} 【{{selectedRawMaterial.PRDT_SNM}}】 進貨明細
            </h4>
        </div>
        <div :id="workingDay" class="panel-collapse collapse" role="tabpanel">
            <div class="panel-body" style="font-size:75%;padding:0px;">
                <dailyShipmentTable
                    :shipmentSchedule="releventShipmentSchedule">
                </dailyShipmentTable>
            </div>
        </div>
    </div>
    <!--
    <tr @click="dailySummaryRecordToggled">
        <td></td>
        <td>{{shipmentSummaryItem.workingDate}}</td>
        <td>{{shipmentSummaryItem.CUST_SNM}}</td>
        <td>{{shipmentSummaryItem.PRDT_SNM}}</td>
        <td>{{shipmentSummaryItem.specification}}</td>
        <td>{{shipmentSummaryItem.totalShipmentCount}}</td>
        <td>{{shipmentSummaryItem.totalWeight|tonnage}}</td>
    </tr>
    -->
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import dailyShipmentTable from './dailyShipmentTable/dailyShipmentTable.vue';
    // import numeral from 'numeral';

    export default {
        name: 'dailySummaryItem',
        components: { dailyShipmentTable },
        props: [
            'shipmentSchedule',
            'workingDateString',
            'workingDay'
            // 'dateInEditMode',
            // 'shipmentSummaryItem'
        ],
        computed: {
            ...mapGetters({ selectedRawMaterial: 'selectedRawMaterial' }),
            releventShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return shipment.workingDate === this.workingDateString;
                });
            }
            // ...mapGetters({ dateInEditMode: 'checkDateInEditMode' }),
            /*
            inEditMode: function() {
                return this.dateInEditMode === this.shipmentSummaryItem.workingDate ? true : false;
            }
            */
        },
        methods: {
            ...mapMutations({ changeActiveShipmentEditorDate: 'changeActiveShipmentEditorDate' })
        }
        /* ,
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 100) / 10).format('0,0.0')} 噸`;
            }
        },
        methods: {
            dailySummaryRecordToggled: function() {
                this.$emit('dailySummaryRecordSelected', this.shipmentSummaryItem.workingDate);
            }
        },
        methods: {
            ...mapMutations({
                switchDateInEditMode: 'switchDateInEditMode',
                turnOffEditMode: 'turnOffEditMode'
            }),
            checkInEditMode: function() {
                if ((this.dateInEditMode === null) || (this.dateInEditMode !== this.dailyShipmentSummary.workingDate)) {
                    return false;
                } else {
                    return true;
                }
            },
            switchEditModeDate: function() {
                if (this.checkInEditMode()) {
                    this.turnOffEditMode();
                } else {
                    this.switchDateInEditMode(this.dailyShipmentSummary.workingDate);
                }
            }
        }
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
