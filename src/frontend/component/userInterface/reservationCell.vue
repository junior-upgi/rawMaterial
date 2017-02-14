<template>
    <div>
        <div>{{cellDate.format('M/D')}}</div>
        <div v-if="shipment!==undefined">{{shipment.CUS_NO}}</div>
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
                cellDate: moment(this.cellDateString)
            };
        }
    };

</script>
