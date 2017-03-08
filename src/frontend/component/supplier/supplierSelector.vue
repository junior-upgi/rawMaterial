<template>
    <form class="form-inline">
        <div class="form-group">
            <label for="supplierSelector">選擇廠商</label>
            &nbsp;
            <select
                id="supplierSelector"
                class="form-control"
                v-model="selectedClient"
                @change.self="switchSupplier">
                <option
                    v-for="supplierObject in uniqueSupplierObjList"
                    :value="supplierObject.CUS_NO">
                    {{supplierObject.CUS_SNM}} 【{{supplierObject.CUS_NO}}】
                </option>
            </select>
        </div>
    </form>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'supplierSelector',
        computed: {
            ...mapGetters({
                pOWorkingSupplier: 'getPOWorkingSupplier',
                workingMaterial: 'getWorkingMaterial'
            }),
            uniqueSupplierObjList: function() {
                const uniqueList = [];
                const lookup = {};
                for (const index in this.workingMaterial) {
                    lookup[this.workingMaterial[index]['CUS_NO']] = this.workingMaterial[index];
                }
                for (const index in lookup) {
                    uniqueList.push(lookup[index]);
                }
                uniqueList.forEach((uniqueSupplierObject) => {
                    delete uniqueSupplierObject.PRDT_SNM;
                    delete uniqueSupplierObject.PRD_NO;
                });
                return uniqueList;
            }
        },
        data: function() {
            return {
                selectedClient: null
            };
        },
        methods: {
            ...mapMutations({ switchPOWorkingSupplier: 'switchPOWorkingSupplier' }),
            switchSupplier: function() {
                this.switchPOWorkingSupplier(this.selectedClient);
                this.$emit('supplierSwitched', this.selectedClient);
            }
        },
        mounted: function() {
            if (this.pOWorkingSupplier !== null) {
                this.selectedClient = this.pOWorkingSupplier;
            }
        }
    };

</script>
