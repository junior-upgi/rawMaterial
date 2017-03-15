<template>
    <tbody :style="{border:printingBorder}">
        <tr>
            <td colspan="7" class="text-left" style="padding-left:15px;">
                <h4 style="margin-bottom:10px;"><strong>送貨日期</strong></h4>
                <span v-for="receivingRecord in releventReceivingRecord">
                    【{{receivingRecord.workingMonth}}/{{receivingRecord.workingDay}}】
                </span>
            </td>
        </tr>
        <!--
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
        -->
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'shippingDateDisplay',
        props: ['activePO'],
        computed: {
            ...mapGetters({
                consolidatedReceivingRecord: 'consolidatedReceivingRecord',
                pOPrintMode: 'checkPOPrintMode'
                // rawMaterialList: 'rawMaterialList'
                /* ,
                pOShipmentList: 'getPOShipmentList',
                pOShipmentSummary: 'getPOShipmentSummary'
                */
            }),
            /* ,
            releventRawMaterialList: function() {
                return this.rawMaterialList.filter((rawMaterial) => {
                    return rawMaterial.CUS_NO === this.activePO.CUS_NO;
                });
            }
            */
            releventReceivingRecord: function() {
                return this.consolidatedReceivingRecord.filter((receivingRecord) => {
                    return receivingRecord.CUS_NO === this.activePO.CUS_NO;
                });
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
