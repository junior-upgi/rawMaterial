<template>
    <button
        class="text-left btn btn-sm btn-danger btn-block"
        :disabled="processingData?true:false"
        @click="cancelReservation">
        <strong>
            待進廠車次: {{pendingShipmentCount}}
        </strong>
    </button>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'cancelReservation',
        props: ['shipmentSchedule'],
        computed: {
            ...mapGetters({ processingData: 'checkDataProcessingState' }),
            pendingShipmentCount: function() {
                let pendingShipmentCount = 0;
                this.shipmentSchedule.forEach((shipment) => {
                    if (shipment.PS_DD === null) {
                        pendingShipmentCount += 1;
                    }
                });
                return pendingShipmentCount;
            }
        },
        methods: {
            ...mapActions({
                // cancelShipment: 'cancelShipment'
            }),
            ...mapMutations({
                // rebuildData: 'rebuildData',
                // processingDataSwitch: 'processingDataSwitch',
                // resetStore: 'resetStore'
            }),
            cancelReservation: function() {
                /*
                this.processingDataSwitch(true);
                this.cancelShipment({
                    id: null,
                    requestDate: this.cellDate,
                    CUS_NO: this.selectedRawMat.CUS_NO,
                    PRD_NO: this.selectedRawMat.PRD_NO,
                    typeId: this.selectedRawMat.typeId
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`預約刪除作業發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
                */
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
