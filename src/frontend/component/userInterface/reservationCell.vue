<template>
    <div>
        <div>{{cellDate.format('M/D')}}</div>
        <br>
        <div v-if="shipment!==undefined">
            <button type="button" class="btn btn-danger btn-xs">
                取消預約: <span class="badge">{{shipment.quantity}}</span>
            </button>
        </div>
        <div v-else class="">
            <input
                type="number"
                min="1"
                class="form-control input-sm col-sm-2 text-center"
                v-model="quantity"
                @change="processReservation" />
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    export default {
        name: 'reservationCell',
        props: [
            'cellDateString',
            'shipment'
        ],
        data: function() {
            return {
                cellDate: moment(this.cellDateString),
                quantity: null
            };
        },
        watch: {
            quantity: function(newValue) {
                if (newValue === '') {
                    this.quantity = null;
                }
            }
        },
        methods: {
            processReservation: function() {
                console.log('new res');
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
