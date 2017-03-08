<template>
    <div class="text-center col-xs-12 col-sm-10">
        <h2>管理模組</h2>
        <br>
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
