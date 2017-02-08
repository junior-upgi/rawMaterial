<template>
    <div id="app">
        <hello></hello>
        <component v-bind:is="activeView"></component>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { store } from '../store/store.js';

    import Hello from './Hello.vue';
    import Login from './Login.vue';

    export default {
        name: 'app',
        store: store,
        components: {
            Hello,
            Login
        },
        computed: {
            ...mapGetters({
                activeView: 'getActiveView'
            })
        }
    };

</script>
