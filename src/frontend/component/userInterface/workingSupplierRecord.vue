<template>
    <tr>
        <td class="text-left">{{supplier.PRDT_SNM}}</td>
        <td class="text-left">
            <shipping-date-list
                :dateList="dateList">
            </shipping-date-list>
        </td>
        <td>{{supplier.CUS_SNM}}</td>
        <td></td>
    </tr>
</template>

<script>
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
        components: { shippingDateList }
    };

</script>
