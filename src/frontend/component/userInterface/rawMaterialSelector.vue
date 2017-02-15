<template>
    <select class="form-control" v-model="selectedIndex" @change="selectRawMaterial(selectedIndex)">
        <option v-for="(rawMat,index) in rawMatList" :value="index">
            【{{rawMat.CUS_SNM}}】{{rawMat.PRDT_SNM}} - {{rawMat.specification}}
        </option>
    </select>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import store from '../../store/store.js';
    export default {
        name: 'rawMaterialSelector',
        store: store,
        computed: {
            ...mapGetters({
                rawMatList: 'getRawMatList',
                selectedRawMatIndex: 'getSelectedRawMatIndex'
            })
        },
        data: function() {
            return {
                selectedIndex: 0
            };
        },
        methods: {
            ...mapMutations({
                selectRawMaterial: 'selectRawMaterial'
            })
        },
        watch: {
            selectedRawMatIndex: function(newValue) {
                this.selectedIndex = newValue;
            }
        },
        mounted: function() {
            this.selectRawMaterial(this.selectedIndex);
        }
    };

</script>
