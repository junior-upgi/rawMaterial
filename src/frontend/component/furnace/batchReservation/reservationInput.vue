<template>
    <div class="row" style="margin-bottom:6px;">
        <input
            reservationType="number"
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
        name: 'reservationInput',
        props: ['cellDateString'],
        computed: {
            ...mapGetters({
                activeView: 'activeView',
                processingData: 'checkDataProcessingState',
                selectedRawMaterial: 'selectedRawMaterial',
                shipmentSchedule: 'shipmentSchedule',
                userData: 'userData',
                workingSupplierDetail: 'workingSupplierDetail',
                workingMonth: 'workingMonth',
                workingYear: 'workingYear'
            }),
            releventShipmentSchedule: function() {
                let list = this.shipmentSchedule.filter((shipment) => {
                    return shipment.CUS_NO === this.selectedRawMaterial.CUS_NO;
                });
                switch (this.workingSupplierDetail.contractType) {
                    case 'annual':
                        return list.filter((shipment) => {
                            return shipment.workingYear === this.workingYear;
                        });
                    case 'monthly':
                        return list.filter((shipment) => {
                            return (
                                (shipment.workingYear === this.workingYear) &&
                                (shipment.workingMonth === this.workingMonth)
                            );
                        });
                    case 'oneTime':
                        return list;
                    default:
                        alert('相關訂單擷取作業錯誤，作業終止。');
                        this.resetStore();
                }
            },
            releventRequestList: function() {
                let flags = [];
                let releventErpRequestList = [];
                for (let index = 0; index < this.releventShipmentSchedule.length; index++) {
                    if (flags[this.releventShipmentSchedule[index].SQ_NO]) {
                        continue;
                    } else {
                        flags[this.releventShipmentSchedule[index].SQ_NO] = true;
                        releventErpRequestList.push(this.releventShipmentSchedule[index].SQ_NO);
                    }
                }
                return releventErpRequestList;
            },
            specificShipmentSchedule: function() {
                let filteredShipmentSchedule = this.shipmentSchedule.filter((shipment) => {
                    return (
                        (shipment.shipmentCount > shipment.receivedCount) &&
                        (shipment.workingDate === this.cellDateString) &&
                        (shipment.CUS_NO === this.selectedRawMaterial.CUS_NO) &&
                        (shipment.PRD_NO === this.selectedRawMaterial.PRD_NO) &&
                        (shipment.typeId === this.selectedRawMaterial.typeId)
                    );
                });
                if (filteredShipmentSchedule.length <= 1) {
                    return (filteredShipmentSchedule.length === 1) ? filteredShipmentSchedule[0] : [];
                } else {
                    this.componentErrorHandler({
                        component: 'reservationInput',
                        function: 'specificShipmentSchedule',
                        situation: 'filtered result yielded more than one shipment'
                    });
                }
            },
            specificRequestList: function() {
                let flags = [];
                let specificErpRequestList = [];
                for (let index = 0; index < this.specificShipmentSchedule.length; index++) {
                    if (flags[this.specificShipmentSchedule[index].id]) {
                        continue;
                    } else {
                        flags[this.specificShipmentSchedule[index].id] = true;
                        specificErpRequestList.push(this.specificShipmentSchedule[index].id);
                    }
                }
                return specificErpRequestList;
            }
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
                    ((newValue < 1) || (newValue > 5)) ||
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
            ...mapMutations({
                buildStore: 'buildStore',
                forceViewChange: 'forceViewChange',
                rebuildData: 'rebuildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore',
                restoreToken: 'restoreToken',
                generateSqno: 'generateSqno'
            }),
            ...mapActions({
                componentErrorHandler: 'componentErrorHandler',
                initData: 'initData',
                shipmentReservation: 'shipmentReservation'
            }),
            generateSqno: function(reservationType) {
                let contractType = this.workingSupplierDetail.contractType;
                let CUS_NO = this.workingSupplierDetail.CUS_NO;
                let yearPart = (this.workingYear - 1911).toString();
                let monthPart = ('00' + this.workingMonth).slice(-2);
                let oneTimeDatePart = this.cellDateString.slice(-10, 4) + moment.utc(new Date(this.cellDateString)).format('MMDD');
                if ((reservationType === 'new') && (contractType === 'monthly')) {
                    return `SQ${yearPart}${monthPart}-${CUS_NO}-001`;
                } else if ((reservationType === 'new') && (contractType === 'annual')) {
                    return `SQ${yearPart}-${CUS_NO}-001`;
                } else if ((reservationType === 'new') && (contractType === 'oneTime')) {
                    return `SQ${oneTimeDatePart}-${CUS_NO}-001`;
                } else {
                    this.componentErrorHandler({
                        component: 'reservationInput',
                        function: 'generateSqno',
                        situation: '產生 SQ_NO 發生錯誤，作業終止。'
                    });
                }
            },
            processReservation: function() {
                let recordData = {};
                this.processingDataSwitch(true);
                if (this.specificRequestList.length === 1) {
                    recordData.processType = 'update';
                    console.log('請購資料覆寫更新');
                } else if ((this.specificRequestList.length === 0) && (this.releventRequestList.length === 1)) {
                    recordData.processType = 'append';
                    console.log('請購資料補充更新');
                } else if ((this.specificRequestList.length === 0) && (this.releventRequestList.length === 0)) {
                    recordData.SQ_NO = this.generateSqno('new');
                    recordData.processType = 'new';
                    recordData.contractType = this.workingSupplierDetail.contractType;
                    recordData.requestDate = this.cellDateString;
                    recordData.CUS_NO = this.selectedRawMaterial.CUS_NO;
                    recordData.PRD_NO = this.selectedRawMaterial.PRD_NO;
                    recordData.PRDT_SNM = this.selectedRawMaterial.PRDT_SNM;
                    recordData.typeId = this.selectedRawMaterial.typeId;
                    recordData.qtyPerShipment = this.selectedRawMaterial.qtyPerShipment;
                    recordData.unitPrice = this.selectedRawMaterial.unitPrice;
                    recordData.currency = this.selectedRawMaterial.currency;
                    recordData.shipmentCount = this.userInputValue;
                    recordData.workingMonth = this.workingMonth;
                    recordData.workingYear = this.workingYear;
                } else if (this.specificRequestList.length > 1) {
                    this.componentErrorHandler({
                        component: 'reservationInput',
                        function: 'processReservation',
                        situation: '單品項同一"日期"存在超過一組預約資料'
                    });
                } else if (this.releventRequestList.length > 1) {
                    this.componentErrorHandler({
                        component: 'reservationInput',
                        function: 'processReservation',
                        situation: '單品項同一"時期"存在超過一組預約資料'
                    });
                } else {
                    this.componentErrorHandler({
                        component: 'reservationInput',
                        function: 'processReservation',
                        situation: '資料筆數出現無法偵測異常'
                    });
                }
                this.shipmentReservation(recordData)
                    .then((resultset) => {
                        this.rebuildData(resultset.data);
                        this.processingDataSwitch(false);
                    }).catch((error) => {
                        this.componentErrorHandler({
                            component: 'reservationInput',
                            function: 'shipmentReservation',
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
