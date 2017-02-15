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
                    <daily-shipment-record
                        v-for="dailyShipmentSummary in releventDailyShipmentScheduleSummary"
                        :dailyShipmentSummary="dailyShipmentSummary">
                    </daily-shipment-record>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { serverUrl } from '../../clientConfig.js';
    import dailyShipmentRecord from './dailyShipmentRecord.vue';
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import { store } from '../../store/store.js';

    export default {
        name: 'scheduleTable',
        components: {
            dailyShipmentRecord,
            rawMaterialSelector
        },
        store: store,
        computed: {
            ...mapGetters({
                releventDailyShipmentScheduleSummary: 'getReleventDailyShipmentScheduleSummary',
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            })
        },
        data: function() {
            return {
                apiUrl: `${serverUrl}/data/shipment`,
                fieldList: [
                    'requestData',
                    'CUS_SNM',
                    'PRDT_SNM',
                    'specification',
                    'quantity',
                    'note'
                ]
            };
        },
        methods: {
            ...mapMutations({
                nextWorkingMonth: 'nextWorkingMonth',
                prevWorkingMonth: 'prevWorkingMonth'
            })
        }
    };

</script>
