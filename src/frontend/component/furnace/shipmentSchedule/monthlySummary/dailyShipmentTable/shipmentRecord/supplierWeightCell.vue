<template lang="html">
    <td>
        <input
            v-if="!revocationPending && !isFutureDate && !pOClosed && !pOPending"
            type="number" pattern="[0-9.]+"
            class="form-control input-sm text-center valueInput"
            style="border:0px;"
            min="1000" max="99999" step="1"
            :disabled="dataProcessingState ? true : false"
            v-model.lazy.number="supplierWeightValue" />
        <template v-else>
            <span v-if="supplierWeight===null"></span>
            <del v-else-if="revocationPending">{{supplierWeight|tonnage}}</del>
            <span v-else>{{supplierWeight|tonnage}}</span>
        </template>
    </td>
</template>

<script>
import numeral from 'numeral';
import { mapGetters } from 'vuex';

export default {
    name: 'supplierWeightCell',
    props: [
        'isFutureDate',
        'pOClosed',
        'pOPending',
        'revocationPending',
        'supplierWeight'
    ],
    computed: {
        ...mapGetters({
            activeShipmentEditorDate: 'activeShipmentEditorDate',
            dataProcessingState: 'checkDataProcessingState'
        })
    },
    data: function () {
        return {
            supplierWeightValue: this.supplierWeight
        };
    },
    watch: {
        activeShipmentEditorDate: function () {
            this.supplierWeightValue = this.supplierWeight;
        },
        supplierWeightValue: function (newValue) {
            if (
                (newValue === '') ||
                (newValue <= 1000) ||
                (newValue > 99999)
            ) {
                this.supplierWeightValue = null;
            }
            this.$emit('supplierWeightFieldUpdateEvent', this.supplierWeightValue);
        }
    },
    filters: {
        tonnage: function (value) {
            return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
        }
    }
};

</script>

<style>
input.valueInput::-webkit-inner-spin-button,
input.valueInput::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
