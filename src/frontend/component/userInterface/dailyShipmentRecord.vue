<template>
    <tr>
        <td>{{dailyShipment.requestDate}}</td>
        <td>{{dailyShipment.CUS_SNM}}</td>
        <td>{{dailyShipment.PRDT_SNM}}</td>
        <td class="text-left">{{dailyShipment.specification}}</td>
        <td>{{dailyShipment.quantity}}</td>
        <td>{{dailyShipment.estWeight|tonnage(dailyShipment.quantity)}}</td>
        <td class="text-left">{{dailyShipment.note}}</td>
    </tr>
</template>

<script>
    import numeral from 'numeral';
    export default {
        name: 'dailyShipmentRecord',
        props: ['dailyShipment'],
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 1000)).format('0,0.0')} 噸`;
            }
        }
    };

</script>
