<template>
    <div class="panel-group" id="shipmentSchedule" role="tablist">
        <div class="panel panel-primary">
            <div class="panel-heading" role="tab" id="heading">
                <h4 class="panel-title" role="button" data-toggle="collapse" data-parent="#shipmentSchedule" href="#shipmentList">
                    <workingTimeSelector
                        @workingTimeChange="dateInEditMode=null">
                    </workingTimeSelector>
                    &nbsp;原料進廠明細表
                </h4>
            </div>
            <div class="panel-body">
                <workingMaterialSelector
                    @workingMaterialChange="dateInEditMode=null">
                </workingMaterialSelector>
            </div>
            <div id="shipmentList" class="panel-collapse collapse" role="tabpanel">
                <div class="panel-footer">
                    <monthlySummary></monthlySummary>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import workingTimeSelector from '../../common/workingTimeSelector.vue';
    import workingMaterialSelector from '../../common/workingMaterialSelector.vue';
    import monthlySummary from './monthlySummary/monthlySummary.vue';
    // import { mapGetters, mapMutations } from 'vuex';
    // import dailyShipmentRecord from './dailyShipmentRecord.vue';
    // import editPane from './editPane.vue';

    export default {
        name: 'scheduleTable',
        components: {
            workingTimeSelector,
            workingMaterialSelector,
            monthlySummary
            // dailyShipmentRecord,
            // editPane
        }
        /* ,
        methods: {
            editModeToggle: function(dateSelected) {
                if (dateSelected !== this.dateInEditMode) {
                    this.dateInEditMode = dateSelected;
                } else {
                    this.dateInEditMode = null;
                }
            }
        },
        created: function() { this.dateInEditMode = null; }
        computed: {
            ...mapGetters({
                // dateInEditMode: 'checkDateInEditMode',
                // monthlyScheduleSummary: 'getMonthlyScheduleSummary'
            })
        },
        methods: {
            ...mapMutations({
                switchDateInEditMode: 'switchDateInEditMode',
                turnOffEditMode: 'turnOffEditMode'

            }),
            captureEditEvent: function(date, switchState) {
                if (switchState === true) {
                    this.switchDateInEditMode(date);
                } else {
                    this.turnOffEditMode();
                }
            },
            inEditMode: function(date) {
                return date === this.dateInEditMode ? true : false;
            }
        }
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
