<template>
    <tr>
        <td style="white-space:nowrap;">{{material.CUS_SNM}}</td>
        <td class="text-centered" style="white-space:nowrap;">{{material.PRDT_SNM}}</td>
        <td class="text-left" style="padding-left:10px;">
            <shipping-date-list
                :dateList="dateList">
            </shipping-date-list>
        </td>
        <tonnage-display
            :CUS_NO="material.CUS_NO"
            :PRD_NO="material.PRD_NO">
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
        name: 'workingMaterialRecord',
        props: [
            'dateList',
            'material'
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
