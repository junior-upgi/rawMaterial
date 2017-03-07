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
                v-if="shipment.receivedCount>0"
                class="label label-warning col-xs-12"
                style="padding:10px 0px 10px 0px;margin-bottom:5px;">
                已進廠車次: {{shipment.receivedCount}}
            </span>
            <cancelPO
                v-if="(shipment.shipmentCount-shipment.receivedCount)>0 && shipment.OS_NO!==null"
                :shipment="shipment">
            </cancelPO>
            <cancelReservation
                v-if="(shipment.shipmentCount-shipment.receivedCount)>0 && shipment.OS_NO===null"
                :shipment="shipment">
            </cancelReservation>
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapGetters } from 'vuex';
    import reservationInput from './reservationInput.vue';
    import cancelPO from './cancelPO.vue';
    import cancelReservation from './cancelReservation.vue';

    export default {
        name: 'reservationCell',
        components: {
            cancelReservation,
            cancelPO,
            reservationInput
        },
        props: [
            'cellDateString',
            'shipment'
        ],
        computed: {
            ...mapGetters({
                processingData: 'checkDataProcessingState',
                role: 'role'
            })
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
