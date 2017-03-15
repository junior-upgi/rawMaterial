<template>
    <div
        class="text-center"
        :class="{'container-fluid':!pOPrintMode, container:pOPrintMode}">
        <documentHeading :documentTitle="documentTitle"></documentHeading>
        <generalSection :activePO="activePO" :userInfo="userInfo"></generalSection>
        <div class="row table-responsive">
            <table class="table table-bordered table-condensed">
                <summarySectionHeader></summarySectionHeader>
                <summarySection :activePO="activePO"></summarySection>
                <shippingDateDisplay :activePO="activePO"></shippingDateDisplay>
                <reminderDisplay :pONoticeList="activePO.pONotices"></reminderDisplay>
                <tbody>
                    <tr>
                        <paymentTerms :UNI_NO="UNI_NO" :CMP_ADR="CMP_ADR"></paymentTerms>
                        <amountSummary :activePO="activePO" :taxRate="taxRate"></amountSummary>
                    </tr>
                </tbody>
                <tbody :style="{border:printingBorder}">
                    <tr>
                        <td colspan="7" class="text-left">回 覆 確 認</td>
                    </tr>
                    <tr>
                        <td colspan="7" class="text-right">({{isoCode}})</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import documentHeading from './documentHeading.vue';
    import generalSection from './generalSection.vue';
    import summarySectionHeader from './summarySectionHeader.vue';
    import summarySection from './summarySection.vue';
    import shippingDateDisplay from './shippingDateDisplay.vue';
    import reminderDisplay from './reminderDisplay.vue';
    import paymentTerms from './paymentTerms.vue';
    import amountSummary from './amountSummary.vue';

    export default {
        name: 'pORenderViewPort',
        components: {
            documentHeading,
            generalSection,
            summarySectionHeader,
            summarySection,
            shippingDateDisplay,
            reminderDisplay,
            paymentTerms,
            amountSummary
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
