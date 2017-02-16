<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <button class="btn btn-primary" style="border:0px;" @click="prevWorkingMonth">
                    <span class="glyphicon glyphicon-triangle-left"></span>
                </button>
                &nbsp;{{workingYear}} 年 {{workingMonth}} 月份&nbsp;
                <button class="btn btn-primary" style="border:0px;" @click="nextWorkingMonth">
                    <span class="glyphicon glyphicon-triangle-right"></span>
                </button>
                &nbsp;原料進場狀況
            </h4>
        </div>
        <div class="panel-body">
            <raw-material-selector></raw-material-selector>
        </div>
        <div class="table-responsive" style="height:480px;overflow:auto;">
            <table class="table table-striped table-hover">
                <thead>
                    <tr class="info">
                        <th class="text-center">日期</th>
                        <th class="text-center">廠商</th>
                        <th class="text-center">項目</th>
                        <th class="text-left">規格</th>
                        <th class="text-center">車次</th>
                        <th class="text-center">重量</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="dailyShipmentSummary in monthlyScheduleSummary">
                        <daily-shipment-record
                            :dailyShipmentSummary="dailyShipmentSummary">
                        </daily-shipment-record>
                        <edit-pane
                             v-if="inEditMode(dailyShipmentSummary.requestDate)"
                            :paneDateString="dailyShipmentSummary.requestDate">
                        </edit-pane>
                    </template>
</tbody>
</table>
</div>
</div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import dailyShipmentRecord from './dailyShipmentRecord.vue';
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import editPane from './editPane.vue';
    import { store } from '../../store/store.js';

    export default {
        name: 'scheduleTable',
        components: {
            dailyShipmentRecord,
            editPane,
            rawMaterialSelector
        },
        store: store,
        computed: {
            ...mapGetters({
                dateInEditMode: 'checkDateInEditMode',
                monthlyScheduleSummary: 'getMonthlyScheduleSummary',
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            })
        },
        methods: {
            ...mapMutations({
                nextWorkingMonth: 'nextWorkingMonth',
                prevWorkingMonth: 'prevWorkingMonth',
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
