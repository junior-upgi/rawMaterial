<template>
    <tbody :style="{border:printingBorder}">
        <tr>
            <td colspan="7" class="text-left">
                <h4 style="margin-top:0px;margin-bottom:0px;">送貨日期：</h4>
            </td>
        </tr>
        <tr v-for="(rawMaterial, index) in releventRawMaterialList">
            <shippingDateRecord :index="index" :rawMaterial="rawMaterial" :shipmentList="activePO.shipments">
            </shippingDateRecord>
        </tr>
    </tbody>
</template>

<script>
import { mapGetters } from 'vuex';
import shippingDateRecord from './shippingDateRecord.vue';

export default {
    name: 'shippingDateDisplay',
    components: { shippingDateRecord },
    props: ['activePO'],
    computed: {
        ...mapGetters({
            // consolidatedReceivingRecord: 'consolidatedReceivingRecord',
            pOPrintMode: 'checkPOPrintMode',
            rawMaterialList: 'rawMaterialList'
        }),
        releventRawMaterialList: function() {
            return this.rawMaterialList.filter((rawMaterial) => {
                return rawMaterial.CUS_NO === this.activePO.CUS_NO;
            });
        },
        /*
        releventReceivingRecord: function() {
            return this.consolidatedReceivingRecord.filter((receivingRecord) => {
                return receivingRecord.CUS_NO === this.activePO.CUS_NO;
            });
        },
        */
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
