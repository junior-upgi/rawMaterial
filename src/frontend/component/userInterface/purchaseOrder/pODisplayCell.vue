<template>
    <td>
        <div v-if="!noPOAvailable" style="white-space:nowrap;">
            <span v-for="pOItem in pOList">
                <span v-if="visibilityCheck(pOItem)">
                    {{pOItem.pONumber}}-{{pOItem.revisionNumber}}
                </span>
            </span>
        </div>
        <div v-else>
            <button
                class="btn btn-primary btn-xs"
                @click="createNewPO(CUS_NO)">
                建立訂單
            </button>
        </div>
    </td>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'pODisplayCell',
        props: ['CUS_NO', 'pOList'],
        computed: {
            ...mapGetters({
                workingYear: 'workingYear',
                workingMonth: 'workingMonth'
            }),
            noPOAvailable: function() { return (this.pOList.length === 0) ? true : false; }
        },
        methods: {
            ...mapActions({ refreshPOShipmentListing: 'refreshPOShipmentListing' }),
            ...mapMutations({
                forceViewChange: 'forceViewChange',
                switchPOWorkingSupplier: 'switchPOWorkingSupplier'
            }),
            createNewPO: function(CUS_NO) {
                this.switchPOWorkingSupplier(CUS_NO);
                this.refreshPOShipmentListing();
                this.forceViewChange('pOTemplate');
            },
            visibilityCheck: function(pOItem) {
                let unfulfilledList = null;
                switch (pOItem.contractType) {
                    case 'oneTime':
                        unfulfilledList = pOItem.shipments.filter((shipment) => {
                            return (
                                (shipment.received === 0) &&
                                (shipment.workingYear === null) &&
                                (shipment.workingMonth === null)
                            );
                        }).slice();
                        return unfulfilledList.length > 0 ? true : false;
                    case 'monthly':
                        unfulfilledList = pOItem.shipments.filter((shipment) => {
                            return (
                                (shipment.received === 0) &&
                                (shipment.workingYear === this.workingYear) &&
                                (shipment.workingMonth === this.workingMonth)
                            );
                        }).slice();
                        return unfulfilledList.length > 0 ? true : false;
                    case 'annual':
                        unfulfilledList = pOItem.shipments.filter((shipment) => {
                            return (
                                (shipment.received === 0) &&
                                (shipment.workingYear === this.workingYear) &&
                                (shipment.workingMonth === this.workingMonth)
                            );
                        }).slice();
                        return unfulfilledList.length > 0 ? true : false;
                    default:
                        return false;
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
