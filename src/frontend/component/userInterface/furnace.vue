<template>
    <div class="text-center">
        <div class="row">
            <h3>窯爐模組</h3>
            <raw-material-selector></raw-material-selector>
        </div>
        <div class="row">
            <batch-reservation></batch-reservation>
        </div>
        <div class="row">
            <h4>本月原料預約/進場狀況</h4>
            <shipment-schedule></shipment-schedule>
        </div>
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
