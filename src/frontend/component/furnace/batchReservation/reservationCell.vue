<template>
    <div class="container-fluid">
        <div class="row">
            <span
                class="label label-primary col-xs-12"
                style="margin-bottom:10px;padding:3px;">
                {{cellDate.format('M/D')}}
            </span>
            <div class="container-fluid">
                <reservationInput
                    v-if="isFutureDate()||role==='admin'"
                    :cellDateString="cellDateString">
                </reservationInput>
            </div>
            <span
                v-if="completedShipmentCount>0"
                class="label label-warning col-xs-12"
                style="padding:10px 0px 10px 0px;">
                已進廠車次: {{completedShipmentCount}}
            </span>
            <cancelReservation
                v-if="pendingShipmentCount>0"
                :shipmentSchedule="pendingShipmentSchedule">
            </cancelReservation>
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import reservationInput from './reservationInput.vue';
    import cancelReservation from './cancelReservation.vue';

    export default {
        name: 'reservationCell',
        components: {
            cancelReservation,
            reservationInput
        },
        props: [
            'cellDateString',
            'shipmentSchedule',
            'shipmentSummary'
        ],
        computed: {
            ...mapGetters({
                processingData: 'checkDataProcessingState',
                role: 'role'
            }),
            completedShipmentCount: function() {
                let completedShipmentCount = 0;
                this.shipmentSchedule.forEach((shipment) => {
                    if (shipment.PS_DD !== null) {
                        completedShipmentCount += 1;
                    }
                });
                return completedShipmentCount;
            },
            pendingShipmentSchedule: function() {
                return this.shipmentSchedule.filter((shipment) => {
                    return shipment.PS_DD === null;
                });
            },
            pendingShipmentCount: function() {
                let pendingShipmentCount = 0;
                this.shipmentSchedule.forEach((shipment) => {
                    if (shipment.PS_DD === null) {
                        pendingShipmentCount += 1;
                    }
                });
                return pendingShipmentCount;
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
                let today = new Date();
                let referenceDate = new Date(this.cellDateString);
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
