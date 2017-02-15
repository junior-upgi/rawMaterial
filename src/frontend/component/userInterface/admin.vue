<template>
    <div class="text-center">
        <div class="row">
            <h2>管理模組</h2>
        </div>
        <div class="row">
            <known-raw-material></known-raw-material>
        </div>
    </div>
</template>

<script>
    import { store } from '../../store/store.js';
    import knownRawMaterial from './knownRawMaterial.vue';

    export default {
        name: 'admin',
        store: store,
        components: { knownRawMaterial }
    };

</script>
