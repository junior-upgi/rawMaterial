<template lang="html">
    <button
        class="text-left btn btn-sm btn-danger btn-block"
        style="padding:1px 0px 1px 0px;margin-bottom:5px;"
        :disabled="processingData ? true : false"
        @click="cancelReservation">
        <strong>
            未下訂車次: {{shipmentSchedule.length}}
        </strong>
    </button>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'pOPendingShipment',
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
        cancelReservation: function ) {
            this.processingDataSwitch(true);
            let targetList = [];
            this.shipmentSchedule.forEach((shipment) => {
                targetList.push(shipment.id);
            });
            this.cancelShipment({
                targetList: targetList
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                let actionDescription = `向【${this.selectedRawMaterial.CUST_SNM}】取消【${this.cellDateString}】【${this.shipmentSchedule.length}】車【${this.selectedRawMaterial.PRDT_SNM} - ${this.selectedRawMaterial.specification}】尚未下訂預約。`;
                return this.employeeChatBroadcast({ groupMessage: actionDescription });
            }).then((result) => {
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

<style></style>
