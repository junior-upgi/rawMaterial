<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>

<template>
    <div class="container">
        <div v-if="supplier" class="row table-responsive">
            <table class="table table-bordered table-condensed">
                <tbody>
                    <tr>
                        <td :style="{border:printingBorder}">
                            <h5>廠 商 名 稱</h5>
                        </td>
                        <td style="padding-left:20px;"
                            class="text-left"
                            :style="{border:printingBorder}">
                            <h5>{{supplier.NAME}}</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>訂 單 編 號</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>{{pONumber}}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td :style="{border:printingBorder}">
                            <h5>業 務 聯 絡 人</h5>
                        </td>
                        <td class="text-left" style="padding-left:20px;"
                            :style="{border:printingBorder}">
                            <h5>
                                <span>{{supplier.CNT_MAN1}}</span>
                                <span v-if="supplier.CNT_MAN2!==null">/</span>
                                <span v-if="supplier.CNT_MAN2!==null">{{supplier.CNT_MAN2}}</span>
                            </h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>訂 貨 日 期</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>{{pODate}}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td :style="{border:printingBorder}">
                            <h5>聯 絡 電 話</h5>
                        </td>
                        <td class="text-left" style="padding-left:20px;"
                            :style="{border:printingBorder}">
                            <h5>
                                <span>{{supplier.TEL1}}</span>
                                <span v-if="supplier.TEL2!==null">/</span>
                                <span v-if="supplier.TEL2!==null">{{supplier.TEL2}}</span>
                            </h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>訂 單 日 期</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>{{pODate}} (修訂版本: {{revisionNumber|revToString}})</h5>
                        </td>
                    </tr>
                    <tr>
                        <td :style="{border:printingBorder}">
                            <h5>傳 真 電 話</h5>
                        </td>
                        <td class="text-left" style="padding-left:20px;"
                            :style="{border:printingBorder}">
                            <h5>{{supplier.FAX}}</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>採 購 經 辦</h5>
                        </td>
                        <td :style="{border:printingBorder}">
                            <h5>{{userInfo.NAME}} 分機:166</h5>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'generalSection',
        props: [
            'supplier',
            'userInfo',
            'pONumber',
            'pODate',
            'revisionNumber'
        ],
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
            revToString: function(revisionNumber) {
                return ('0' + revisionNumber).slice(-2);
            }
        }
    };

</script>
