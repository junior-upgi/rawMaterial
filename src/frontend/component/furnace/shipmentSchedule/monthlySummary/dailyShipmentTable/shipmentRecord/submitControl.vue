<template lang="html">
    <td style="white-space:nowrap;">
        <button v-if="(!pristine && workingDateReady && weightDataReady)" type="button" class="btn btn-primary btn-sm" :disabled="dataProcessingState?true:false" @click="$emit('submitRecordEvent')">
            <span class="glyphicon glyphicon-ok-sign"></span> 修改
        </button>
        <button v-if="!pristine" type="button" class="btn btn-danger btn-sm" :disabled="dataProcessingState ? true : false" @click="restoreRecordData()">
            <span class="glyphicon glyphicon-remove-sign"></span> 取消
        </button>
    </td>
</template>

<script>
import moment from 'moment-timezone';
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'submitControl',
    props: [
        'fulfilled',
        'pristine',
        'weightDataReady',
        'workingDateReady'
    ],
    computed: {
        ...mapGetters({
            activeShipmentEditorDate: 'activeShipmentEditorDate',
            dataProcessingState: 'checkDataProcessingState'
        })
    },
    methods: {
        ...mapMutations({
            clearActiveShipmentEditorDate: 'clearActiveShipmentEditorDate',
            changeActiveShipmentEditorDate: 'changeActiveShipmentEditorDate'
        }),
        restoreRecordData: function ) {
            let tempDate = moment(new Date(this.activeShipmentEditorDate)).add(1, 'day').format('YYYY-MM-DD');
            let currentActiveShipmentEditorDate = this.activeShipmentEditorDate;
            this.changeActiveShipmentEditorDate(tempDate);
            setTimeout(() => {
                this.changeActiveShipmentEditorDate(currentActiveShipmentEditorDate);
            }, 1);
        }
    }
};

</script>

<style></style>
