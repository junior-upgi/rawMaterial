<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;原料進廠概況&nbsp;&nbsp;&nbsp;
                <span style="border:1px solid white;" class="label label-primary">今日</span>
                <span style="border:1px solid white;" class="label label-danger">待進廠</span>
                <span style="border:1px solid white;" class="label label-success">已入廠</span>
            </h4>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-condensed table-hover">
                <thead>
                    <tr class="bg-warning">
                        <th class="text-center" style="white-space:nowrap;">廠商</th>
                        <th class="text-center" style="white-space:nowrap;">項目</th>
                        <th class="text-center">入廠日期</th>
                        <th class="text-center" style="white-space:nowrap;">車次</th>
                        <th class="text-center">重量</th>
                    </tr>
                </thead>
                <tbody>
                    <shipmentOverviewRecord
                        v-for="(monthlyShipmentOverview, index) in releventMonthlyShipmentOverview"
                        :monthlyShipmentOverview="monthlyShipmentOverview">
                    </shipmentOverviewRecord>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    // import workingMaterialRecord from './workingMaterialRecord.vue';
    import shipmentOverviewRecord from './shipmentOverviewRecord.vue';
    import workingTimeSelector from '../../common/workingTimeSelector.vue';

    export default {
        name: 'shipmentOverview',
        components: {
            // workingMaterialRecord,
            shipmentOverviewRecord,
            workingTimeSelector
        },
        computed: {
            ...mapGetters({
                monthlyShipmentOverview: 'monthlyShipmentOverview',
                workingMaterial: 'workingMaterial',
                workingYear: 'workingYear',
                workingMonth: 'workingMonth'
            }),
            releventMonthlyShipmentOverview: function() {
                return this.monthlyShipmentOverview.filter((monthlyShipmentOverviewItem) => {
                    return (
                        (monthlyShipmentOverviewItem.workingYear === this.workingYear) &&
                        (monthlyShipmentOverviewItem.workingMonth === this.workingMonth)
                    );
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
