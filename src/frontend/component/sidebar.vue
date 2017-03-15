<template>
    <div class="col-xs-12 col-sm-2">
        <button
            v-if="role==='admin'"
            type="button"
            class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='admin'}"
            @click="changeWorkingView('admin')">
            管理模組
        </button>
        <button
            v-if="(role==='admin')||(role==='furnace')"
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='furnace'}"
            @click="changeWorkingView('furnace')">
            窯爐模組
        </button>
        <button
            v-if="(role==='admin')||(role==='furnace')"
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false">
            轉入廠單
        </button>
        <button
            v-if="(role==='admin')||(role==='purchasing')"
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='purchasing'}"
            @click="changeWorkingView('purchasing')">
            採購模組
        </button>
        <button
            v-if="(role==='admin')||(role==='purchasing')"
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':activeView==='pOView'}"
            @click="changeWorkingView('pOView')">
            檢視訂單
        </button>
        <button
            v-if="role==='admin'"
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            :class="{'btn-danger':role==='supplier'}">
            廠商模組
        </button>
        <button
            type="button" class="btn btn-default btn-block"
            :disabled="dataProcessingState?true:false"
            @click="logout()">
            登出系統
        </button>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'sidebar',
        computed: {
            ...mapGetters({
                activeView: 'activeView',
                pOPrintMode: 'checkPOPrintMode',
                dataProcessingState: 'checkDataProcessingState',
                role: 'role'
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
                forceViewChange: 'forceViewChange',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            },
            changeWorkingView: function(view) {
                this.processingDataSwitch(true);
                this.initData()
                    .then((responseList) => {
                        this.buildStore(responseList);
                        this.forceViewChange(view);
                        this.processingDataSwitch(false);
                    })
                    .catch((error) => {
                        this.componentErrorHandler({
                            component: 'app',
                            method: 'created',
                            situation: '管理者變更模組中初始化程序失敗',
                            systemMessage: error
                        });
                    });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
