<template>
    <div class="table-responsive">
        <table
            class="table table-bordered table-condensed table-hover"
            style="font-size:75%;margin:0px;">
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
        data: function() {
            return {
                // dateInEditMode: null,
                thList: ['', '狀態', '項目', '日期', '重量', '廠商宣稱重量', '實際磅單重量', '備註', '']
            };
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
