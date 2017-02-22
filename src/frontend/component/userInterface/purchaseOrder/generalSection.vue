<template>
    <div class="container-fluid">
        <div v-if="supplier" class="row table-responsive">
            <table class="table table-bordered table-condensed">
                <tbody>
                    <tr>
                        <td>廠商名稱</td>
                        <td>{{supplier.NAME}}</td>
                        <td>訂單編號</td>
                        <td>{{pONumber}}</td>
                    </tr>
                    <tr>
                        <td>業務聯絡人</td>
                        <td>
                            <span>{{supplier.CNT_MAN1}}</span>
                            <span v-if="supplier.CNT_MAN2!==null">/</span>
                            <span v-if="supplier.CNT_MAN2!==null">{{supplier.CNT_MAN2}}</span>
                        </td>
                        <td>訂貨日期</td>
                        <td>{{pODate}}</td>
                    </tr>
                    <tr>
                        <td>聯絡電話</td>
                        <td>
                            <span>{{supplier.TEL1}}</span>
                            <span v-if="supplier.TEL2!==null">/</span>
                            <span v-if="supplier.TEL2!==null">{{supplier.TEL2}}</span>
                        </td>
                        <td>訂單日期</td>
                        <td>
                            {{pODate}} (修訂版本: {{revisionNumber|revToString}})
                        </td>
                    </tr>
                    <tr>
                        <td>傳真電話</td>
                        <td>{{supplier.FAX}}</td>
                        <td>採購經辦</td>
                        <td>{{userInfo.NAME}} 分機:166</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'generalSection',
        props: [
            'supplier',
            'userInfo',
            'pONumber',
            'pODate',
            'revisionNumber'
        ],
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
