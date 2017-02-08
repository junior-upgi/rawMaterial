<script>
    import { mapGetters, mapMutations } from 'vuex';

    import { store } from '../store/store.js';

    import login from './login.vue';
    import admin from './userInterface/admin.vue';
    import furnace from './userInterface/furnace.vue';
    import purchasing from './userInterface/purchasing.vue';
    import supplier from './userInterface/supplier.vue';

    const titleComponent = {
        name: 'title',
        template: `
            <div class="page-header">
                <h3>統義玻璃股份有限公司&nbsp;<small>玻璃原物料進貨管控系統</small></h3>
            </div>`
    };

    export default {
        name: 'app',
        store: store,
        components: {
            'heading': titleComponent,
            login,
            admin,
            furnace,
            purchasing,
            supplier
        },
        computed: {
            ...mapGetters({
                activeView: 'getActiveView',
                role: 'getRole'
            })
        },
        created: function() {
            // if jwt token exists in the sessionStorage
            if ((sessionStorage.token !== undefined) && (sessionStorage.token !== null) && (sessionStorage.token !== '')) {
                this.restoreToken(sessionStorage.token); // restore token from session storage
                this.redirectUser(this.getRole); // cause router action (redirect) by setting the role property
            }
        },
        methods: {
            ...mapMutations({
                redirectUser: 'redirectUser',
                restoreToken: 'restoreToken',
                resetStore: 'resetStore'
            }),
            changeView: function(role) {
                this.$store.commit('forceView', role);
            },
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            }
        }
    };

</script>

<template>
    <div id="app" class="container">
        <br>
        <div class="row">
            <heading></heading>
        </div>
        <div class="row">
            <br>
            <div v-if="activeView !== 'login'" class="col-2">
                <button v-if="role==='admin'" type="button" class="btn btn-outline-danger btn-block" @click="changeView('furnace')">窯爐模組</button>
                <button v-if="role==='admin'" type="button" class="btn btn-outline-danger btn-block" @click="changeView('purchasing')">採購模組</button>
                <button v-if="role==='admin'" type="button" class="btn btn-outline-danger btn-block" @click="changeView('supplier')">廠商模組</button>
                <button type="button" class="btn btn-outline-info btn-block">reserved</button>
                <button type="button" class="btn btn-outline-info btn-block">for</button>
                <button type="button" class="btn btn-outline-info btn-block" disabled>sidebar</button>
                <button type="button" class="btn btn-outline-primary btn-block" :disabled="activeView==='login'?true:false" @click="logout">登出</button>
            </div>
            <div :class="{'col':activeView==='login','col-10':activeView!=='login'}">
                <template>
                    <component :is="activeView"></component>
                </template>
</div>
</div>
</div>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
