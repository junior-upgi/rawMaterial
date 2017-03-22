<template lang="html">
    <td>
        <span v-if="pOClosed" class="label label-default">結案</span>
        <span v-else-if="fulfilled" class="label label-default">已入廠</span>
        <span v-else-if="shipmentPending" class="label label-info">待入廠</span>
        <span v-else-if="revocationPending" class="label label-default">待取消</span>
        <span v-else-if="pOPending" class="label label-danger">待下單</span>
        <span v-else class="label label-danger">異常</span>
    </td>
</template>

<script>
export default {
    name: 'statusCell',
    props: ['shipment'],
    computed: {
        validShipment: function() { return (this.shipment.deprecated === null) ? true : false; },
        onPO: function() {
            if (
                (this.shipment.pOId !== null) &&
                (this.shipment.purchaseOrder.deprecated === null)
            ) { return true; } else { return false; }
        },
        pOPending: function() { if (this.validShipment && !this.onPO) { return true; } else { return false; } },
        revocationPending: function() { if (!this.validShipment && this.onPO) { return true; } else { return false; } },
        shipmentPending: function() {
            if (
                (this.shipment.deprecated === null) &&
                (this.shipment.receivedDate === null) &&
                (this.shipment.pOId !== null) &&
                (this.shipment.purchaseOrder.deprecated === null)
            ) { return true; } else { return false; }
        },
        fulfilled: function() {
            if (
                (this.shipment.deprecated === null) &&
                (this.shipment.receivedDate !== null) &&
                (this.shipment.pOId !== null) &&
                (this.shipment.purchaseOrder.deprecated === null)
            ) { return true; } else { return false; }
        },
        pOClosed: function() {
            if (
                (this.fulfilled) &&
                (this.shipment.purchaseOrder.finalizedDate === null)
            ) { return true; } else { return false; }
        },
        shipmentState: function() {
            if (this.pOClosed) {
                return { stateCode: 'pOClosed', stateMessage: '結案' };
            } else if (this.fulfilled) {
                return { stateCode: 'fulfilled', stateMessage: '已入廠' };
            } else if (this.shipmentPending) {
                return { stateCode: 'shipmentPending', stateMessage: '待入廠' };
            } else if (this.revocationPending) {
                return { stateCode: 'revocationPending', stateMessage: '待取消' };
            } else if (this.pOPending) {
                return { stateCode: 'pOPending', stateMessage: '待下單' };
            } else {
                return { stateCode: 'error', stateMessage: '狀態異常' };
            }
        }
    },
    mounted: function() {
        this.$emit('recordStateDetermined', this.shipmentState);
    },
    updated: function() {
        this.$emit('recordStateDetermined', this.shipmentState);
    }
};
</script>

<style></style>

