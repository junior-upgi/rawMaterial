<template lang="html">
    <button
        class="text-left btn btn-sm btn-info btn-block"
        style="padding:1px 0px 1px 0px;"
        :disabled="processingData ? true : false"
        @click="revokeReservation">
        <strong>
            待進廠車次: {{shipmentSchedule.length}}
        </strong>
    </button>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'pendingShipment',
    props: [
        'cellDateString',
        'shipmentSchedule'
    ],
    computed: {
        ...mapGetters({
            processingData: 'checkDataProcessingState',
            selectedRawMaterial: 'selectedRawMaterial'
        })
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            cancelShipment: 'cancelShipment',
            employeeChatBroadcast: 'employeeChatBroadcast'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        revokeReservation: function() {
            this.processingDataSwitch(true);
            if (confirm('採購已經先行完成下單作業，請確認是否取消！')) {
                let targetList = [];
                this.shipmentSchedule.forEach((shipment) => {
                    targetList.push(shipment.id);
                });
                this.cancelShipment({
                    targetList: targetList
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    let actionDescription = `向【${this.selectedRawMaterial.CUST_SNM}】取消【${this.cellDateString}】【${this.shipmentSchedule.length}】車【${this.selectedRawMaterial.PRDT_SNM} - ${this.selectedRawMaterial.specification}】預約，請採購人員注意訂單修訂時效`;
                    return this.employeeChatBroadcast({ groupMessage: actionDescription });
                }).then((result) => {
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    this.componentErrorHandler({
                        component: 'pendingShipment',
                        method: 'revokeReservation',
                        situation: '待進貨預約取消作業發生錯誤',
                        systemErrorMessage: error
                    });
                });
            } else {
                this.processingDataSwitch(false);
            }
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
