<template>
    <div class="col-md-offset-3 col-md-6 col-xs-12">
        <select class="form-control" v-model="selectedIndex" @change="selectRawMaterial(selectedIndex)">
            <option v-for="(rawMat,index) in rawMatList" :value="index">{{rawMat.PRDT_SNM}} - {{rawMat.specification}}【{{rawMat.CUS_SNM}}】</option>
        </select>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import store from '../../store/store.js';
    export default {
        name: 'rawMaterialSelector',
        store: store,
        computed: {
            ...mapGetters({ rawMatList: 'getRawMatList' })
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
        mounted: function() {
            this.selectRawMaterial(this.selectedIndex);
        }
    };

</script>
