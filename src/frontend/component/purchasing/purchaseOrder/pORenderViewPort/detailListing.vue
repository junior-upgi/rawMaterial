<template>
    <tr>
        <td colspan="7">
            <scheduleTable></scheduleTable>
        </td>
    </tr>
</template>

<script>
    import scheduleTable from '../../../furnace/shipmentSchedule/shipmentSchedule.vue';
    export default {
        name: 'detailListing',
        components: { scheduleTable },
        props: ['shipmentList']
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
