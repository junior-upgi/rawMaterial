<template>
    <div class="row table-responsive" style="font-size:75%;">
        <table class="table table-bordered table-condensed">
            <tbody>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>廠 商 名 稱</h6>
                    </td>
                    <td style="padding-left:20px;"
                        class="text-left"
                        :style="{border:printingBorder}">
                        <h6>{{supplier.NAME}}</h6>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>訂 單 編 號</h6>
                    </td>
                    <td :style="{border:printingBorder}">
                        <h6>{{pONumber}}</h6>
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>業 務 聯 絡 人</h6>
                    </td>
                    <td class="text-left" style="padding-left:20px;"
                        :style="{border:printingBorder}">
                        <h6>
                            <span>{{supplier.CNT_MAN1}}</span>
                            <span v-if="supplier.CNT_MAN2!==null">/</span>
                            <span v-if="supplier.CNT_MAN2!==null">{{supplier.CNT_MAN2}}</span>
                        </h6>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>訂 貨 日 期</h6>
                    </td>
                    <td :style="{border:printingBorder}">
                        <h6>{{documentDate}}</h6>
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>聯 絡 電 話</h6>
                    </td>
                    <td class="text-left" style="padding-left:20px;"
                        :style="{border:printingBorder}">
                        <h6>
                            <span>{{supplier.TEL1}}</span>
                            <span v-if="supplier.TEL2!==null">/</span>
                            <span v-if="supplier.TEL2!==null">{{supplier.TEL2}}</span>
                        </h6>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>訂 單 日 期</h6>
                    </td>
                    <td :style="{border:printingBorder}">
                        <h6>{{documentDate}} (修訂版本: {{revisionNumber|revToString}})</h6>
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>傳 真 電 話</h6>
                    </td>
                    <td class="text-left" style="padding-left:20px;"
                        :style="{border:printingBorder}">
                        <h6>{{supplier.FAX}}</h6>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">
                        <h6>採 購 經 辦</h6>
                    </td>
                    <td :style="{border:printingBorder}">
                        <h6>{{userInfo.NAME}} 分機:166</h6>
                    </td>
                </tr>
            </tbody>
        </table>
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
            'documentDate',
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

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
