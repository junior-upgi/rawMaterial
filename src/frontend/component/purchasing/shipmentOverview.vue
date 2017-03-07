<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
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
                    <workingMaterialRecord
                        v-for="material in workingMaterial"
                        :material="material"
                        :dateList="filterShipmentOverviewData(material.CUS_NO,material.PRD_NO)">
                    </workingMaterialRecord>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import workingMaterialRecord from './workingMaterialRecord.vue';
    import workingTimeSelector from '../common/workingTimeSelector.vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'shipmentOverview',
        components: {
            workingMaterialRecord,
            workingTimeSelector
        },
        props: ['workingMaterial'],
        computed: {
            ...mapGetters({ shipmentOverview: 'getShipmentOverview' })
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
