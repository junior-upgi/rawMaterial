<template lang="html">
    <td>
        <span v-if="pOClosed">{{workingDateString}}</span>
        <del v-else-if="revocationPending">{{workingDateString}}</del>
        <input v-else type="date" class="form-control input-sm" style="border:0px;" v-model.lazy="workingDateValue" :disabled="dataProcessingState ? true : false" />
    </td>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'workingDateCell',
    props: [
        'pOClosed',
        'revocationPending',
        'workingDateString'
    ],
    computed: {
        ...mapGetters({
            activeShipmentEditorDate: 'activeShipmentEditorDate',
            dataProcessingState: 'checkDataProcessingState'
        })
    },
    data: function() {
        return {
            workingDateValue: this.workingDateString
        };
    },
    watch: {
        activeShipmentEditorDate: function() {
            this.workingDateValue = this.workingDateString;
        },
        workingDateValue: function(newDateValue) {
            let today = new Date();
            let referenceDate = new Date(newDateValue);
            today.setHours(0, 0, 0, 0);
            referenceDate.setHours(0, 0, 0, 0);
            if ((referenceDate > today) || (newDateValue === '')) {
                this.workingDateValue = this.workingDateString;
            } else {
                this.$emit('workingDateFieldUpdateEvent', this.workingDateValue);
            }
        }
    }
};

</script>

<style></style>
