<template>
    <div class="container-fluid">
        <div class="row">
            <span class="label label-primary col-xs-12" style="margin-bottom:10px;padding:3px;">
                    {{cellDate.format('M/D')}}
                </span>
            <div class="container-fluid">
                <reservationInput v-if="isFutureDate()||role==='admin'" :cellDateString="cellDateString">
                </reservationInput>
            </div>
            <span v-if="receivedCount>0" class="label label-default col-xs-12" style="padding:5px 0px 5px 0px;margin-bottom:5px;">
                    已進廠車次: {{receivedCount}}
                </span>
            <pendingShipment v-if="pendingShipmentSchedule.length > 0" :shipmentSchedule="pendingShipmentSchedule">
            </pendingShipment>
            <pOPendingShipment v-if="pOPendingShipmentSchedule.length > 0" :shipmentSchedule="pOPendingShipmentSchedule">
            </pOPendingShipment>
            <span v-if="revokedShipmentSchedule.length>0" class="label label-default col-xs-12" style="padding:5px 0px 5px 0px;">
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
            workingYear: 'workingYear'
        }),
        receivedCount: function() {
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
        pOPendingShipmentSchedule: function() {
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
        pendingShipmentSchedule: function() {
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
        revokedShipmentSchedule: function() {
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
        }
    },
    data: function() {
        return {
            cellDate: moment.utc(this.cellDateString, 'YYYY-MM-DD HH:mm:ss')
        };
    },
    watch: {
        cellDateString: function(newDate) {
            this.cellDate = moment.utc(newDate, 'YYYY-MM-DD HH:mm:ss');
        }
    },
    methods: {
        isFutureDate: function() {
            const today = new Date();
            const referenceDate = new Date(this.cellDateString);
            today.setHours(0, 0, 0, 0);
            referenceDate.setHours(0, 0, 0, 0);
            return (referenceDate >= today) ? true : false;
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
