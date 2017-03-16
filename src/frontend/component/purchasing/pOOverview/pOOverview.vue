<template lang="html">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>原料採購訂單概況</h4>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered tabel-hover table-striped table-condensed">
                <thead>
                    <tr>
                        <th v-for="thItem in thList" class="text-center">
                            <strong>{{thItem}}</strong>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <pOOverviewRecord v-for="purchaseOrder in activePOList" :purchaseOrder="purchaseOrder" :pOContentSummary="filterPOContentSummary(purchaseOrder.id)" :revokedPendingShipmentSchedule="revokedPendingShipmentSchedule" :unattendedShipmentSchedule="unattendedShipmentSchedule">
                    </pOOverviewRecord>
                </tbody>
                <newRequestList></newRequestList>
            </table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import newRequestList from './newRequestList/newRequestList.vue';
import pOOverviewRecord from './pOOverviewRecord/pOOverviewRecord.vue';

export default {
    name: 'pOOverview',
    components: {
        newRequestList,
        pOOverviewRecord
    },
    computed: {
        ...mapGetters({
            activePOList: 'activePOList',
            shipmentSchedule: 'shipmentSchedule',
            pOContentSummary: 'pOContentSummary'
        }),
        revokedPendingShipmentSchedule: function() {
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
        filterPOContentSummary: function(pOId) {
            return this.pOContentSummary.filter((summaryItem) => {
                return summaryItem.pOId === pOId;
            });
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
