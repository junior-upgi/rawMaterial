<template>
    <div class="container text-center">
        <div class="row" v-if="checkPOPrintMode!==true">
            <supplier-selector @supplierSwitched="refreshPOListing"></supplier-selector>
        </div>
        <document-heading :documentTitle="documentTitle"></document-heading>
        <general-section
            :supplier="supplier"
            :userInfo="userInfo"
            :pONumber="pONumber"
            :pODate="pODate"
            :revisionNumber="revisionNumber">
        </general-section>
        <div class="container">
            <div v-if="supplier" class="row table-responsive">
                <table class="table table-bordered table-condensed">
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
                        <summary-entry
                            v-for="(summaryItem,index) in pOShipmentSummary"
                            :summaryItem="summaryItem"
                            :index="index">
                        </summary-entry>
                    </tbody>
                    <tbody>
                        <tr v-if="checkPOPrintMode!==true">
                            <td colspan="7">
                                <div class="list-group" style="height:300px;overflow-y:auto;">
                                    <shipment-entry
                                        v-for="(shipment,index) in pOShipmentList"
                                        :shipment="shipment"
                                        :index="index"
                                        @shipmentSelection="addToSummary($event)"
                                        @shipmentDeselection="removeFromSummary($event)">
                                    </shipment-entry>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <shipping-date-display></shipping-date-display>
                    <tbody>
                        <tr>
                            <td class="text-left" colspan="7">
                                <div style="margin:0px;padding-left:10px;">
                                    <h4>
                                        <div style="padding-top:5px;padding-bottom:5px;">訂單請蓋章回傳</div>
                                        <div style="padding-top:5px;padding-bottom:5px;">發票請附最後一車的檢驗成分表(COA)，謝謝！</div>
                                        <div style="padding-top:5px;padding-bottom:5px;">請勿使用老舊太空袋，避免我司高空作業造成危險狀況</div>
                                    </h4>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td colspan="5">
                                <h4>
                                    <div class="text-left" style="margin:0px;padding-left:10px;">
                                        <span>備註：</span>
                                        <ol style="margin-top:5px;">
                                            <li style="padding-top:5px;padding-bottom:5px;">請於送貨單上註明訂單編號</li>
                                            <li style="padding-top:5px;padding-bottom:5px;">請回覆訂單以確定交貨期</li>
                                            <li style="padding-top:5px;padding-bottom:5px;">付款方式：月結3個月電匯</li>
                                            <li style="padding-top:5px;padding-bottom:5px;">統一編號：{{UNI_NO}}</li>
                                            <li style="padding-top:5px;padding-bottom:5px;">送貨地點：{{CMP_ADR}}</li>
                                        </ol>
                                    </div>
                                </h4>
                            </td>
                            <td colspan="2">
                                <div class="container-fluid">
                                    <h4>
                                        <div class="row" style="padding-bottom:20px;">
                                            <div class="col-xs-7 text-left">金額</div>
                                            <div class="col-xs-5 text-right">{{pOSummaryNet|formatCurrency}}</div>
                                        </div>
                                        <div class="row" style="padding-bottom:20px;">
                                            <div class="col-xs-7 text-left">稅金 5%</div>
                                            <div class="col-xs-5 text-right">{{pOSummaryTax|formatCurrency}}</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-7 text-left">總計</div>
                                            <div class="col-xs-5 text-right">{{pOSummaryGross|formatCurrency}}</div>
                                        </div>
                                    </h4>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td colspan="2">
                                <div style="padding-top:40px;padding-bottom:40px;">
                                    <h3>回覆確認</h3>
                                </div>
                            </td>
                            <td colspan="5"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment-timezone';
    import numeral from 'numeral';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import supplierSelector from '../supplierSelector.vue';
    import documentHeading from '../documentHeading.vue';
    import generalSection from './generalSection.vue';
    import summaryEntry from './summaryEntry.vue';
    import shipmentEntry from './shipmentEntry.vue';
    import shippingDateDisplay from './shippingDateDisplay.vue';

    export default {
        name: 'pOTemplate',
        components: {
            supplierSelector,
            documentHeading,
            generalSection,
            summaryEntry,
            shipmentEntry,
            shippingDateDisplay
        },
        data: function() {
            return {
                CMP_ADR: '台南市新營區新工路36號',
                documentTitle: '訂購單',
                UNI_NO: '70752833',
                isoCode: 'R7-03-02A',
                revisionNumber: 1,
                taxRate: 0.05
            };
        },
        computed: {
            ...mapGetters({
                pOShipmentList: 'getPOShipmentList',
                pOShipmentSummary: 'getPOShipmentSummary',
                pOWorkingSupplier: 'getPOWorkingSupplier',
                checkPOPrintMode: 'checkPOPrintMode',
                checkPOViewMode: 'checkPOViewMode',
                shipmentOverview: 'getShipmentOverview',
                supplierList: 'getSupplierList',
                userInfo: 'getUserData',
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            }),
            pODate: function() {
                return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
            },
            pONumber: function() {
                let yearPartString = (new Date().getFullYear() - 1911).toString();
                let datePartString = moment(new Date(), 'YYYY-MM-DD HH:MM:ss').format('MMDD');
                return `${yearPartString}${datePartString}${('0' + this.revisionNumber).slice(-2)}`;
            },
            pOSummaryGross: function() {
                return this.pOSummaryNet + this.pOSummaryTax;
            },
            pOSummaryNet: function() {
                let amount = 0;
                this.pOShipmentSummary.forEach((summaryItem) => {
                    amount += summaryItem.unitPrice * summaryItem.workingWeight;
                });
                return amount;
            },
            pOSummaryTax: function() {
                let amount = 0;
                this.pOShipmentSummary.forEach((summaryItem) => {
                    amount += summaryItem.unitPrice * summaryItem.workingWeight * this.taxRate;
                });
                return amount;
            },
            supplier: function() {
                if (this.pOWorkingSupplier !== null) {
                    return this.supplierList.filter((supplier) => {
                        return supplier.CUS_NO === this.pOWorkingSupplier;
                    })[0];
                } else {
                    return null;
                }
            }
        },
        methods: {
            ...mapActions({ refreshPOListing: 'refreshPOListing' }),
            ...mapMutations({
                addToSummary: 'addToPOShipmentSummary',
                removeFromSummary: 'removeFromPOShipmentSummary',
                changePOMode: 'changePOMode',
                resetPOShipmentList: 'resetPOShipmentList',
                resetStore: 'resetStore'
            }),
            filterPOShipmentData: function(summaryItem) {
                let shipmentList = [];
                this.pOShipmentList.forEach((shipment) => {
                    if (
                        (shipment.CUS_NO === summaryItem.CUS_NO) &&
                        (shipment.PRD_NO === summaryItem.PRD_NO) &&
                        (shipment.typeId === summaryItem.typeId)
                    ) {
                        shipmentList.push(shipment);
                    }
                });
                return shipmentList;
            }
        },
        created: function() {
            this.changePOMode({
                pOViewMode: true,
                pOPrintMode: false
            });
        },
        destroyed: function() {
            this.resetPOShipmentList();
            this.shipmentSummary = [];
            this.changePOMode({
                pOViewMode: false,
                pOPrintMode: false
            });
        },
        filters: {
            formatCurrency: function(amount) {
                return '$' + numeral(amount).format('0,0.00');
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
