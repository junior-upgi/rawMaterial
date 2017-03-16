<template>
    <div class="text-center col-xs-12 col-sm-10">
        <h2>採購模組</h2>
        <br>
        <pOOverview></pOOverview>
        <div class="row">
            <div class="col-md-8">
                <shipmentOverview></shipmentOverview>
            </div>
            <div class="col-md-4">
                <contactInfo></contactInfo>
            </div>
        </div>
    </div>
</template>

<script>
import pOOverview from './pOOverview/pOOverview.vue';
import contactInfo from './contactInfo.vue';
import shipmentOverview from './shipmentOverview/shipmentOverview.vue';

export default {
    name: 'purchasing',
    components: {
        pOOverview,
        contactInfo,
        shipmentOverview
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
