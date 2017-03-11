<template>
    <div class="panel panel-success">
        <div class="panel-heading" role="tab" :id="'dailySummaryRecord' + workingDay">
            <h4 class="panel-title text-left"
                role="button"
                data-toggle="collapse"
                data-parent="#monthlySummary"
                :href="'#' + workingDay">
                {{workingDateString}} 原料進貨明細
            </h4>
        </div>
        <div :id="workingDay" class="panel-collapse collapse" role="tabpanel">
            <div class="panel-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>a</th>
                            <th>b</th>
                            <th>c</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>a</td>
                            <td>b</td>
                            <td>c</td>
                        </tr>
                    </tbody>
                </table>
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
    // import numeral from 'numeral';
    // import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'dailySummaryRecord',
        props: [
            'workingDateString',
            'workingDay'
            // 'dateInEditMode',
            // 'shipmentSummaryItem'
        ]
        /* ,
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 100) / 10).format('0,0.0')} 噸`;
            }
        },
        computed: {
            // ...mapGetters({ dateInEditMode: 'checkDateInEditMode' }),
            inEditMode: function() {
                return this.dateInEditMode === this.shipmentSummaryItem.workingDate ? true : false;
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
