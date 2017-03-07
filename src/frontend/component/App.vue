<template>
    <div id="app" class="container-fluid">
        <br v-if="pOPrintMode!==true">
        <titleComponent v-if="pOPrintMode!==true"></titleComponent>
        <div class="row">
            <sidebar v-if="(activeView!=='login')&&(pOPrintMode!==true)" class="col-sm-2 col-xs-12"></sidebar>
            <div
                :class="{'col-sm-8 col-md-4':activeView==='login','col-sm-10 col-xs-12':((activeView!=='login')&&(pOPrintMode!==true)),'col-xs-12':pOPrintMode===true}"
                :is="activeView">
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapActions,
        mapGetters,
        mapMutations
    } from 'vuex';
    import { store } from '../store/store.js';
    import titleComponent from './titleComponent.vue';
    import login from './login.vue';
    import sidebar from './sidebar.vue';
    import admin from './userInterface/admin.vue';
    import furnace from './furnace/furnace.vue';
    import purchasing from './purchasing/purchasing.vue';
    import supplier from './userInterface/supplier.vue';

    import pOTemplate from './userInterface/purchaseOrder/pOTemplate.vue';

    export default {
        name: 'app',
        store: store,
        components: {
            titleComponent,
            sidebar,
            login,
            admin,
            furnace,
            purchasing,
            supplier,
            pOTemplate
        },
        computed: {
            ...mapGetters({
                activeView: 'activeView',
                pOPrintMode: 'checkPOPrintMode'
            })
        },
        methods: {
            ...mapActions({ initData: 'initData' }),
            ...mapMutations({
                buildStore: 'buildStore',
                redirectUser: 'redirectUser',
                resetStore: 'resetStore',
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
                        this.buildStore(responseList);
                        this.redirectUser();
                    })
                    .catch((error) => {
                        console.log(error);
                        alert('登入失敗，請檢查帳號密碼是否正確並重新登入...');
                        this.resetStore();
                    });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    body {
        overflow-x: hidden;
    }

</style>
