<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;原料採購訂單狀況
            </h4>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered tabel-hover table-striped table-condensed">
                <thead>
                    <tr>
                        <th
                            v-for="thItem in thList"
                            class="text-center">
                            {{thItem}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!--
                    <pOOverviewRecord
                        v-for="material in workingMaterial"
                        :material="material"
                        :pOList="filterPOList(material.CUS_NO)">
                    </pOOverviewRecord>
                    -->
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import workingTimeSelector from '../../common/workingTimeSelector.vue';
    import pOOverviewRecord from './pOOverviewRecord.vue';

    export default {
        name: 'pOOverview',
        computed: {
            ...mapGetters({ selectedRawMaterial: 'selectedRawMaterial' })
        },
        components: {
            workingTimeSelector,
            pOOverviewRecord
        },
        data: function() {
            return {
                thList: ['編號', '年度', '日期', '廠商', '項目', '規格', '車次', '狀態']
            };
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
