<template>
    <div>
        <div>
            <span class="badge">{{cellDate.format('M/D')}}</span>
        </div>
        <br>
        <div v-if="dailyShipment!==undefined">
            <button
                type="button"
                class="btn btn-danger btn-xs"
                @click="cancelReservation"
                :disabled="processingData?true:false">
                <strong>取消預約</strong>:&nbsp;&nbsp;
                <span class="badge">{{dailyShipment.quantity}}</span>
            </button>
        </div>
        <div v-else>
            <input
                type="number"
                min="1"
                class="form-control input-sm text-center"
                v-model="quantity"
                @change="processReservation"
                :disabled="processingData?true:false" />
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import store from '../../store/store.js';

    export default {
        name: 'reservationCell',
        store: store,
        props: [
            'cellDateString',
            'dailyShipment'
        ],
        computed: {
            ...mapGetters({
                processingData: 'checkDataProcessingState',
                selectedRawMat: 'getSelectedRawMat'
            })
        },
        data: function() {
            return {
                cellDate: moment(this.cellDateString),
                quantity: null
            };
        },
        watch: {
            cellDateString: function(newDate) {
                this.cellDate = moment(newDate);
            },
            quantity: function(newValue) {
                if (newValue === '') {
                    this.quantity = null;
                }
            }
        },
        methods: {
            ...mapActions({
                bookShipment: 'bookShipment',
                cancelShipment: 'cancelShipment'
            }),
            ...mapMutations({
                buildData: 'buildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            cancelReservation: function() {
                this.processingDataSwitch(true);
                this.cancelShipment({
                        requestDate: this.cellDateString,
                        CUS_NO: this.selectedRawMat.CUS_NO,
                        PRD_NO: this.selectedRawMat.PRD_NO,
                        typeId: this.selectedRawMat.typeId
                    })
                    .then((resultset) => {
                        this.buildData(resultset.data);
                        this.processingDataSwitch(false);
                    })
                    .catch((error) => {
                        alert(`預約刪除作業發生錯誤，系統即將重置: ${error}`);
                        this.resetStore();
                    });
            },
            processReservation: function() {
                this.processingDataSwitch(true);
                this.bookShipment({
                        requestDate: this.cellDateString,
                        CUS_NO: this.selectedRawMat.CUS_NO,
                        PRD_NO: this.selectedRawMat.PRD_NO,
                        typeId: this.selectedRawMat.typeId,
                        quantity: this.quantity
                    })
                    .then((resultset) => {
                        this.buildData(resultset.data);
                        this.quantity = null;
                        this.processingDataSwitch(false);
                    })
                    .catch((error) => {
                        alert(`預約進貨作業發生錯誤，系統即將重置: ${error}`);
                        this.resetStore();
                    });
            }
        }
    };

</script>

<style>
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
