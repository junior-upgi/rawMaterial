<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;原料進場狀況
            </h4>
        </div>
        <div class="panel-body">
            <raw-material-selector></raw-material-selector>
        </div>
        <div class="table-responsive" style="height:700px;overflow:auto;">
            <table
                class="table table-striped"
                :class="{'table-hover':dateInEditMode===null}">
                <thead>
                    <tr class="info">
                        <th class="text-center">狀態</th>
                        <th class="text-center">預約日期</th>
                        <th class="text-center">廠商</th>
                        <th class="text-center">原料項目</th>
                        <th class="text-center">規格</th>
                        <th class="text-center">預約車次</th>
                        <th class="text-center">預估重量</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="dailyShipmentSummary in monthlyScheduleSummary">
                        <daily-shipment-record
                            :dailyShipmentSummary="dailyShipmentSummary">
                        </daily-shipment-record>
                        <edit-pane
                            v-if="inEditMode(dailyShipmentSummary.workingDate)"
                            :paneDateString="dailyShipmentSummary.workingDate"
                            :received="dailyShipmentSummary.received">
                        </edit-pane>
                    </template>
</tbody>
</table>
</div>
</div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { store } from '../../store/store.js';
    import dailyShipmentRecord from './dailyShipmentRecord.vue';
    import editPane from './editPane.vue';
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import workingTimeSelector from './workingTimeSelector.vue';

    export default {
        name: 'scheduleTable',
        components: {
            dailyShipmentRecord,
            editPane,
            rawMaterialSelector,
            workingTimeSelector
        },
        store: store,
        computed: {
            ...mapGetters({
                dateInEditMode: 'checkDateInEditMode',
                monthlyScheduleSummary: 'getMonthlyScheduleSummary'
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
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
