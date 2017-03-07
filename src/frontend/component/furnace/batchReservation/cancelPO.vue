<template>
    <button
        class="text-left btn btn-sm btn-info btn-block"
        :disabled="processingData?true:false">
        <strong>
            待進廠車次: {{pendingShipmentCount}}
        </strong>
    </button>
</template>

<script>
    export default {
        name: 'cancelPO',
        props: ['shipment'],
        computed: {
            pendingShipmentCount: function() {
                return this.shipment.OS_NO === null ? 0 : this.shipment.shipmentCount - this.shipment.receivedCount;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
