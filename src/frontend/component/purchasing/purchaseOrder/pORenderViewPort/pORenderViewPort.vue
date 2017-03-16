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
                <tbody><tr><td colspan="7" style="padding:5px;"></td></tr></tbody>
                <shippingDateDisplay :activePO="activePO"></shippingDateDisplay>
                <reminderDisplay
                    :pONoticeList="activePO.pONotices"
                    :customMessage="customMessage"
                    @customMessageChangeEvent="$emit('customMessageChangeEvent', $event)">
                </reminderDisplay>
                <tbody>
                    <tr>
                        <paymentTerms :UNI_NO="UNI_NO" :CMP_ADR="CMP_ADR"></paymentTerms>
                        <amountSummary :activePO="activePO"></amountSummary>
                    </tr>
                </tbody>
                <tbody :style="{border:printingBorder}">
                    <tr>
                        <td colspan="7" class="text-left">
                            <h3 style="margin:20px;">回 覆 確 認</h3>
                        </td>
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
    import shippingDateDisplay from './shippingDateDisplay/shippingDateDisplay.vue';
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
        },
        props: ['activePO', 'customMessage'],
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
                isoCode: 'R7-03-02A'
            };
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
