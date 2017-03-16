<template>
    <div class="row" style="margin-bottom:6px;">
        <input reservationType="number" min="1" :max="maxUserInputValueAllowed" step="1" placeholder="預約車趟" class="form-control text-center input-sm reservationInput" v-model.lazy.number="userInputValue" :disabled="processingData?true:false" />
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
                this.userInputValue = null;
            }
        }
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            shipmentReservation: 'shipmentReservation'
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
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
input.reservationInput::-webkit-inner-spin-button,
input.reservationInput::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
