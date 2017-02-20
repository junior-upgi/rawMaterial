<template>
    <div class="container text-center">
        <div class="row">
            <h1 style="margin-top:20px;">{{NAME}}</h1>
        </div>
        <div class="row">
            <h4 style="margin-top:0px;">{{CMP_ADR}} TEL:{{TEL1}} FAX:{{TEL3}}</h4>
        </div>
        <div class="row">
            <h2 style="margin-top:0px;">
                <span>訂</span>
                <span style="margin-left:30px;margin-right:30px;">購</span>
                <span>單</span>
            </h2>
        </div>
        <div class="row table-responsive">
            <table class="table table-bordered table-condensed">
                <tbody>
                    <tr>
                        <td>廠商名稱</td>
                        <td>東碱股份有限公司</td>
                        <td>訂單編號</td>
                        <td>106012501</td>
                    </tr>
                    <tr>
                        <td>業務聯絡人</td>
                        <td>歐先生/王小姐</td>
                        <td>訂貨日期</td>
                        <td>2017-01-25</td>
                    </tr>
                    <tr>
                        <td>聯絡電話</td>
                        <td>(02)2704-7272 分機:258/254</td>
                        <td>修改日期</td>
                        <td>2017-02-16 (修訂版本: XX)</td>
                    </tr>
                    <tr>
                        <td>傳真電話</td>
                        <td>(02)2709-9640</td>
                        <td>採購經辦</td>
                        <td>陳連虹貞 分機:166</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">項次</th>
                        <th class="text-center">品名</th>
                        <th class="text-center">規格</th>
                        <th class="text-center">數量</th>
                        <th class="text-center">單位</th>
                        <th class="text-center">單價</th>
                        <th class="text-center">合計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="index in 3">
                        <td>{{index}}</td>
                        <td>品項 {{index}}</td>
                        <td>規格敘述 {{index}}</td>
                        <td>120,000</td>
                        <td>公斤</td>
                        <td>$8.70</td>
                        <td>$1,044,000</td>
                    </tr>
                    <tr>
                        <td class="text-left" colspan="7">
                            <div style="margin:0px;padding:0px;">
                                <div contenteditable>
                                    <div>送貨日期: 2017-02-03 (週X)</div>
                                    <div>訂單請蓋章回傳</div>
                                    <div>發票請附最後一車的檢驗成分表(COA)，謝謝！</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <div style="margin:0px;padding:0px;">

                            </div>
                        </td>
                        <td colspan="2">
                            abc
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'pOTemplate',
        data: function() {
            return {
                NAME: '統 義 玻 璃 工 業 股 份 有 限 公 司',
                CMP_ADR: '台南市新營區新工路36號',
                TEL1: '06-6536281',
                TEL3: '06-6532530',
                UNI_NO: '70752833',
                isoCode: 'R7-03-02A',

                shippingDateHistory: `2017-02-02 測試測試測試
                    2017-02-03 測試測試測試`
            };
        },
        components: {
            ...mapGetters({
                checkPOPrintMode: 'pOPrintMode',
                checkPOViewMode: 'pOViewMode'
            })
        },
        methods: {
            ...mapMutations({
                changePOMode: 'changePOMode'
            })
        },
        beforeCreate: function() {
            $(function() {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        created: function() {
            this.changePOMode({
                pOViewMode: true,
                pOPrintMode: false
            });
        },
        destroyed: function() {
            this.changePOMode({
                pOViewMode: false,
                pOPrintMode: false
            });
        }
    };

</script>
