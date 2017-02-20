<template>
    <tr>
        <td style="white-space:nowrap;">{{supplier.CUS_SNM}}</td>
        <td class="text-centered" style="white-space:nowrap;">{{supplier.PRDT_SNM}}</td>
        <td class="text-left">
            <shipping-date-list
                :dateList="dateList">
            </shipping-date-list>
        </td>
        <tonnage-display
            :CUS_NO="supplier.CUS_NO"
            :PRD_NO="supplier.PRD_NO">
        </tonnage-display>
    </tr>
</template>

<script>
    import tonnageDisplay from './tonnageDisplay.vue';

    const shippingDateList = {
        name: 'shippingDateList',
        props: ['dateList'],
        template: `
            <span>
                <span
                    style="margin-right:5px;"
                    v-for="date in dateList"
                    class="badge">{{date}}</span>
            </span>`
    };

    export default {
        name: 'workingSupplier',
        props: [
            'dateList',
            'supplier'
        ],
        components: {
            shippingDateList,
            tonnageDisplay
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
