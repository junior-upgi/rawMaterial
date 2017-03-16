<template lang="html">
    <tbody v-if="!summarizedMode && !pOPrintMode">
        <tr v-for="(shipment, shipmentIndex) in activePO.shipments" style="font-size:75%;" @click="summarizedMode=!summarizedMode">
            <td>{{shipmentIndex + 1}}</td>
            <td>{{releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).PRDT_SNM}}</td>
            <td style="white-space:nowrap;">{{releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).specification}}</td>
            <td>{{shipment.requestWeight|markThousand}}</td>
            <td>{{releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).UT}}</td>
            <td>
                {{unitPrice(shipment.unitPrice, releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).unitPrice)|unitPrice}} {{releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).currency}}
            </td>
            <td>
                {{(unitPrice(shipment.unitPrice, releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).unitPrice) * shipment.requestWeight)|markThousand}} {{releventRawMaterial(shipment.CUS_NO, shipment.PRD_NO, shipment.typeId).currency}}
            </td>
        </tr>
    </tbody>
    <tbody v-else-if="summarizedMode || pOPrintMode" :style="{border:printingBorder}">
        <tr v-for="(summaryEntry, summaryIndex) in releventPOContentSummary" :style="{border:printingBorder}" @click="summarizedMode=!summarizedMode">
            <td :style="{border:printingBorder}">{{summaryIndex + 1}}</td>
            <td :style="{border:printingBorder}">{{summaryEntry.PRDT_SNM}}</td>
            <td :style="{border:printingBorder}" style="white-space:nowrap;">{{summaryEntry.specification}}</td>
            <td class="text-right" :style="{border:printingBorder}">{{summaryEntry.totalRequestedWeight|markThousand}}</td>
            <td :style="{border:printingBorder}" style="white-space:nowrap;">{{summaryEntry.UT}}</td>
            <td class="text-right" style="white-space:nowrap;" :style="{border:printingBorder}">{{summaryEntry.unitPrice|unitPrice}} {{summaryEntry.currency}}</td>
            <td class="text-right" style="white-space:nowrap;" :style="{border:printingBorder}">{{(summaryEntry.unitPrice * summaryEntry.totalRequestedWeight)|markThousand}} {{summaryEntry.currency}}</td>
        </tr>
    </tbody>
</template>

<script>
import numeral from 'numeral';
import { mapGetters } from 'vuex';
export default {
    name: 'summarySection',
    props: ['activePO'],
    computed: {
        ...mapGetters({
            pOPrintMode: 'checkPOPrintMode',
            pOContentSummary: 'pOContentSummary',
            rawMaterialList: 'rawMaterialList'
        }),
        releventPOContentSummary: function() {
            return this.pOContentSummary.filter((pOContentSummaryEntry) => {
                return pOContentSummaryEntry.pOId === this.activePO.id;
            });
        },
        printingBorder: function() {
            if (this.pOPrintMode) {
                return '2px solid black !important';
            } else {
                return null;
            }
        }
    },
    data: function() {
        return {
            summarizedMode: true
        };
    },
    methods: {
        releventRawMaterial: function(CUS_NO, PRD_NO, typeId) {
            return this.rawMaterialList.filter((rawMaterial) => {
                return (
                    (rawMaterial.CUS_NO === CUS_NO) &&
                    (rawMaterial.PRD_NO === PRD_NO) &&
                    (rawMaterial.typeId === typeId)
                );
            })[0];
        },
        unitPrice: function(shipmentUP, suggestedUP) {
            if (shipmentUP === null) {
                return `${suggestedUP}`;
            } else {
                return `${shipmentUP}`;
            }
        }
    },
    filters: {
        markThousand: function(value) {
            return `${numeral(value).format('0,0')}`;
        },
        unitPrice: function(value) {
            return `${numeral(value).format('0.[00000]')}`;
        }
    }
};
</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
