<template lang="html">
    <div class="row table-responsive" style="margin-top:20px;">
        <table class="table table-bordered table-condensed">
            <tbody>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">廠 商 名 稱</td>
                    <td
                        class="text-left"
                        style="font-size:150%;padding-left:20px;right-padding:0px;"
                        :style="{border:printingBorder}">{{activePO.supplier.NAME}}</td>
                    <td class="bg-primary" :style="{border:printingBorder}">訂 單 編 號</td>
                    <td
                        style="font-size:150%;white-space:nowrap;"
                        :style="{border:printingBorder}">
                        {{activePO.pONumber}}
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">業 務 聯 絡 人</td>
                    <td class="text-left"
                        style="font-size:150%;padding-left:20px;right-padding:0px;"
                        :style="{border:printingBorder}">
                        <span>{{activePO.supplier.CNT_MAN1}}</span>
                        <span v-if="activePO.supplier.CNT_MAN2!==null">/</span>
                        <span v-if="activePO.supplier.CNT_MAN2!==null">{{activePO.supplier.CNT_MAN2}}</span>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">訂 貨 日 期</td>
                    <td :style="{border:printingBorder}"
                        style="font-size:150%;">
                        {{activePO.documentDate}}
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">聯 絡 電 話</td>
                    <td class="text-left"
                        style="font-size:150%;padding-left:20px;right-padding:0px;"
                        :style="{border:printingBorder}">
                        <span style="white-space:nowrap;">{{activePO.supplier.TEL1}}</span>
                        <span v-if="activePO.supplier.TEL2!==null">/</span>
                        <span style="white-space:nowrap;" v-if="activePO.supplier.TEL2!==null">{{activePO.supplier.TEL2}}</span>
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">訂 單 日 期</td>
                    <td :style="{border:printingBorder}">
                        <span style="font-size:150%;white-space:nowrap;">{{activePO.documentDate}}</span>
                        <span style="font-size:150%;white-space:nowrap;">(修訂版本: {{activePO.revisionNumber|revToString}})</span>
                    </td>
                </tr>
                <tr>
                    <td class="bg-primary" :style="{border:printingBorder}">傳 真 電 話</td>
                    <td class="text-left"
                        style="font-size:150%;padding-left:20px;right-padding:0px;"
                        :style="{border:printingBorder}">
                        {{activePO.supplier.FAX}}
                    </td>
                    <td class="bg-primary" :style="{border:printingBorder}">採 購 經 辦</td>
                    <td :style="{border:printingBorder}"
                        style="font-size:150%;white-space:nowrap;">
                        {{userInfo.NAME}} 分機: {{userInfo.compPhoneExt}}
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
    props: ['activePO', 'userInfo'],
    computed: {
        ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
        printingBorder: function ) {
            if (this.pOPrintMode) {
                return '2px solid black !important';
            } else {
                return null;
            }
        }
    },
    filters: {
        revToString: function revisionNumber) {
            return ('0' + revisionNumber).slice(-2);
        }
    }
};
</script>

<style></style>
