<template>
    <tbody :style="{border:printingBorder}">
        <tr>
            <td colspan="7" class="text-left" style="padding-left:15px;">
                <h4 style="margin-bottom:0px;"><strong>送貨日期</strong></h4>
            </td>
        </tr>
        <tr v-for="(summaryArray,summaryIndex) in filterPOShipmentData">
            <td colspan="7" class="text-left">
                <div style="padding-left:20px;">
                    <h4>
                        {{pOShipmentSummary[summaryIndex].PRDT_SNM}}
                        {{pOShipmentSummary[summaryIndex].specification}}
                    </h4>
                </div>
                <h4 style="padding-left:40px;">
                    <div>
                        <span
                            v-for="shipment in summaryArray"
                            v-if="shipment.selected===true">
                            【{{shipment.workingMonth}}/{{shipment.workingDay}}】
                        </span>
                    </div>
                </h4>
            </td>
        </tr>
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'shippingDateDisplay',
        computed: {
            ...mapGetters({
                pOPrintMode: 'checkPOPrintMode',
                pOShipmentList: 'getPOShipmentList',
                pOShipmentSummary: 'getPOShipmentSummary'
            }),
            filterPOShipmentData: function() {
                const shipmentArrayList = [];
                this.pOShipmentSummary.forEach((summaryItem, index) => {
                    shipmentArrayList.push([]);
                    this.pOShipmentList.forEach((shipment) => {
                        if (
                            (shipment.CUS_NO === summaryItem.CUS_NO) &&
                            (shipment.PRD_NO === summaryItem.PRD_NO) &&
                            (shipment.typeId === summaryItem.typeId)
                        ) {
                            shipmentArrayList[index].push(shipment);
                        }
                    });
                });
                return shipmentArrayList;
            },
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
