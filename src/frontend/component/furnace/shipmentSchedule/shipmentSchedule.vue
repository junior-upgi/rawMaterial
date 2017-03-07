<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector
                    @workingTimeChange="dateInEditMode=null">
                </workingTimeSelector>
                &nbsp;原料進場狀況
            </h4>
        </div>
        <div class="panel-body">
            <workingMaterialSelector
                @workingMaterialChange="dateInEditMode=null">
            </workingMaterialSelector>
        </div>
        <div class="table-responsive" style="height:700px;overflow:auto;">
            <table
                class="table table-striped"
                :class="{'table-hover':dateInEditMode===null}">
                <thead>
                    <tr class="info">
                        <th
                            v-for="thItem in thList"
                            class="text-center"
                            style="padding-top:3px;padding-bottom:3px;margin-top:3px;margin-bottom:3px;">
                            {{thItem}}
                        </th>
                    </tr>
                </thead>
                <monthlySummary
                    :dateInEditMode="dateInEditMode"
                    @dailySummaryRecordSelected="editModeToggle($event)">
                </monthlySummary>
            </table>
        </div>
    </div>
</template>

<script>
    import workingTimeSelector from '../../common/workingTimeSelector.vue';
    import workingMaterialSelector from '../../common/workingMaterialSelector.vue';
    import monthlySummary from './monthlySummary.vue';
    // import { mapGetters, mapMutations } from 'vuex';
    // import { store } from '../../store/store.js';
    // import dailyShipmentRecord from './dailyShipmentRecord.vue';
    // import editPane from './editPane.vue';

    export default {
        name: 'scheduleTable',
        components: {
            workingTimeSelector,
            workingMaterialSelector,
            monthlySummary
            // dailyShipmentRecord,
            // editPane,
        },
        data: function() {
            return {
                dateInEditMode: null,
                thList: ['狀態', '日期', '廠商', '項目', '規格', '車次', '重量']
            };
        },
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
        /*
        // store: store,
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
