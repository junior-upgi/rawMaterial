<template>
    <div
        class="text-center"
        :class="{'col-xs-12 col-sm-10':!pOPrintMode}">
        <h2 v-if="!pOPrintMode">訂單檢視模組</h2>
        <br>
        <div class="panel-group" id="shipmentSchedule" role="tablist">
            <div class="panel panel-primary">
                <div
                    v-if="!pOPrintMode"
                    class="panel-header">
                    <select
                        class="form-control"
                        v-model="selectedIndex">
                        <option v-for="(activePO,index) in activePOList" :value="index">
                            【{{activePO.supplier.SNM}}】 訂單編號：{{activePO.pONumber}} - {{activePO.revisionNumber}}
                            訂單類別：{{activePO.contractType}} 起訖時間：{{activePO.startingDate}} - {{activePO.endDate}}
                        </option>
                    </select>
                </div>
                <div class="panel-body">
                    <pORenderViewPort
                        :activePO="activePOList[selectedIndex]">
                    </pORenderViewPort>
                </div>
                <button
                    v-if="!pOPrintMode"
                    @click="printPO()">
                    訂單列印
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import pORenderViewPort from './pORenderViewPort/pORenderViewPort.vue';

    export default {
        name: 'pOView',
        components: {
            pORenderViewPort
        },
        computed: {
            ...mapGetters({
                activePOList: 'activePOList',
                pOPrintMode: 'checkPOPrintMode'
            })
        },
        data: function() { return { selectedIndex: 0 }; },
        created: function() { this.selectedIndex = 0; },
        methods: {
            ...mapMutations({ pOPrintModeSwitch: 'pOPrintModeSwitch' }),
            printPO: function() {
                this.pOPrintModeSwitch(true);
                /*
                setTimeout(() => {
                    if (confirm('請確認是否儲存訂單資料並產生正式訂單?')) {
                        this.savePOData()
                            .then(() => {
                                print();
                                setTimeout(() => {
                                    this.pOPrintModeSwitch(true);
                                    this.refreshPOShipmentListing();
                                    this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                                    this.forceViewChange('pOTemplate');
                                }, 500);
                            }).catch((error) => {
                                console.log(`訂單儲存發生錯誤: ${error}`);
                                this.pOPrintModeSwitch(true);
                                this.refreshPOShipmentListing();
                                this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                                this.forceViewChange('pOTemplate');
                            });
                    } else {
                        this.pOPrintModeSwitch(false);
                        this.refreshPOShipmentListing();
                        this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                        this.forceViewChange('pOTemplate');
                    }
                }, 500);
                */
            }
        }
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
