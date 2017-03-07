<template>
    <div class="text-center col-xs-12 col-sm-10">
        <div class="row">
            <h2>管理模組</h2>
        </div>
        <knownRawMaterial></knownRawMaterial>
    </div>
</template>

<script>
    import knownRawMaterial from './knownRawMaterial.vue';

    export default {
        name: 'admin',
        components: { knownRawMaterial }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
