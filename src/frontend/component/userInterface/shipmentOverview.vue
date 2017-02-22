<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <working-time-selector></working-time-selector>
                &nbsp;原料進廠概況
            </h4>
        </div>
        <div class="table-responsive">
            <table
                class="table table-striped table-bordered table-condensed table-hover"
                :class="{'table-hover':dateInEditMode===null}">
                <thead>
                    <tr>
                        <th class="text-center">廠商</th>
                        <th class="text-center">項目</th>
                        <th class="text-center">日期</th>
                        <th class="text-center">重量</th>
                    </tr>
                </thead>
                <tbody>
                    <working-supplier-record
                        v-for="supplier in workingSupplier"
                        :supplier="supplier"
                        :dateList=filterShipmentOverviewData(supplier.CUS_NO,supplier.PRD_NO)>
                    </working-supplier-record>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import workingSupplierRecord from './workingSupplierRecord.vue';
    import workingTimeSelector from './workingTimeSelector.vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'shipmentOverview',
        components: {
            workingSupplierRecord,
            workingTimeSelector
        },
        computed: {
            ...mapGetters({
                shipmentOverview: 'getShipmentOverview',
                workingSupplier: 'getWorkingSupplier'
            })
        },
        methods: {
            filterShipmentOverviewData: function(CUS_NO, PRD_NO) {
                let dateList = [];
                this.shipmentOverview.forEach((shipment) => {
                    if ((shipment.CUS_NO === CUS_NO) && (shipment.PRD_NO = PRD_NO)) {
                        dateList.push(shipment.workingDay);
                    }
                });
                return dateList;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
