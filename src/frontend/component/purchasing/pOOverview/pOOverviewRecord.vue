<template>
    <tr>
        <td>
            {{purchaseOrder.pONumber}} 版本: {{purchaseOrder.revisionNumber}}
            <span v-if="matterPending" class="label label-danger">(需要更新)</span>
        </td>
        <td>{{purchaseOrder.workingYear}}</td>
        <td>{{purchaseOrder.workingMonth}}</td>
        <td>{{purchaseOrder.supplier.SNM}}</td>
        <td></td>
        <td>
            <orderStatus
                :revokePendingShipmentSchedule="filterRevokePendingSchedule(purchaseOrder.workingYear,purchaseOrder.workingMonth)"
                :unattendedShipmentSchedule="filterUnattendedSchedule(purchaseOrder.workingYear,purchaseOrder.workingMonth)"
                @pendingMatterExist="matterPending=true">
            </orderStatus>
        </td>
        <!--
        <pODisplayCell :pOList="pOList" :CUS_NO="material.CUS_NO"></pODisplayCell>
        <td style="white-space:nowrap;">{{material.CUS_SNM}}</td>
        <td style="white-space:nowrap;">{{material.PRDT_SNM}}</td>
        <supplyingSpecList :CUS_NO="material.CUS_NO"></supplyingSpecList>
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
        -->
    </tr>
</template>

<script>
    import moment from 'moment-timezone';
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
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
