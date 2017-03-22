<template lang="html">
    <div class="row" style="margin-bottom:6px;">
        <input
            reservationType="number"
            min="1" step="1"
            :max="maxUserInputValueAllowed"
            placeholder="預約車趟"
            class="form-control text-center input-sm reservationInput"
            v-model.lazy.number="userInputValue"
            :disabled="processingData ? true : false" />
    </div>
</template>

<script>
import moment from 'moment-timezone';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'reservationInput',
    props: ['cellDateString'],
    computed: {
        ...mapGetters({
            activeView: 'activeView',
            processingData: 'checkDataProcessingState',
            selectedRawMaterial: 'selectedRawMaterial'
        })
    },
    data: function() {
        return {
            cellDate: moment(new Date(this.cellDateString)),
            maxUserInputValueAllowed: 5,
            userInputValue: null
        };
    },
    watch: {
        cellDateString: function(newDate) {
            this.cellDate = moment(new Date(newDate));
        },
        userInputValue: function(newValue) {
            if (
                (newValue === '') ||
                ((newValue < 1) || (newValue > this.maxUserInputValueAllowed)) ||
                (!Number.isInteger(newValue))
            ) {
                this.userInputValue = null;
            } else {
                this.processReservation();
            }
        }
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            shipmentReservation: 'shipmentReservation',
            employeeChatBroadcast: 'employeeChatBroadcast'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        processReservation: function() {
            this.processingDataSwitch(true);
            this.shipmentReservation({
                requestDate: this.cellDateString,
                CUS_NO: this.selectedRawMaterial.CUS_NO,
                PRD_NO: this.selectedRawMaterial.PRD_NO,
                typeId: this.selectedRawMaterial.typeId,
                qtyPerShipment: this.selectedRawMaterial.qtyPerShipment,
                shipmentCount: this.userInputValue
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                let actionDescription = `向【${this.selectedRawMaterial.CUST_SNM}】預約【${this.selectedRawMaterial.PRDT_SNM}-${this.selectedRawMaterial.specification}】【${this.userInputValue}】車，預定於【${this.cellDateString}】進廠。請採購人員注意下單時間`;
                return this.employeeChatBroadcast({ groupMessage: actionDescription });
            }).then((result) => {
                this.userInputValue = null;
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'reservationInput',
                    function: 'processReservation',
                    situation: '預約作業發生錯誤',
                    systemErrorMessage: error
                });
            });
        }
    }
};

</script>

<style>
input.reservationInput::-webkit-inner-spin-button,
input.reservationInput::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
