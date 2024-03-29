<template lang="html">
    <div class="container-fluid">
        <div class="row">
            <span
                class="label col-xs-12"
                style="margin-bottom:10px;padding:3px;border:2px solid black;"
                :class="{'label-primary':!isVacationDay,'label-danger':isVacationDay}">
                {{cellDate.format('M/D')}}
                <span v-if="isVacationDay">(假日)</span>
            </span>
            <div class="container-fluid">
                <reservationInput
                    v-if="isFutureDate()||role==='admin'"
                    :cellDateString="cellDateString"
                    :vacationException="releventVacationException"
                    :isVacationDay="isVacationDay">
                </reservationInput>
            </div>
            <span
                v-if="receivedCount>0"
                class="label label-default col-xs-12"
                style="padding:5px 0px 5px 0px;margin-bottom:5px;">
                已進廠車次: {{receivedCount}}
            </span>
            <pendingShipment
                v-if="pendingShipmentSchedule.length > 0"
                :shipmentSchedule="pendingShipmentSchedule"
                :cellDateString="cellDateString">
            </pendingShipment>
            <pOPendingShipment
                v-if="pOPendingShipmentSchedule.length > 0"
                :shipmentSchedule="pOPendingShipmentSchedule"
                :cellDateString="cellDateString">
            </pOPendingShipment>
            <span
                v-if="revokedShipmentSchedule.length>0"
                class="label label-default col-xs-12"
                style="padding:5px 0px 5px 0px;">
                待取消車次: {{revokedShipmentSchedule.length}}
            </span>
        </div>
    </div>
</template>

<script>
import moment from 'moment-timezone';
import { mapGetters } from 'vuex';
import reservationInput from './reservationInput.vue';
import pendingShipment from './pendingShipment.vue';
import pOPendingShipment from './pOPendingShipment.vue';

export default {
    name: 'reservationCell',
    components: {
        reservationInput,
        pendingShipment,
        pOPendingShipment
    },
    props: [
        'cellDateString',
        'shipmentSchedule'
    ],
    computed: {
        ...mapGetters({
            role: 'role',
            selectedRawMaterial: 'selectedRawMaterial',
            workingMonth: 'workingMonth',
            workingYear: 'workingYear',
            vacationException: 'vacationException'
        }),
        receivedCount: function () {
            let receivedShipmentList = this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.receivedDate !== null) &&
                    (shipment.supplierWeight !== null) &&
                    (shipment.actualWeight !== null) &&
                    (this.selectedRawMaterial.CUS_NO === shipment.CUS_NO) &&
                    (this.selectedRawMaterial.PRD_NO === shipment.PRD_NO) &&
                    (this.selectedRawMaterial.typeId === shipment.typeId) &&
                    (this.workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                    (this.workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('MM')))
                );
            });
            return receivedShipmentList.length;
        },
        pOPendingShipmentSchedule: function () {
            let pOPendingList = this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.receivedDate === null) &&
                    (shipment.supplierWeight === null) &&
                    (shipment.actualWeight === null) &&
                    (shipment.deprecated === null) &&
                    (shipment.pOId === null) &&
                    (this.selectedRawMaterial.CUS_NO === shipment.CUS_NO) &&
                    (this.selectedRawMaterial.PRD_NO === shipment.PRD_NO) &&
                    (this.selectedRawMaterial.typeId === shipment.typeId) &&
                    (this.workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                    (this.workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('MM')))
                );
            });
            return pOPendingList;
        },
        pendingShipmentSchedule: function () {
            let pendingList = this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.receivedDate === null) &&
                    (shipment.supplierWeight === null) &&
                    (shipment.actualWeight === null) &&
                    (shipment.deprecated === null) &&
                    (shipment.pOId !== null) &&
                    (this.selectedRawMaterial.CUS_NO === shipment.CUS_NO) &&
                    (this.selectedRawMaterial.PRD_NO === shipment.PRD_NO) &&
                    (this.selectedRawMaterial.typeId === shipment.typeId) &&
                    (this.workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                    (this.workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('MM')))
                );
            });
            return pendingList;
        },
        revokedShipmentSchedule: function () {
            let revokedList = this.shipmentSchedule.filter((shipment) => {
                return (
                    (shipment.receivedDate === null) &&
                    (shipment.supplierWeight === null) &&
                    (shipment.actualWeight === null) &&
                    (shipment.deprecated !== null) &&
                    (shipment.pOId !== null) &&
                    (shipment.purchaseOrder.deprecated === null) &&
                    (this.selectedRawMaterial.CUS_NO === shipment.CUS_NO) &&
                    (this.selectedRawMaterial.PRD_NO === shipment.PRD_NO) &&
                    (this.selectedRawMaterial.typeId === shipment.typeId) &&
                    (this.workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                    (this.workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('MM')))
                );
            });
            return revokedList;
        },
        releventVacationException: function () {
            // 由資料表 vacationException 篩選此工作窗格是否有相關特定休假日資料
            // .flag === true - 特別預定為"休假日"
            // .flag === false - 特別預定為"不休假日"
            // .flag === null - 未設定
            let dateMatchedRecord = this.vacationException.filter((exceptionEntry) => {
                return (exceptionEntry.exceptionDate === this.cellDateString);
            });
            if (dateMatchedRecord.length > 0) {
                if ((dateMatchedRecord[0].CUS_NO === null) || (dateMatchedRecord[0].CUS_NO === this.selectedRawMaterial.CUS_NO)) {
                    return dateMatchedRecord[0];
                }
            } else {
                return {
                    exceptionDate: this.cellDateString,
                    flag: null,
                    CUS_NO: null
                };
            }
        },
        isVacationDay: function () {
            if (this.releventVacationException.flag !== null) {
                return this.releventVacationException.flag;
            } else {
                let weekday = new Date(this.cellDateString).getDay();
                // if (this.cellDateString)
                if ((weekday === 6) || (weekday === 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    data: function () {
        return {
            cellDate: moment.utc(this.cellDateString, 'YYYY-MM-DD HH:mm:ss')
        };
    },
    watch: {
        cellDateString: function (newDate) {
            this.cellDate = moment.utc(newDate, 'YYYY-MM-DD HH:mm:ss');
        }
    },
    methods: {
        isFutureDate: function () {
            const today = new Date();
            const referenceDate = new Date(this.cellDateString);
            today.setHours(0, 0, 0, 0);
            referenceDate.setHours(0, 0, 0, 0);
            return (referenceDate >= today) ? true : false;
        }
    }
};

</script>

<style></style>
