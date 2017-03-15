<template>
    <div class="container-fluid text-center">
        <documentHeading :documentTitle="documentTitle"></documentHeading>
        <generalSection
            :supplier="activePO.supplier"
            :userInfo="userInfo"
            :pONumber="activePO.pONumber"
            :documentDate="activePO.documentDate"
            :revisionNumber="activePO.revisionNumber">
        </generalSection>
        <div class="row table-responsive" style="font-size:75%;">
            <table class="table table-bordered table-condensed">
                <thead>
                    <tr class="bg-primary">
                        <th v-for="thItem in thList"
                            class="text-center" :style="{border:printingBorder}">
                            <h4 style="margin-top:0px;margin-bottom:0px;">{{thItem}}</h4>
                        </th>
                    </tr>
                </thead>
                <summarySection :activePO="activePO"></summarySection>
                <shippingDateDisplay :activePO="activePO"></shippingDateDisplay>
                <reminderDisplay :pONoticeList="activePO.pONotices"></reminderDisplay>
                <tbody>
                    <tr>
                        <td colspan="5" :style="{border:printingBorder}">
                            <h4>
                                <div class="text-left" style="margin:0px;padding-left:10px;">
                                    <span><strong>備 註：</strong></span>
                                    <ol style="margin-top:5px;">
                                        <li>請於送貨單上註明訂單編號</li>
                                        <li>請回覆訂單以確定交貨期</li>
                                        <li>付款方式：月結3個月電匯</li>
                                        <li>統一編號：{{UNI_NO}}</li>
                                        <li>送貨地點：{{CMP_ADR}}</li>
                                    </ol>
                                </div>
                            </h4>
                        </td>
                        <td colspan="2" :style="{border:printingBorder}">
                            <div class="container-fluid">
                                <h4>
                                    <div class="row" style="padding-bottom:10px;">
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
                                    <div class="row" style="padding-bottom:10px;">
                                        <div class="col-xs-4 text-left">
                                            <h5>
                                                <strong>稅 金 {{taxRate * 100}}%</strong>
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
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters } from 'vuex';
    import documentHeading from './documentHeading.vue';
    import generalSection from './generalSection.vue';
    import summarySection from './summarySection.vue';
    import shippingDateDisplay from './shippingDateDisplay.vue';
    import reminderDisplay from './reminderDisplay.vue';

    export default {
        name: 'pORenderViewPort',
        components: {
            documentHeading,
            generalSection,
            summarySection,
            shippingDateDisplay,
            reminderDisplay
            /* ,
            detailListing,
            summaryEntry
            shipmentEntry supplierSelector,
            */
        },
        props: ['activePO'],
        computed: {
            ...mapGetters({
                pOPrintMode: 'checkPOPrintMode',
                userInfo: 'userData'
            }),
            pOSummaryGross: function() {
                return Math.round(this.pOSummaryNet + this.pOSummaryTax);
            },
            pOSummaryNet: function() {
                if(this.activePO.customNet === null) {
                    let amount = 0;
                    this.activePO.shipments.forEach((shipment) => {
                        amount += shipment.unitPrice * shipment.requestWeight;
                    });
                    return amount;
                } else {
                    return this.activePO.customNet;
                }
            },
            pOSummaryTax: function() {
                if(this.activePO.customTax === null) {
                    let amount = 0;
                    this.activePO.shipments.forEach((shipment) => {
                        amount += shipment.unitPrice * shipment.requestWeight * this.taxRate;
                    });
                    return amount;
                } else {
                    return this.activePO.customTax;
                }
            },
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
            }
        },
        data: function() {
            return {
                CMP_ADR: '台南市新營區新工路36號',
                documentTitle: '訂 購 單',
                UNI_NO: '70752833',
                isoCode: 'R7-03-02A',
                revisionNumber: 1,
                taxRate: 0.05,
                thList: ['項 次', '品 名', '規 格', '數 量', '單 位', '單 價', '合 計']
            };
        },
        filters: {
            formatCurrency: function(amount) {
                return '$' + numeral(amount).format('0,0.00');
            }
        }
        /*
        computed: {
            ...mapGetters({
                pOShipmentList: 'getPOShipmentList',
                pOShipmentSummary: 'getPOShipmentSummary',
                pOWorkingSupplier: 'getPOWorkingSupplier',
                checkPOViewMode: 'checkPOViewMode',
                shipmentOverview: 'getShipmentOverview',
                supplierList: 'getSupplierList',
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
        }
        */
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
