<template>
    <tr>
        <td :style="{border:printingBorder}"><h4 style="margin-top:4px;margin-bottom:4px;">{{index+1}}</h4></td>
        <td :style="{border:printingBorder}"><h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.PRDT_SNM}}</h4></td>
        <td :style="{border:printingBorder}"><h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.specification}}</h4></td>
        <td class="text-right" style="padding-right:30px;"
            :style="{border:printingBorder}">
            <h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.workingWeight|formatWeight}}</h4>
        </td>
        <td :style="{border:printingBorder}"><h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.UT}}</h4></td>
        <td class="text-right" style="padding-right:30px;"
            :style="{border:printingBorder}">
            <h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.unitPrice|formatCurrency}}</h4>
        </td>
        <td class="text-right" style="padding-right:30px;"
            :style="{border:printingBorder}">
            <h4 style="margin-top:4px;margin-bottom:4px;">{{summaryItem.unitPrice*summaryItem.workingWeight|formatCurrency}}</h4>
        </td>
    </tr>
</template>

<script>
    import { mapGetters } from 'vuex';
    import numeral from 'numeral';

    export default {
        name: 'summaryEntry',
        props: ['index', 'summaryItem'],
        computed: {
            ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
            }
        },
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
