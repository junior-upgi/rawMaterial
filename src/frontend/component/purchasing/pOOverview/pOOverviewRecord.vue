<template>
    <tr>
        <td>
            <span style="white-space:nowrap;">{{purchaseOrder.pONumber}} 版本: {{purchaseOrder.revisionNumber}}</span>
            <span v-if="matterPending" class="label label-danger">(需要更新)</span>
            <span v-if="!matterPending" class="label label-danger">(最新版本)</span>
        </td>
        <td>{{purchaseOrder.workingYear}}</td>
        <td>{{purchaseOrder.workingMonth}}</td>
        <td>{{purchaseOrder.supplier.SNM}}</td>
        <td>
            <ul class="list-group" style="margin:0px;">
                <li v-for="(summaryItem,index) in pOContentSummary"
                    class="list-group-item text-left"
                    style="border:0px;margin:0px;padding:0px 5px 0px 5px;">
                    <div style="white-space:nowrap;">{{index+1}}. {{summaryItem.PRDT_SNM}}【{{summaryItem.specification}}】</div>
                    <div style="white-space:nowrap;">&nbsp;&nbsp;&nbsp;&nbsp;入廠車次： {{summaryItem.requestShipmentCount-summaryItem.pendingShipmentCount}} / {{summaryItem.requestShipmentCount}}</div>
                    <div style="white-space:nowrap;">&nbsp;&nbsp;&nbsp;&nbsp;進貨重量： {{summaryItem.totalReceivedWeight|tonnage}} / {{summaryItem.totalRequestedWeight|tonnage}}</div>
                </li>
            </ul>
        </td>
        <td>
            <orderStatus
                :revokePendingShipmentSchedule="filterRevokePendingSchedule(purchaseOrder.workingYear,purchaseOrder.workingMonth)"
                :unattendedShipmentSchedule="filterUnattendedSchedule(purchaseOrder.workingYear,purchaseOrder.workingMonth)"
                @pendingMatterExist="matterPending=true">
            </orderStatus>
        </td>
    </tr>
</template>

<script>
    import moment from 'moment-timezone';
    import numeral from 'numeral';
    import orderStatus from './orderStatus.vue';
    // import supplyingSpecList from './supplyingSpecList.vue';
    // import pODisplayCell from './pODisplayCell.vue';

    export default {
        name: 'pOOverviewRecord',
        components: {
            orderStatus
            // supplyingSpecList,
            // pODisplayCell
        },
        props: [
            'pOContentSummary',
            'purchaseOrder',
            'revokePendingShipmentSchedule',
            'unattendedShipmentSchedule'
        ],
        data: function() {
            return {
                matterPending: false
            };
        },
        methods: {
            filterRevokePendingSchedule: function(workingYear, workingMonth) {
                return this.revokePendingShipmentSchedule.filter((shipment) => {
                    return (
                        (workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                        (workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('M')))
                    );
                });
            },
            filterUnattendedSchedule: function(workingYear, workingMonth) {
                return this.unattendedShipmentSchedule.filter((shipment) => {
                    return (
                        (workingYear === parseInt(moment.utc(new Date(shipment.workingDate)).format('YYYY'))) &&
                        (workingMonth === parseInt(moment.utc(new Date(shipment.workingDate)).format('M')))
                    );
                });
            }
        },
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
