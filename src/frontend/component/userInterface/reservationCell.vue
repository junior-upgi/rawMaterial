<template>
    <div class="container-fluid">
        <div class="row">
            <span class="badge col-xs-12" style="margin-bottom:10px;">
                {{cellDate.format('M/D')}}
            </span>
            <div class="container-fluid">
                <div class="row" style="margin-bottom:6px;">
                    <input
                        v-show="isFutureDate()||role==='admin'"
                        type="number"
                        min="1"
                        max="5"
                        step="1"
                        placeholder="預約車趟"
                        class="form-control text-center input-sm reservationInput"
                        v-model.lazy.number="userInputValue"
                        :disabled="processingData?true:false" />
                </div>
            </div>
            <button
                v-if="completedShipmentCount>0"
                class="text-left btn btn-sm btn-dafault btn-block"
                disabled>
                已進廠:&nbsp;&nbsp;&nbsp;<span class="badge">{{completedShipmentCount}}</span>
            </button>
            <button
                v-if="pendingShipmentCount>0"
                class="text-left btn btn-sm btn-warning btn-block"
                @click="cancelReservation"
                :disabled="processingData?true:false">
                待進廠:&nbsp;&nbsp;&nbsp;<span class="badge">{{pendingShipmentCount}}</span>
            </button>
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
            'dailyShipmentList'
        ],
        computed: {
            ...mapGetters({
                role: 'getRole',
                processingData: 'checkDataProcessingState',
                selectedRawMat: 'getSelectedRawMat'
            }),
            pendingShipmentSummary: function() {
                return this.dailyShipmentList.filter((shipment) => {
                    return shipment.received === 0;
                })[0];
            },
            pendingShipmentCount: function() {
                return this.pendingShipmentSummary === undefined ? 0 : this.pendingShipmentSummary.quantity;
            },
            completedShipmentSummary: function() {
                return this.dailyShipmentList.filter((shipment) => {
                    return shipment.received === 1;
                })[0];
            },
            completedShipmentCount: function() {
                return this.completedShipmentSummary === undefined ? 0 : this.completedShipmentSummary.quantity;
            }
        },
        data: function() {
            return {
                cellDate: moment(this.cellDateString),
                userInputValue: null
            };
        },
        watch: {
            cellDateString: function(newDate) {
                this.cellDate = moment(newDate);
            },
            userInputValue: function(newValue) {
                if (
                    (newValue === '') ||
                    ((newValue < 1) || (newValue > 10)) ||
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
                bookShipment: 'bookShipment',
                cancelShipment: 'cancelShipment'
            }),
            ...mapMutations({
                rebuildData: 'rebuildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            cancelReservation: function() {
                this.processingDataSwitch(true);
                this.cancelShipment({
                    id: null,
                    requestDate: this.cellDateString,
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
            },
            isFutureDate: function() {
                let today = new Date();
                let referenceDate = new Date(this.cellDateString);
                today.setHours(0, 0, 0, 0);
                referenceDate.setHours(0, 0, 0, 0);
                return (referenceDate >= today) ? true : false;
            },
            processReservation: function() {
                this.processingDataSwitch(true);
                this.bookShipment({
                    requestDate: this.cellDateString,
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
