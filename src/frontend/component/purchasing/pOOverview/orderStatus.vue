<template>
    <ul class="list-group" style="margin:0px;">
        <li class="list-group-item text-left" style="border:0px;margin:0px;padding:0px 5px 0px 5px;">
            同期未下單項目<span class="badge">{{unattendedShipmentSchedule.length}}</span>
        </li>
        <li class="list-group-item text-left" style="border:0px;margin:0px;padding:0px 5px 0px 5px;">
            同期待取消項目<span class="badge">{{revokePendingShipmentSchedule.length}}</span>
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
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
