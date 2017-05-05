<template lang="html">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>原料採購訂單概況</h4>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered tabel-hover table-striped table-condensed">
                <thead>
                </thead>
                <newRequestList></newRequestList>
                <tbody>
                    <tr>
                        <td colspan="6" class="bg-primary">
                            <h4 style="margin:10px;padding:0px;">確認訂單項目</h4>
                        </td>
                    </tr>
                    <tr>
                        <th v-for="thItem in thList" class="text-center">
                            <strong>{{thItem}}</strong>
                        </th>
                    </tr>
                    <pOOverviewRecord
                        v-for="purchaseOrder in activePOList"
                        :purchaseOrder="purchaseOrder"
                        :pOContentSummary="filterPOContentSummary(purchaseOrder.id)"
                        :revokedPendingShipmentSchedule="revokedPendingShipmentSchedule"
                        :unattendedShipmentSchedule="unattendedShipmentSchedule">
                    </pOOverviewRecord>
                </tbody>
                <revokedRequestList
                    :revokedPendingShipmentSchedule="revokedPendingShipmentSchedule">
                </revokedRequestList>
            </table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import pOOverviewRecord from './pOOverviewRecord/pOOverviewRecord.vue';
import newRequestList from './newRequestList/newRequestList.vue';
import revokedRequestList from './revokedRequestList/revokedRequestList.vue';

export default {
    name: 'pOOverview',
    components: {
        newRequestList,
        revokedRequestList,
        pOOverviewRecord
    },
    computed: {
        ...mapGetters({
            activePOList: 'activePOList',
            shipmentSchedule: 'shipmentSchedule',
            pOContentSummary: 'pOContentSummary'
        }),
        revokedPendingShipmentSchedule: function ) {
            return this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.deprecated !== null) &&
                    (shipment.pOId !== null) &&
                    (shipment.purchaseOrder.deprecated === null)
                );
            });
        },
        unattendedShipmentSchedule: function ) {
            return this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.deprecated === null) &&
                    (shipment.pOId === null)
                );
            });
        }
    },
    data: function ) {
        return {
            thList: ['編號', '年度', '月份', '廠商', '規格項目', '狀態']
        };
    },
    methods: {
        filterPOContentSummary: function pOId) {
            return this.pOContentSummary.filter((summaryItem) => {
                return summaryItem.pOId === pOId;
            });
        }
    }
};

</script>

<style></style>
