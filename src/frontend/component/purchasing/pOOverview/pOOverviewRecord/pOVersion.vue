<template lang="html">
    <td>
        <div style="white-space:nowrap;">{{pONumber}} 版本: {{revisionNumber}}</div>
        <button v-if="pendingIssueFlag" type="button" class="btn btn-danger btn-md" @click="$emit('updatePOEvent')">
            更新訂單
        </button>
        <span v-if="!pendingIssueFlag">(最新版本)</span>
    </td>
</template>

<script>
export default {
    name: 'pOVersion',
    props: [
        'pONumber',
        'revisionNumber',
        'revokedPendingShipmentSchedule',
        'unattendedShipmentSchedule'
    ],
    computed: {
        pendingIssueFlag: function() {
            return ((this.revokedPendingShipmentSchedule.length > 0) || (this.unattendedShipmentSchedule.length > 0)) ? true : false;
        }
    }
};
</script>

<style></style>
