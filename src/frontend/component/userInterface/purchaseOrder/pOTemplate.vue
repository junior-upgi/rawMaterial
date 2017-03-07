<template>
    <div class="container text-center">
        <div class="row" v-if="pOPrintMode!==true">
            <supplier-selector @supplierSwitched="refreshPOShipmentListing"></supplier-selector>
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
                        <tr class="bg-primary">
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">項 次</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">品 名</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">規 格</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">數 量</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">單 位</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">單 價</h4></th>
                            <th class="text-center" :style="{border:printingBorder}"><h4 style="margin-top:0px;margin-bottom:0px;">合 計</h4></th>
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
                        <tr v-if="pOPrintMode!==true">
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
                    <reminder-display></reminder-display>
                    <tbody>
                        <tr>
                            <td colspan="5" :style="{border:printingBorder}">
                                <h4>
                                    <div class="text-left" style="margin:0px;padding-left:10px;">
                                        <span><strong>備 註：</strong></span>
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
                            <td colspan="2" :style="{border:printingBorder}">
                                <div class="container-fluid">
                                    <h4>
                                        <div class="row" style="padding-bottom:20px;">
                                            <div class="col-xs-4 text-left">
                                                <h5>
                                                    <strong>金 額</strong>
                                                </h5>
                                            </div>
                                            <div class="col-xs-8 text-right">
                                                <h4>
                                                    <strong>{{pOSummaryNet|formatCurrency}}</strong>
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="row" style="padding-bottom:20px;">
                                            <div class="col-xs-4 text-left">
                                                <h5>
                                                    <strong>稅 金 5%</strong>
                                                </h5>
                                            </div>
                                            <div class="col-xs-8 text-right">
                                                <h4>
                                                    <strong>{{pOSummaryTax|formatCurrency}}</strong>
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-4 text-left">
                                                <h5>
                                                    <strong>總 計</strong>
                                                </h5>
                                            </div>
                                            <div class="col-xs-8 text-right">
                                                <h4>
                                                    <strong>{{pOSummaryGross|formatCurrency}}</strong>
                                                </h4>
                                            </div>
                                        </div>
                                    </h4>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody :style="{border:printingBorder}">
                        <tr>
                            <td colspan="2">
                                <div style="padding-top:40px;padding-bottom:40px;">
                                    <h3><strong>回 覆 確 認</strong></h3>
                                </div>
                            </td>
                            <td colspan="5"></td>
                        </tr>
                        <tr>
                            <td colspan="7" class="text-right"
                                style="padding-right:5%;">({{isoCode}})</td>
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
    import reminderDisplay from './reminderDisplay.vue';
    import shippingDateDisplay from './shippingDateDisplay.vue';

    export default {
        name: 'pOTemplate',
        components: {
            supplierSelector,
            documentHeading,
            generalSection,
            summaryEntry,
            shipmentEntry,
            shippingDateDisplay,
            reminderDisplay
        },
        data: function() {
            return {
                CMP_ADR: '台南市新營區新工路36號',
                documentTitle: '訂 購 單',
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
                pOPrintMode: 'checkPOPrintMode',
                checkPOViewMode: 'checkPOViewMode',
                shipmentOverview: 'getShipmentOverview',
                supplierList: 'getSupplierList',
                userInfo: 'userData',
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            }),
            pODate: function() {
                return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
            },
            pONumber: function() {
                const yearPartString = (new Date().getFullYear() - 1911).toString();
                const datePartString = moment(new Date(), 'YYYY-MM-DD HH:MM:ss').format('MMDD');
                return `${yearPartString}${datePartString}${('0' + this.revisionNumber).slice(-2)}`;
            },
            pOSummaryGross: function() {
                return Math.round(this.pOSummaryNet + this.pOSummaryTax);
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
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
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
            ...mapActions({ refreshPOShipmentListing: 'refreshPOShipmentListing' }),
            ...mapMutations({
                addToSummary: 'addToPOShipmentSummary',
                removeFromSummary: 'removeFromPOShipmentSummary',
                changePOMode: 'changePOMode',
                resetPOShipmentList: 'resetPOShipmentList',
                resetStore: 'resetStore'
            }),
            filterPOShipmentData: function(summaryItem) {
                const shipmentList = [];
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
