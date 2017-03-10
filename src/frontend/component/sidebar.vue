<template>
    <div class="col-xs-12 col-sm-2">
        <button
            v-if="role==='admin'"
            type="button"
            class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='admin'}"
            @click="forceViewChange('admin')">
            管理模組
        </button>
        <button
            v-if="(role==='admin')||(role==='furnace')"
            type="button"
            class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='furnace'}"
            @click="forceViewChange('furnace')">
            窯爐模組
        </button>
        <button
            v-if="(role==='admin')||(role==='furnace')"
            type="button"
            :disabled="dataProcessingState?true:false"
            class="btn btn-default btn-block">
            轉入廠單
        </button>
        <button
            v-if="(role==='admin')||(role==='purchasing')"
            type="button"
            class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='purchasing'}"
            @click="forceViewChange('purchasing')">
            採購模組
        </button>
        <button
            v-if="role==='admin'"
            type="button"
            :disabled="dataProcessingState?true:false"
            class="btn btn-default btn-block"
            :class="{'btn-danger':role==='supplier'}">
            廠商模組
        </button>
        <button
            type="button"
            class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            @click="logout">
            登出系統
        </button>
        <!--
        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('admin')">
            <span v-if="activeView==='admin'" class="glyphicon glyphicon-ok"></span> 管理模組
        </button>

        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('furnace')">
            <span v-if="activeView==='furnace'" class="glyphicon glyphicon-ok"></span> 窯爐模組
        </button>

        <button v-if="role==='admin'||role==='purchasing'" type="button" class="btn btn-default btn-block" @click="changeView('purchasing')">
            <span v-if="activeView==='purchasing'" class="glyphicon glyphicon-ok"></span> 採購模組
        </button>
        <button
            v-if="role==='admin'||role==='purchasing'"
            type="button"
            class="btn btn-default btn-block"
            @click="changeView('pOTemplate')">
            <span v-if="activeView==='pOTemplate'" class="glyphicon glyphicon-ok"></span> 開立訂單
        </button>
        <button
            v-if="(role==='admin'||role==='purchasing') && activeView==='pOTemplate' && pOWorkingSupplier!==null"
            type="button"
            class="btn btn-default btn-block"
            @click="printPO">
            訂單列印
        </button>

        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('supplier')">
            <span v-if="activeView==='supplier'" class="glyphicon glyphicon-ok"></span> 廠商模組
        </button>
        <button type="button" class="btn btn-default btn-block" :disabled="activeView==='login'?true:false" @click="logout">
            登出
        </button>
    // v-if="(activeView!=='login')&&(pOPrintMode!==true)" class="col-sm-2 col-xs-12"
    // :class="{'col-sm-8 col-md-4':activeView==='login','col-sm-10 col-xs-12':((activeView!=='login')&&(pOPrintMode!==true)),'col-xs-12':pOPrintMode===true}"
        -->
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'sidebar',
        computed: {
            ...mapGetters({
                activeView: 'activeView',
                dataProcessingState: 'checkDataProcessingState',
                role: 'role'
            })
        },
        methods: {
            ...mapMutations({
                forceViewChange: 'forceViewChange',
                resetStore: 'resetStore'
            }),
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            }
        }
        /*
        computed: {
            ...mapGetters({
                activeView: 'activeView',
                pOPrintMode: 'checkPOPrintMode',
                pOWorkingSupplier: 'getPOWorkingSupplier',
                role: 'role'
            })
        },
        methods: {
            ...mapActions({
                initData: 'initData',
                refreshPOShipmentListing: 'refreshPOShipmentListing',
                savePOData: 'savePOData'
            }),
            ...mapMutations({
                changePOMode: 'changePOMode',
                buildStore: 'buildStore',
                redirectUser: 'redirectUser',
                resetStore: 'resetStore',
                restoreToken: 'restoreToken',
                switchPOWorkingSupplier: 'switchPOWorkingSupplier'
            }),
            changeView: function(view) {
                if (this.activeView !== view) {
                    this.initData()
                        .then((responseList) => {
                            const token = sessionStorage.token;
                            this.resetStore();
                            sessionStorage.token = token;
                            this.restoreToken(sessionStorage.token);
                            this.buildStore(responseList);
                            this.forceViewChange(view);
                        }).catch((error) => {
                            alert(`操作模組變更發生錯誤: ${error}...`);
                            this.resetStore();
                        });
                }
            },,
            printPO: function() {
                this.changePOMode({ pOPrintMode: true, pOViewMode: false });
                setTimeout(() => {
                    if (confirm('請確認是否儲存訂單資料並產生正式訂單?')) {
                        this.savePOData()
                            .then(() => {
                                print();
                                setTimeout(() => {
                                    this.changePOMode({ pOPrintMode: false, pOViewMode: true });
                                    this.refreshPOShipmentListing();
                                    this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                                    this.forceViewChange('pOTemplate');
                                }, 500);
                            }).catch((error) => {
                                console.log(`訂單儲存發生錯誤: ${error}`);
                                this.changePOMode({ pOPrintMode: false, pOViewMode: true });
                                this.refreshPOShipmentListing();
                                this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                                this.forceViewChange('pOTemplate');
                            });
                    } else {
                        this.changePOMode({ pOPrintMode: false, pOViewMode: true });
                        this.refreshPOShipmentListing();
                        this.switchPOWorkingSupplier(this.pOWorkingSupplier);
                        this.forceViewChange('pOTemplate');
                    }
                }, 500);
            }
        }
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
