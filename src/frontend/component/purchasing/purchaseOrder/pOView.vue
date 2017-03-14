<template>
    <div class="text-center col-xs-12 col-sm-10">
        <h2>訂單檢視模組</h2>
        <br>
        <div class="panel-group" id="shipmentSchedule" role="tablist">
            <div class="panel panel-primary">
                <div class="panel-body">
                    <select
                        class="form-control"
                        v-model="selectedIndex">
                        <option v-for="(activePO,index) in activePOList" :value="index">
                            【{{activePO.supplier.SNM}}】 訂單編號：{{activePO.pONumber}} - {{activePO.revisionNumber}}
                            訂單類別：{{activePO.contractType}} 起訖時間：{{activePO.startingDate}} - {{activePO.endDate}}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'pOView',
        computed: {
            ...mapGetters({ activePOList: 'activePOList' })
        },
        data: function() { return { selectedIndex: 0 }; },
        created: function() { this.selectedIndex = 0; }
        /*
        methods: {
            ...mapMutations({
                selectRawMaterial: 'selectRawMaterial'
            }),
            rawMaterialSelected: function() {
                this.selectRawMaterial(this.selectedIndex);
                this.$emit('workingMaterialChange');
            }
        },
        watch: {
            selectedRawMatIndex: function(newValue) {
                this.selectedIndex = newValue;
            }
        },
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
