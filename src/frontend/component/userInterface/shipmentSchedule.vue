<template>
    <div class="table-responsive" style="height:300px;overflow:auto;">
        <table class="table">
            <thead>
                <tr class="success">
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
                <tr v-for="shipment in shipmentSchedule">
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
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters } from 'vuex';
    import { serverUrl } from '../../clientConfig.js';
    import { store } from '../../store/store.js';

    export default {
        name: 'scheduleTable',
        store: store,
        computed: {
            ...mapGetters({ shipmentSchedule: 'getShipmentSchedule' })
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
        }
    };

</script>
