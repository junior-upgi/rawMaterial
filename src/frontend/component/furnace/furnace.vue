<template lang="html">
    <div class="text-center col-xs-12 col-sm-10">
        <h2>窯爐模組</h2>
        <br>
        <shipmentOverview></shipmentOverview>
        <batch-reservation></batch-reservation>
        <shipmentSchedule></shipmentSchedule>
    </div>
</template>

<script>
import shipmentOverview from '../purchasing/shipmentOverview/shipmentOverview.vue';
import batchReservation from './batchReservation/batchReservation.vue';
import shipmentSchedule from './shipmentSchedule/shipmentSchedule.vue';

export default {
    name: 'furnace',
    components: {
        shipmentOverview,
        batchReservation,
        shipmentSchedule
    }
};
</script>

<style></style>
