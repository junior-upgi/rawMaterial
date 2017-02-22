<template>
    <tr>
        <td>{{index+1}}</td>
        <td>{{summaryItem.PRDT_SNM}}</td>
        <td>{{summaryItem.specification}}</td>
        <td class="text-right" style="padding-right:30px;">{{summaryItem.workingWeight|formatWeight}}</td>
        <td>{{summaryItem.UT}}</td>
        <td class="text-right" style="padding-right:30px;">{{summaryItem.unitPrice|formatCurrency}}</td>
        <td class="text-right" style="padding-right:30px;">{{summaryItem.unitPrice*summaryItem.workingWeight|formatCurrency}}</td>
    </tr>
</template>

<script>
    import numeral from 'numeral';

    export default {
        name: 'summaryEntry',
        props: ['index', 'summaryItem'],
        filters: {
            formatWeight: function(weight) {
                return numeral(weight).format('0,0');
            },
            formatCurrency: function(amount) {
                return '$' + numeral(amount).format('0,0.00');
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
