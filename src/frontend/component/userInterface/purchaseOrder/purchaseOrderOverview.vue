<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>
                <working-time-selector></working-time-selector>
                &nbsp;採購訂單狀況
            </h4>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered tabel-hover table-striped table-condensed">
                <thead>
                    <tr>
                        <th class="text-center">廠商</th>
                        <th class="text-center">項目</th>
                        <th class="text-center">規格</th>
                        <th class="text-center">訂單編號</th>
                        <th class="text-center">最新訂單時間點</th>
                        <th class="text-center">新變更時間點</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="supplier in workingSupplier">
                        <td style="white-space:nowrap;">{{supplier.CUS_SNM}}</td>
                        <td style="white-space:nowrap;">{{supplier.PRDT_SNM}}</td>
                        <supplying-spec-list :CUS_NO="supplier.CUS_NO"></supplying-spec-list>
                        <td>
                            <span style="white-space:nowrap;">PO10502190001</span>
                            <button
                                class="btn btn-xs btn-primary"
                                @click="generateNewPO(supplier.CUS_NO)">
                                開立訂單
                            </button>
                        </td>
                        <td>
                            <span style="white-space:nowrap;">2017-02-07 08:00</span>
                            <span style="white-space:nowrap;">
                                <span class="glyphicon glyphicon-question-sign">待確認</span>
                                <span class="glyphicon glyphicon-ok-sign">已確認</span>
                            </span>
                        </td>
                        <td>
                            <span style="white-space:nowrap;">2017-02-08 19:30</span>&nbsp;
                            <button class="btn btn-xs btn-danger">修改訂單</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import workingTimeSelector from '../workingTimeSelector.vue';

    const supplyingSpecList = {
        name: 'supplyingSpecList',
        props: ['CUS_NO'],
        computed: {
            ...mapGetters({ supplyingSpecList: 'getSupplyingSpecList' }),
            releventList: function() {
                return this.supplyingSpecList.filter((supplyingSpec) => {
                    return supplyingSpec.CUS_NO === this.CUS_NO;
                });
            }
        },
        template: `
            <td class="text-left" style="white-space:nowrap;">
                <div
                    v-for="(supplyingSpec,index) in releventList"
                    style="padding-left:10px;">
                    {{supplyingSpec.specification}}
                </div>
            </td>`
    };

    export default {
        name: 'purchaseOrderOverview',
        components: {
            workingTimeSelector,
            supplyingSpecList
        },
        computed: {
            ...mapGetters({
                workingSupplier: 'getWorkingSupplier'
            })
        },
        methods: {
            ...mapMutations({
                forceViewChange: 'forceViewChange',
                switchPOWorkingSupplier: 'switchPOWorkingSupplier'
            }),
            generateNewPO: function(CUS_NO) {
                this.switchPOWorkingSupplier(CUS_NO);
                this.forceViewChange('pOTemplate');
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
