<template lang="html">
    <td colspan="4" :style="{border:printingBorder}">
        <div class="container-fluid text-left">
            <h4>備 註：</h4>
            <ol>
                <li>請於送貨單上註明訂單編號</li>
                <li>請回覆訂單以確定交貨期</li>
                <li>付款方式：月結3個月電匯</li>
                <li>統一編號：{{UNI_NO}}</li>
                <li>送貨地點：{{CMP_ADR}}</li>
            </ol>
        </div>
    </td>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'paymentTerms',
    props: ['UNI_NO', 'CMP_ADR'],
    computed: {
        ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
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
