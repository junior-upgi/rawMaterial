<template lang="html">
    <div class="table-responsive">
        <table
            class="table table-bordered table-condensed table-hover"
            style="font-size:75%;margin:0px;">
            <thead>
                <tr class="info">
                    <th v-for="thItem in thList"
                        class="text-center"
                        style="padding:5px 10px 5px 10px;margin-top:3px;margin-bottom:3px;white-space:nowrap;">
                        {{thItem}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <shipmentRecord
                    v-for="(shipment, index) in shipmentSchedule"
                    :index="index + 1"
                    :shipment="shipment">
                </shipmentRecord>
            </tbody>
        </table>
    </div>
</template>

<script>
import shipmentRecord from './shipmentRecord/shipmentRecord.vue';
export default {
    name: 'dailyShipmentTable',
    components: { shipmentRecord },
    props: ['shipmentSchedule'],
    data: function () {
        return {
            thList: ['', '狀態', '項目', '日期', '重量', '宣稱重量', '磅單重量', '備註', '']
        };
    }
};
</script>

<style></style>
