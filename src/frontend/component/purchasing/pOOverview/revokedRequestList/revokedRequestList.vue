<template lang="html">
    <tbody style="font-size:75%;">
        <tr>
            <td colspan="6" class="bg-primary">
                <h4 style="margin:10px;padding:0px;">待取消項目列表</h4>
            </td>
        </tr>
        <tr v-for="revokedShipment in revokedPendingShipmentSchedule">
            <td>
                <span
                    class="label label-danger">
                    {{revokedShipment.purchaseOrder.pONumber}} 版本: {{revokedShipment.purchaseOrder.revisionNumber}}
                </span>
            </td>
            <td>{{revokedShipment.purchaseOrder.workingYear}}</td>
            <td>{{revokedShipment.purchaseOrder.workingMonth}}</td>
            <td>{{revokedShipment.CUST_SNM}}</td>
            <td class="text-left">
                {{revokedShipment.PRDT_SNM}}【{{revokedShipment.specification}}】
                - 1 車 {{revokedShipment.requestWeight|tonnage}}
                ({{revokedShipment.requestDate}})
            </td>
            <td class="text-left">已下單，待取消</td>
        </tr>
    </tbody>
</template>

<script>
import numeral from 'numeral';
export default {
    name: 'revokedRequestList',
    props: ['revokedPendingShipmentSchedule'],
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
