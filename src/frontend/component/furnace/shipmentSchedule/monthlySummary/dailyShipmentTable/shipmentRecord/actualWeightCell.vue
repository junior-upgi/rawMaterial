<template lang="html">
    <td>
        <input
            v-if="!revocationPending && !isFutureDate && !pOClosed && !pOPending"
            type="number" pattern="[0-9.]+"
            class="form-control input-sm text-center valueInput"
            style="border:0px;"
            min="1000" max="99999" step="1"
            :disabled="dataProcessingState ? true : false"
            v-model.lazy.number="actualWeightValue" />
        <template v-else>
            <span v-if="actualWeight===null"></span>
            <del v-else-if="revocationPending">{{actualWeight|tonnage}}</del>
            <span v-else>{{actualWeight|tonnage}}</span>
        </template>
    </td>
</template>

<script>
import numeral from 'numeral';
import { mapGetters } from 'vuex';

export default {
    name: 'actualWeightCell',
    props: [
        'actualWeight',
        'pOClosed',
        'pOPending',
        'isFutureDate',
        'revocationPending'
    ],
    computed: {
        ...mapGetters({
            activeShipmentEditorDate: 'activeShipmentEditorDate',
            dataProcessingState: 'checkDataProcessingState'
        })
    },
    data: function () {
        return {
            actualWeightValue: this.actualWeight
        };
    },
    watch: {
        activeShipmentEditorDate: function () {
            this.actualWeightValue = this.actualWeight;
        },
        actualWeightValue: function (newValue) {
            if (
                (newValue === '') ||
                (newValue <= 0) ||
                (newValue > 99999)
            ) {
                this.actualWeightValue = null;
            }
            this.$emit('actualWeightFieldUpdateEvent', this.actualWeightValue);
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
