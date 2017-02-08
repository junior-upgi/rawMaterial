<script>
    import { mapGetters } from 'vuex';
    import { store } from '../store/store.js';

    import loginView from './login.vue';
    import adminView from './userInterface/admin.vue';
    import furnaceView from './userInterface/furnace.vue';
    import purchasingView from './userInterface/purchasing.vue';
    import supplierView from './userInterface/supplier.vue';

    const titleComponent = {
        name: 'title',
        template: `
            <div class="col">
                <h1>統義玻璃股份有限公司&nbsp;&nbsp;<small>原料預約進貨作業</small></h1>
            </div>`
    };

    export default {
        name: 'app',
        store: store,
        components: {
            'heading': titleComponent,
            loginView,
            adminView,
            furnaceView,
            purchasingView,
            supplierView
        },
        computed: {
            ...mapGetters({
                activeView: 'getActiveView'
            })
        },
        methods: {
            onLoginView() { return this.activeView === 'loginView' ? true : false; }
        }
    };

</script>

<template>
    <div id="app" class="container">
        <div class="row">
            <heading></heading>
        </div>
        <div class="row">
            <div v-if="!onLoginView" class="col-2">
                <button type="button" class="btn btn-primary btn-block" disabled>reserved</button>
                <button type="button" class="btn btn-primary btn-block" disabled>for</button>
                <button type="button" class="btn btn-primary btn-block" disabled>sidebar</button>
            </div>
            <template>
                <component v-bind:is="activeView"></component>
            </template>
</div>
</div>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
