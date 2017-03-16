<template>
    <td colspan="3" :style="{border:printingBorder}">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-4 text-left">金額</div>
                <div class="col-xs-8 text-right">{{pOSummaryNet|formatCurrency}} {{activePO.supplier.currency}}</div>
            </div>
            <div class="row">
                <div class="col-xs-4 text-left">稅金 {{activePO.supplier.taxRate * 100}}%</div>
                <div class="col-xs-8 text-right">{{pOSummaryTax|formatCurrency}} {{activePO.supplier.currency}}</div>
            </div>
            <div class="row">
                <div class="col-xs-4 text-left">總計</div>
                <div class="col-xs-8 text-right">{{pOSummaryGross|formatCurrency}} {{activePO.supplier.currency}}</div>
            </div>
        </div>
    </td>
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters } from 'vuex';
    export default {
        name: 'amountSummary',
        props: ['activePO'],
        computed: {
            ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
            },
            pOSummaryGross: function() {
                return this.pOSummaryNet + this.pOSummaryTax;
            },
            pOSummaryNet: function() {
                if(this.activePO.customNet === null) {
                    let amount = 0;
                    this.activePO.shipments.forEach((shipment) => {
                        amount += shipment.unitPrice * shipment.requestWeight;
                    });
                    return amount;
                } else {
                    return this.activePO.customNet;
                }
            },
            pOSummaryTax: function() {
                if(this.activePO.customTax === null) {
                    let amount = 0;
                    this.activePO.shipments.forEach((shipment) => {
                        amount += shipment.unitPrice * shipment.requestWeight * this.activePO.supplier.taxRate;
                    });
                    return amount;
                } else {
                    return this.activePO.customTax;
                }
            }
        },
        filters: {
            formatCurrency: function(amount) {
                return numeral(amount).format('0,0.[00]');
            }
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
