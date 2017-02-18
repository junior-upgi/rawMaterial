<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import { store } from '../store/store.js';

    import login from './login.vue';
    import admin from './userInterface/admin.vue';
    import furnace from './userInterface/furnace.vue';
    import purchasing from './userInterface/purchasing.vue';
    import sidebar from './userInterface/sidebar.vue';
    import supplier from './userInterface/supplier.vue';

    const titleComponent = {
        name: 'title',
        template: `
            <div class="row" style="margin-left:10px;">
                <div class="page-header">
                    <h2>統義玻璃股份有限公司 <small style="white-space:nowrap;">玻璃原物料進貨管控系統</small></h2>
                </div>
            </div>`
    };

    export default {
        name: 'app',
        store: store,
        components: {
            'heading': titleComponent,
            sidebar,
            login,
            admin,
            furnace,
            purchasing,
            supplier
        },
        computed: { ...mapGetters({ activeView: 'getActiveView' }) },
        methods: {
            ...mapActions({ initData: 'initData' }),
            ...mapMutations({
                dataInitialization: 'dataInitialization',
                redirectUser: 'redirectUser',
                restoreToken: 'restoreToken'
            })
        },
        created: function() {
            // if jwt token exists in the sessionStorage
            if (
                (sessionStorage.token !== undefined) &&
                (sessionStorage.token !== null) &&
                (sessionStorage.token !== '')
            ) {
                this.restoreToken(sessionStorage.token); // restore token from session storage
                this.initData()
                    .then((responseList) => {
                        this.dataInitialization(responseList);
                        this.redirectUser();
                    })
                    .catch((error) => {
                        console.log(error.errorMessage);
                    });
            }
        }
    };

</script>

<template>
    <div id="app" class="container-fluid">
        <br>
        <heading></heading>
        <div class="row">
            <sidebar v-if="activeView!=='login'" class="col-lg-2 col-sm-2 col-xs-12"></sidebar>
            <div
                :class="{'col-sm-8 col-md-4':activeView==='login','col-lg-10 col-sm-9 col-xs-12':activeView!=='login'}"
                :is="activeView">
            </div>
        </div>
    </div>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    body {
        overflow-x: hidden;
    }

</style>
