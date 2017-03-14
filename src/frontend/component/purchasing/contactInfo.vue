<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>聯絡人資料</h4>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover table-condensed">
                <thead>
                    <tr>
                        <th class="text-center" style="white-space:nowrap;">廠商</th>
                        <th class="text-center" style="white-space:nowrap;">聯絡人</th>
                        <th class="text-center" style="white-space:nowrap;">電話</th>
                        <th class="text-center" style="white-space:nowrap;">傳真</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="supplier in supplierList" style="font-size:75%;">
                        <td class="text-center" style="white-space:nowrap;">{{supplier.SNM}}</td>
                        <td class="text-center" style="white-space:nowrap;">
                            <div>{{supplier.CNT_MAN1}}</div>
                            <template v-if="supplier.CNT_MAN2!==null">
                                <div>{{supplier.CNT_MAN2}}</div>
                            </template>
                        </td>
                        <td class="text-center" style="white-space:nowrap;">
                            <div>{{supplier.TEL1}}</div>
                            <template v-if="supplier.TEL2!==null">
                                <div>{{supplier.TEL2}}</div>
                            </template>
                        </td>
                        <td class="text-center" style="white-space:nowrap;">{{supplier.FAX}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'contactInfo',
        computed: {
            ...mapGetters({ supplierList: 'supplierList' })
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
