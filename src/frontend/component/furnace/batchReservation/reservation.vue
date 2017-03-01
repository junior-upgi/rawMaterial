<template>
    <div class="row" style="margin-bottom:6px;">
        <input
            type="number"
            min="1"
            max="5"
            step="1"
            placeholder="預約車趟"
            class="form-control text-center input-sm reservationInput"
            v-model.lazy.number="userInputValue"
            :disabled="processingData?true:false" />
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'reservation',
        props: ['cellDateString'],
        computed: {
            ...mapGetters({
                processingData: 'checkDataProcessingState'
                // selectedRawMat: 'getSelectedRawMat'
            })
        },
        data: function() {
            return {
                cellDate: moment.utc(this.cellDateString, 'YYYY-MM-DD HH:mm:ss'),
                userInputValue: null
            };
        },
        watch: {
            cellDateString: function(newDate) {
                this.cellDate = moment.utc(newDate, 'YYYY-MM-DD HH:mm:ss');
            },
            userInputValue: function(newValue) {
                if (
                    (newValue === '') ||
                    ((newValue < 1) || (newValue > 10)) ||
                    (!Number.isInteger(newValue))
                ) {
                    this.userInputValue = null;
                } else {
                    // this.processReservation();
                }
            }
        },
        methods: {
            /*
            ...mapActions({
                bookShipment: 'bookShipment',
                cancelShipment: 'cancelShipment'
            }),
            ...mapMutations({
                rebuildData: 'rebuildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            processReservation: function() {
                this.processingDataSwitch(true);
                this.bookShipment({
                    requestDate: this.cellDate,
                    CUS_NO: this.selectedRawMat.CUS_NO,
                    PRD_NO: this.selectedRawMat.PRD_NO,
                    typeId: this.selectedRawMat.typeId,
                    quantity: this.userInputValue
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.userInputValue = null;
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`預約進貨作業發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            }
            */
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
