<template>
    <tr style="font-size:75%;">
        <pOVersion :pONumber="purchaseOrder.pONumber" :revisionNumber="purchaseOrder.revisionNumber" :revokedPendingShipmentSchedule="releventRevokedPendingShipmentSchedule" :unattendedShipmentSchedule="releventUnattenedShipmentSchedule" @updatePOEvent="updatePO()">
        </pOVersion>
        <td>{{purchaseOrder.workingYear}}</td>
        <td>{{purchaseOrder.workingMonth}}</td>
        <td>{{purchaseOrder.supplier.SNM}}</td>
        <contentSummary :pOContentSummary="pOContentSummary">
        </contentSummary>
        <orderStatus :revokedPendingShipmentSchedule="releventRevokedPendingShipmentSchedule" :unattendedShipmentSchedule="releventUnattenedShipmentSchedule">
        </orderStatus>
    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import pOVersion from './pOVersion.vue';
import contentSummary from './contentSummary.vue';
import orderStatus from './orderStatus.vue';

export default {
    name: 'pOOverviewRecord',
    components: {
        pOVersion,
        contentSummary,
        orderStatus
    },
    props: [
        'pOContentSummary',
        'revokedPendingShipmentSchedule',
        'unattendedShipmentSchedule',
        'purchaseOrder'
    ],
    computed: {
        ...mapGetters({
            dataProcessingState: 'checkDataProcessingState',
            shipmentSchedule: 'shipmentSchedule'
        }),
        releventRevokedPendingShipmentSchedule: function() {
            switch (this.purchaseOrder.contractType) {
                case 'annual':
                    return this.revokedPendingShipmentSchedule.filter((shipment) => {
                        return (
                            (shipment.CUS_NO === this.purchaseOrder.CUS_NO) &&
                            (new Date(shipment.workingDate).getFullYear() === this.purchaseOrder.workingYear)
                        );
                    });
                case 'monthly':
                    return this.revokedPendingShipmentSchedule.filter((shipment) => {
                        return (
                            (shipment.CUS_NO === this.purchaseOrder.CUS_NO) &&
                            (new Date(shipment.workingDate).getFullYear() === this.purchaseOrder.workingYear) &&
                            ((new Date(shipment.workingDate).getMonth() + 1) === this.purchaseOrder.workingMonth)
                        );
                    });
                default:
                    return this.revokedPendingShipmentSchedule.filter((shipment) => {
                        return shipment.CUS_NO === this.purchaseOrder.CUS_NO;
                    });
            }
        },
        releventUnattenedShipmentSchedule: function() {
            switch (this.purchaseOrder.contractType) {
                case 'annual':
                    return this.unattendedShipmentSchedule.filter((shipment) => {
                        return (
                            (shipment.CUS_NO === this.purchaseOrder.CUS_NO) &&
                            (new Date(shipment.workingDate).getFullYear() === this.purchaseOrder.workingYear)
                        );
                    });
                case 'monthly':
                    return this.unattendedShipmentSchedule.filter((shipment) => {
                        return (
                            (shipment.CUS_NO === this.purchaseOrder.CUS_NO) &&
                            (new Date(shipment.workingDate).getFullYear() === this.purchaseOrder.workingYear) &&
                            ((new Date(shipment.workingDate).getMonth() + 1) === this.purchaseOrder.workingMonth)
                        );
                    });
                default:
                    return this.unattendedShipmentSchedule.filter((shipment) => {
                        return shipment.CUS_NO === this.purchaseOrder.CUS_NO;
                    });
            }
        }
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            updatePurchaseOrder: 'updatePurchaseOrder'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        updatePO: function() {
            this.processingDataSwitch(true);
            this.updatePurchaseOrder({
                targetPO: this.purchaseOrder,
                pendingOrderList: this.releventUnattenedShipmentSchedule
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'pOOverviewRecord',
                    method: 'updatePO',
                    situation: '訂單更新作業發生錯誤',
                    systemErrorMessage: error
                });
            });
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
