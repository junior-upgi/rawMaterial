<template lang="html">
    <div class="container-fluid">
        <div v-if="!pOPrintMode" class="row" style="margin-left:10px;">
            <div class="page-header" style="margin-top:15px;">
                <h2 style="margin-top:0px;">統義玻璃股份有限公司 <small style="white-space:nowrap;">玻璃原物料進貨管控系統</small></h2>
            </div>
        </div>
        <div class="row">
            <sidebar v-if="(activeView!=='login') && (!pOPrintMode)">
            </sidebar>
            <div :is="activeView"></div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { store } from '../store/store.js';
import sidebar from './sidebar.vue';
import login from './login.vue';
import admin from './admin/admin.vue';
import furnace from './furnace/furnace.vue';
import purchasing from './purchasing/purchasing.vue';
import pOView from './purchasing/purchaseOrder/pOView.vue';
import shippingStatement from './purchasing/shippingStatement/shippingStatement.vue';
/*
import supplier from './userInterface/supplier.vue';
import pOTemplate from './userInterface/purchaseOrder/pOTemplate.vue';
*/

export default {
    name: 'app',
    store: store,
    components: {
        sidebar,
        login,
        admin,
        furnace,
        purchasing,
        pOView,
        shippingStatement
    },
    computed: {
        ...mapGetters({
            activeView: 'activeView',
            pOPrintMode: 'checkPOPrintMode'
        })
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            initData: 'initData'
        }),
        ...mapMutations({
            buildStore: 'buildStore',
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
                    this.buildStore(responseList);
                    this.redirectUser();
                })
                .catch((error) => {
                    this.componentErrorHandler({
                        component: 'app',
                        method: 'created',
                        situation: '初始化程序失敗',
                        systemMessage: error
                    });
                });
        }
    }
    /* ,
    components: {
        furnace,
        purchasing,
        supplier,
        pOTemplate
    },
    computed: {
        ...mapGetters({
            activeView: 'activeView'
        })
    }
    */
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
body {
    overflow-x: hidden;
}
</style>
