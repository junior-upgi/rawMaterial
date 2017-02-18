<template>
    <div class="text-center">
        <div class="row">
            <h2>窯爐模組</h2>
        </div>
        <batch-reservation></batch-reservation>
        <shipment-schedule></shipment-schedule>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import shipmentSchedule from './shipmentSchedule.vue';
    import batchReservation from './batchReservation.vue';
    import rawMaterialSelector from './rawMaterialSelector.vue';

    export default {
        name: 'furnace',
        components: {
            batchReservation,
            rawMaterialSelector,
            shipmentSchedule
        },
        computed: {
            ...mapGetters({ selectedRawMatIndex: 'getSelectedRawMatIndex' })
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
