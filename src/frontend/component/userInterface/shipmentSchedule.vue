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
                &nbsp;原料預約 / 進場狀況
            </h4>
        </div>
        <div class="panel-body">
            <raw-material-selector></raw-material-selector>
        </div>
        <div class="table-responsive" style="height:480px;overflow:auto;">
            <table class="table table-striped">
                <thead>
                    <tr class="info">
                        <th class="text-center">需求日期</th>
                        <th class="text-center">廠商</th>
                        <th class="text-center">原料項目</th>
                        <th class="text-left">原料規格</th>
                        <th class="text-center">預約車次</th>
                        <th class="text-center">預估重量</th>
                        <th class="text-left">備註</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="shipment in releventShipmentSchedule">
                        <td>{{shipment.requestDate}}</td>
                        <td>{{shipment.CUS_SNM}}</td>
                        <td>{{shipment.PRDT_SNM}}</td>
                        <td class="text-left">{{shipment.specification}}</td>
                        <td>{{shipment.quantity}}</td>
                        <td>{{shipment.estWeight|tonnage(shipment.quantity)}}</td>
                        <td class="text-left">{{shipment.note}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters, mapMutations } from 'vuex';
    import { serverUrl } from '../../clientConfig.js';
    import rawMaterialSelector from './rawMaterialSelector.vue';
    import { store } from '../../store/store.js';

    export default {
        name: 'scheduleTable',
        components: { rawMaterialSelector },
        store: store,
        computed: {
            ...mapGetters({
                releventShipmentSchedule: 'getReleventShipmentSchedule',
                shipmentSchedule: 'getShipmentSchedule',
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
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 1000)).format('0,0.0')} 噸`;
            }
        },
        methods: {
            ...mapMutations({
                nextWorkingMonth: 'nextWorkingMonth',
                prevWorkingMonth: 'prevWorkingMonth'
            })
        }
    };

</script>
