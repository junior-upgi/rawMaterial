<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;採購訂單狀況
            </h4>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered tabel-hover table-striped table-condensed">
                <thead>
                    <tr>
                        <th class="text-center" style="white-space:nowrap;">訂單編號</th>
                        <th class="text-center">廠商</th>
                        <th class="text-center">項目</th>
                        <th class="text-center">規格</th>
                        <th class="text-center">最新訂單時間點</th>
                        <th class="text-center">新變更時間點</th>
                    </tr>
                </thead>
                <tbody>
                    <pOOverviewRecord
                        v-for="material in workingMaterial"
                        :material="material"
                        :pOList="filterPOList(material.CUS_NO)">
                    </pOOverviewRecord>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import workingTimeSelector from '../workingTimeSelector.vue';
    import pOOverviewRecord from './pOOverviewRecord.vue';

    export default {
        name: 'purchaseOrderOverview',
        props: ['workingMaterial'],
        computed: {
            ...mapGetters({ pOList: 'pOList' })
        },
        components: {
            workingTimeSelector,
            pOOverviewRecord
        },
        methods: {
            ...mapActions({ refreshPOShipmentListing: 'refreshPOShipmentListing' }),
            ...mapMutations({
                forceViewChange: 'forceViewChange',
                switchPOWorkingSupplier: 'switchPOWorkingSupplier'
            }),
            filterPOList: function(CUS_NO) {
                return this.pOList.filter((pOItem) => {
                    return pOItem.CUS_NO === CUS_NO;
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
