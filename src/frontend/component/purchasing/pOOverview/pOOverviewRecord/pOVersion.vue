<template lang="html">
    <td>
        <div style="white-space:nowrap;">{{pONumber}} 版本: {{revisionNumber}}</div>
        <button
            v-if="pendingIssueFlag"
            type="button"
            class="btn btn-danger btn-md"
            @click="$emit('updatePOEvent')">
            更新訂單
        </button>
        <span v-if="!pendingIssueFlag">(最新版本)</span>
        <div v-if="readyToClose">
            <button
                type="button"
                class="btn btn-danger btn-xs"
                @click="$emit('closePOEvent')">
                確認結案
            </button>
        </div>
    </td>
</template>

<script>
export default {
    name: 'pOVersion',
    props: [
        'pONumber',
        'readyToClose',
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
