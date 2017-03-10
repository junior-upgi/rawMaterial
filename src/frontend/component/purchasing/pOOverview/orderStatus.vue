<template>
    <ul class="list-group" style="margin:0px;">
        <li v-if="unattendedShipmentSchedule.length>0"
            class="list-group-item text-left"
            style="border:0px;margin:0px;padding:0px 5px 0px 5px;white-space:nowrap;">
            <span class="label label-danger">同期未下單項目: {{unattendedShipmentSchedule.length}}</span>
        </li>
        <li v-if="revokePendingShipmentSchedule.length>0"
            class="list-group-item text-left"
            style="border:0px;margin:0px;padding:0px 5px 0px 5px;white-space:nowrap;">
            <span class="label label-danger">同期待取消項目: {{revokePendingShipmentSchedule.length}}</span>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'orderStatus',
        props: [
            'revokePendingShipmentSchedule',
            'unattendedShipmentSchedule'
        ],
        computed: {
            pendingMatterExist: function() {
                if ((this.revokePendingShipmentSchedule.length !== 0) || (this.unattendedShipmentSchedule.length !== 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        mounted: function() {
            if (this.pendingMatterExist) {
                this.$emit('pendingMatterExist');
            }
        },
        updated: function() {
            if (this.pendingMatterExist) {
                this.$emit('pendingMatterExist');
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
