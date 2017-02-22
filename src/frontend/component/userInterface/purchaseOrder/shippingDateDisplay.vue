<template>
    <tbody>
        <tr><td colspan="7" class="text-left">送貨日期</td></tr>
        <tr v-for="(summaryArray,summaryIndex) in filterPOShipmentData">
            <td colspan="7" class="text-left" style="padding-left:40px;">
                <div>
                    {{pOShipmentSummary[summaryIndex].PRDT_SNM}} {{pOShipmentSummary[summaryIndex].specification}}
                </div>
                <div>
                    <span
                        v-for="shipment in summaryArray"
                        v-if="shipment.selected===true">
                        【{{shipment.workingMonth}}/{{shipment.workingDay}}】
                    </span>
                </div>
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
                pOShipmentList: 'getPOShipmentList',
                pOShipmentSummary: 'getPOShipmentSummary'
            }),
            filterPOShipmentData: function() {
                let shipmentArrayList = [];
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
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
