<template lang="html">
    <td>
        <span v-if="revocationPending || pOClosed">{{note}}</span>
        <input v-else type="text" class="form-control input-sm" style="border:0px;" :disabled="dataProcessingState ? true : false" v-model.lazy.trim="noteValue" />
    </td>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'noteCell',
    props: [
        'revocationPending',
        'pOClosed',
        'id',
        'workingDate',
        'supplierWeight',
        'actualWeight',
        'note'
    ],
    computed: {
        ...mapGetters({ dataProcessingState: 'checkDataProcessingState' })
    },
    data: function () {
        return {
            noteValue: this.note
        };
    },
    watch: {
        noteValue: function (newNoteText) {
            if (newNoteText === '') {
                this.noteValue = null;
            }
            this.updateNote();
        }
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            updateShipment: 'updateShipment'
        }),
        ...mapMutations({
            processingDataSwitch: 'processingDataSwitch',
            rebuildData: 'rebuildData'
        }),
        updateNote: function () {
            this.processingDataSwitch(true);
            this.updateShipment({
                id: this.id,
                workingDate: this.workingDate,
                supplierWeight: this.supplierWeight,
                actualWeight: this.actualWeight,
                note: this.noteValue
            }).then((resultset) => {
                this.rebuildData(resultset.data);
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'noteCell',
                    method: 'updateNote',
                    situation: '更新進貨資料備註欄位錯誤',
                    systemErrorMessage: error
                });
            });
        }
    }
};

</script>

<style></style>
