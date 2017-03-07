<template>
    <button
        class="text-left btn btn-sm btn-danger btn-block"
        :disabled="processingData?true:false"
        @click="cancelReservation">
        <strong>
            未下訂車次: {{pendingPurchaseCount}}
        </strong>
    </button>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'cancelReservation',
        props: ['shipment'],
        computed: {
            ...mapGetters({
                processingData: 'checkDataProcessingState',
                selectedRawMaterial: 'selectedRawMaterial',
                workingSupplierDetail: 'workingSupplierDetail'
            }),
            pendingPurchaseCount: function() {
                return this.shipment.OS_NO === null ? this.shipment.shipmentCount - this.shipment.receivedCount : 0;
            }
        },
        methods: {
            ...mapActions({
                cancelShipment: 'cancelShipment',
                componentErrorHandler: 'componentErrorHandler'
            }),
            ...mapMutations({
                processingDataSwitch: 'processingDataSwitch',
                rebuildData: 'rebuildData'
            }),
            cancelReservation: function() {
                this.processingDataSwitch(true);
                this.cancelShipment({
                    id: this.shipment.id,
                    SQ_NO: this.shipment.SQ_NO,
                    SQ_ITM: this.shipment.SQ_ITM
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    this.componentErrorHandler({
                        component: 'cancelReservation',
                        method: 'cancelReservation',
                        situation: '預約刪除作業發生錯誤',
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
