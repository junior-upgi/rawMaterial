<template>
    <div class="text-center col-xs-12 col-sm-10">
        <h2>窯爐模組</h2>
        <br>
        <shipmentSchedule></shipmentSchedule>
        <batch-reservation></batch-reservation>
    </div>
</template>

<script>
    import batchReservation from './batchReservation/batchReservation.vue';
    import shipmentSchedule from './shipmentSchedule/shipmentSchedule.vue';

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
