<template lang="html">
    <td>
        <ul class="list-group" style="margin:0px;">
            <li v-if="unattendedShipmentSchedule.length>0" class="list-group-item text-left" style="border:0px;margin:0px;padding:0px 5px 0px 5px;white-space:nowrap;">
                <span class="bg-danger">同期未下單項目: {{unattendedShipmentSchedule.length}}</span>
            </li>
            <li v-if="revokedPendingShipmentSchedule.length>0" class="list-group-item text-left" style="border:0px;margin:0px;padding:0px 5px 0px 5px;white-space:nowrap;">
                <span class="bg-danger">同期待取消項目: {{revokedPendingShipmentSchedule.length}}</span>
            </li>
        </ul>
    </td>
</template>

<script>
export default {
    name: 'orderStatus',
    props: [
        'revokedPendingShipmentSchedule',
        'unattendedShipmentSchedule'
    ]
};

</script>

<style></style>
