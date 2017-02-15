<template>
    <div class="text-center">
        <div class="row">
            <h2>管理模組</h2>
        </div>
        <known-raw-material></known-raw-material>
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
