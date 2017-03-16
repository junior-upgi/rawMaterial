<template lang="html">
    <button class="text-left btn btn-sm btn-danger btn-block" style="padding:1px 0px 1px 0px;margin-bottom:5px;" :disabled="processingData?true:false" @click="cancelReservation">
        <strong>
                未下訂車次: {{shipmentSchedule.length}}
            </strong>
    </button>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'pOPendingShipment',
    props: ['shipmentSchedule'],
    computed: {
        ...mapGetters({
            processingData: 'checkDataProcessingState'
        })
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            cancelShipment: 'cancelShipment'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        cancelReservation: function() {
            this.processingDataSwitch(true);
            let targetList = [];
            this.shipmentSchedule.forEach((shipment) => {
                targetList.push(shipment.id);
            });
            this.cancelShipment({
                targetList: targetList
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'pOPendingShipment',
                    method: 'cancelReservation',
                    situation: '未下訂預約刪除作業發生錯誤',
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
