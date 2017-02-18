<template>
    <div class="text-center">
        <h2>採購模組</h2>
        <div class="row">
            <div class="col-md-9" is="shipment-overview">
            </div>
            <div class="col-md-3">
                聯絡人資料
            </div>
        </div>
        <div class="row">
            其他
        </div>
    </div>
</template>

<script>
    import shipmentOverview from './shipmentOverview.vue';

    export default {
        name: 'purchasing',
        components: {
            shipmentOverview
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
