<template lang="html">
    <select class="form-control" v-model="selectedIndex" :disabled="dataProcessingState?true:false" @change="rawMaterialSelected()">
        <option v-for="(rawMaterial,index) in rawMaterialList" :value="index">
            【{{rawMaterial.CUST_SNM}}】{{rawMaterial.PRDT_SNM}} - {{rawMaterial.specification}}
        </option>
    </select>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'workingMaterialSelector',
    computed: {
        ...mapGetters({
            dataProcessingState: 'checkDataProcessingState',
            rawMaterialList: 'rawMaterialList',
            selectedRawMatIndex: 'selectedRawMatIndex'
        })
    },
    data: function () { return { selectedIndex: 0 }; },
    methods: {
        ...mapMutations({
            selectRawMaterial: 'selectRawMaterial'
        }),
        rawMaterialSelected: function () {
            this.selectRawMaterial(this.selectedIndex);
            this.$emit('workingMaterialChange');
        }
    },
    watch: {
        selectedRawMatIndex: function (newValue) {
            this.selectedIndex = newValue;
        }
    },
    created: function () {
        this.selectedIndex = 0;
        this.selectRawMaterial(this.selectedIndex);
    }
};

</script>

<style></style>
