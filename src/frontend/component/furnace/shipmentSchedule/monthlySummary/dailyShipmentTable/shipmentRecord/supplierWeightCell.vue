<template>
    <input
        type="number"
        pattern="[0-9.]+"
        class="form-control input-sm text-center valueInput"
        style="border:0px;"
        min="1000"
        max="99999"
        step="1"
        :disabled="dataProcessingDstate ? true : false"
        v-model.lazy.number="supplierWeightValue"
        @change="supplierWeightUpdated()"  />
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'supplierWeightCell',
        props: [
            'recordState',
            'supplierWeight'
        ],
        computed: {
            ...mapGetters({
                activeShipmentEditorDate: 'activeShipmentEditorDate',
                dataProcessingState: 'checkDataProcessingState'
            })
        },
        data: function() {
            return {
                supplierWeightValue: this.supplierWeight
            };
        },
        watch: {
            activeShipmentEditorDate: function() {
                this.supplierWeightValue = this.supplierWeight;
            },
            supplierWeightValue: function(newValue) {
                if ((newValue === '') || (newValue <= 1000) || (newValue > 99999)) { this.supplierWeightValue = null; }
            }
        },
        methods: {
            supplierWeightUpdated: function() {
                this.$emit('supplierWeightUpdated', this.supplierWeightValue);
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    input.valueInput::-webkit-inner-spin-button,
    input.valueInput::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
