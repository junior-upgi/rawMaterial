<template>
    <div class="text-center">
        <h2>窯爐模組</h2>
        <br>
        <batch-reservation></batch-reservation>
        <shipmentSchedule></shipmentSchedule>
    </div>
</template>

<script>
    import shipmentSchedule from './shipmentSchedule/shipmentSchedule.vue';
    import batchReservation from './batchReservation/batchReservation.vue';

    export default {
        name: 'furnace',
        components: {
            batchReservation,
            shipmentSchedule
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
