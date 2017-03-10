<template>
    <td>
        <button
            v-if="matchingActivePO !== null"
            type="button" class="btn btn-danger btn-xs">
            必須更新訂單
        </button>
        <button
            v-else
            type="button" class="btn btn-primary btn-xs"
            @click="createNewPO()">
            開立訂單
        </button>
    </td>
</template>

<script>
    import moment from 'moment-timezone';
    import { mapActions, mapMutations, mapGetters } from 'vuex';

    export default {
        name: 'actionField',
        props: ['requestSummary'],
        computed: {
            ...mapGetters({ activePOList: 'activePOList' }),
            matchingActivePO: function() {
                let matchingActivePO = this.activePOList.filter((activePO) => {
                    return (
                        (activePO.CUS_NO === this.requestSummary.CUS_NO) &&
                        (activePO.workingYear === this.requestSummary.workingYear) &&
                        (activePO.workingMonth === this.requestSummary.workingMonth)
                    );
                });
                return (matchingActivePO[0] === undefined) ? null : matchingActivePO[0];
            }
        },
        methods: {
            ...mapActions({
                componentErrorHandler: 'componentErrorHandler',
                createPurchaseOrder: 'createPurchaseOrder',
                setWorkingTime: 'setWorkingTime'
            }),
            ...mapMutations({
                processingDataSwitch: 'processingDataSwitch',
                rebuildData: 'rebuildData',
                setWorkingSupplier: 'setWorkingSupplier'
            }),
            genStartingDate: function() {
                switch (this.requestSummary.contractType) {
                    case 'annual':
                        return moment.utc(new Date(this.requestSummary.workingYear, 0, 1)).format('YYYY-MM-DD');
                    case 'monthly':
                        return moment.utc(new Date(this.requestSummary.workingYear, this.requestSummary.workingMonth - 1, 1)).format('YYYY-MM-DD');
                    case 'oneTime':
                        return moment.utc(new Date()).format('YYYY-MM-DD');
                    default:
                        this.componentErrorHandler({
                            component: 'actionField',
                            method: 'startingDate',
                            situation: '建立訂單起始日期計算發生錯誤 - contractType 種類異常'
                        });
                }
            },
            genEndDate: function() {
                switch (this.requestSummary.contractType) {
                    case 'annual':
                        return moment.utc(new Date(this.requestSummary.workingYear, 11, 31)).format('YYYY-MM-DD');
                    case 'monthly':
                        return moment.utc(new Date(this.requestSummary.workingYear, this.requestSummary.workingMonth, 0)).format('YYYY-MM-DD');
                    case 'oneTime':
                        return moment.utc(new Date()).format('YYYY-MM-DD');
                    default:
                        this.componentErrorHandler({
                            component: 'actionField',
                            method: 'startingDate',
                            situation: '建立訂單失效日期計算發生錯誤 - contractType 種類異常'
                        });
                }
            },
            genPONumber: function() {
                let dateString = moment.utc(new Date()).format('YYYYMMDD');
                return `${this.requestSummary.CUS_NO}-${dateString}`;
            },
            createNewPO: function() {
                this.processingDataSwitch(true);
                this.createPurchaseOrder({
                        contractType: this.requestSummary.contractType,
                        CUS_NO: this.requestSummary.CUS_NO,
                        documentDate: moment.utc(new Date()).format('YYYY-MM-DD'),
                        endDate: this.genEndDate(),
                        pONumber: this.genPONumber(),
                        startingDate: this.genStartingDate(),
                        workingMonth: this.requestSummary.workingMonth,
                        workingYear: this.requestSummary.workingYear
                    }).then((resultset) => {
                        console.log(resultset.data);
                        this.rebuildData(resultset.data);
                        this.processingDataSwitch(false);
                    }).catch((error) => {
                        this.componentErrorHandler({
                            component: 'actionField',
                            method: 'createNewPO',
                            situation: '建立訂單作業發生錯誤',
                            systemErrorMessage: error
                        });
                    });
            }
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
