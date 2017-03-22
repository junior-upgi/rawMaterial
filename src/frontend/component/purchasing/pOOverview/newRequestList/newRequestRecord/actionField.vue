<template lang="html">
    <td>
        <span
            v-if="matchingActivePO !== null"
            class="label label-danger label-xs">
            新增項目 (請更新訂單)
        </span>
        <button v-else type="button" class="btn btn-primary btn-md" @click="createNewPO()">
            開立訂單
        </button>
    </td>
</template>

<script>
import moment from 'moment-timezone';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'actionField',
    props: [
        'requestList',
        'requestSummary'
    ],
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
            setWorkingTime: 'setWorkingTime',
            employeeChatBroadcast: 'employeeChatBroadcast'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData',
            setWorkingSupplier: 'setWorkingSupplier'
        }),
        genStartingDate: function() {
            switch (this.requestSummary.contractType) {
                case 'annual':
                    return moment(new Date(this.requestSummary.workingYear, 0, 1)).format('YYYY-MM-DD');
                case 'monthly':
                    return moment(new Date(this.requestSummary.workingYear, this.requestSummary.workingMonth - 1, 1)).format('YYYY-MM-DD');
                case 'oneTime':
                    return moment(new Date()).format('YYYY-MM-DD');
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
                    return moment(new Date(this.requestSummary.workingYear, 11, 31)).format('YYYY-MM-DD');
                case 'monthly':
                    return moment(new Date(this.requestSummary.workingYear, this.requestSummary.workingMonth, 0)).format('YYYY-MM-DD');
                case 'oneTime':
                    return moment(new Date()).format('YYYY-MM-DD');
                default:
                    this.componentErrorHandler({
                        component: 'actionField',
                        method: 'startingDate',
                        situation: '建立訂單失效日期計算發生錯誤 - contractType 種類異常'
                    });
            }
        },
        genPONumber: function() {
            let dateString = moment(new Date()).format('YYYYMMDD');
            return `${this.requestSummary.CUS_NO}-${dateString}`;
        },
        createNewPO: function() {
            this.processingDataSwitch(true);
            this.createPurchaseOrder({
                contractType: this.requestSummary.contractType,
                CUS_NO: this.requestSummary.CUS_NO,
                documentDate: moment(new Date()).format('YYYY-MM-DD'),
                endDate: this.genEndDate(),
                pONumber: this.genPONumber(),
                startingDate: this.genStartingDate(),
                workingMonth: this.requestSummary.workingMonth,
                workingYear: this.requestSummary.workingYear
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                let actionDescription = `【${this.requestSummary.CUST_SNM}】新建訂單`;
                return this.employeeChatBroadcast({ groupMessage: actionDescription });
            }).then((result) => {
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

<style></style>
