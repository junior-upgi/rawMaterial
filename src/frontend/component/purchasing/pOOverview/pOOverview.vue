<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <workingTimeSelector></workingTimeSelector>
                &nbsp;原料採購訂單概況
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
                    <pOOverviewRecord
                        v-for="purchaseOrder in activePOList"
                        :purchaseOrder="purchaseOrder"
                        :revokePendingShipmentSchedule="filterRevokePendingSchedule(purchaseOrder.CUS_NO)"
                        :unattendedShipmentSchedule="filterUnattendedSchedule(purchaseOrder.CUS_NO)">
                    </pOOverviewRecord>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import pOOverviewRecord from './pOOverviewRecord.vue';
    import workingTimeSelector from '../../common/workingTimeSelector.vue';

    export default {
        name: 'pOOverview',
        components: {
            pOOverviewRecord,
            workingTimeSelector
        },
        computed: {
            ...mapGetters({
                activePOList: 'activePOList',
                selectedRawMaterial: 'selectedRawMaterial',
                shipmentSchedule: 'shipmentSchedule'
            }),
            revokePendingShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return (
                        (shipment.deprecated !== null) &&
                        (shipment.pOId !== null) &&
                        (shipment.purchaseOrder.deprecated === null)
                    );
                });
            },
            unattendedShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return (
                        (shipment.deprecated === null) &&
                        (shipment.pOId === null)
                    );
                });
            }
        },
        data: function() {
            return {
                thList: ['編號', '年度', '月份', '廠商', '規格項目', '狀態']
            };
        },
        methods: {
            filterRevokePendingSchedule: function(CUS_NO) {
                return this.revokePendingShipmentSchedule.filter((shipment) => {
                    return shipment.CUS_NO === CUS_NO;
                });
            },
            filterUnattendedSchedule: function(CUS_NO) {
                return this.unattendedShipmentSchedule.filter((shipment) => {
                    return shipment.CUS_NO === CUS_NO;
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
