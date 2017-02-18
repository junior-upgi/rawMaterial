<template>
    <div>
        <!-- admin -->
        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('admin')">
            <span v-if="activeView==='admin'" class="glyphicon glyphicon-ok"></span> 管理模組
        </button>
        <!-- furnace -->
        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('furnace')">
            <span v-if="activeView==='furnace'" class="glyphicon glyphicon-ok"></span> 窯爐模組
        </button>
        <!-- purchasing -->
        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('purchasing')">
            <span v-if="activeView==='purchasing'" class="glyphicon glyphicon-ok"></span> 採購模組
        </button>
        <!-- supplier -->
        <button v-if="role==='admin'" type="button" class="btn btn-default btn-block" @click="changeView('supplier')">
            <span v-if="activeView==='supplier'" class="glyphicon glyphicon-ok"></span> 廠商模組
        </button>
        <button type="button" class="btn btn-default btn-block" :disabled="activeView==='login'?true:false" @click="logout">
            登出
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'sidebar',
        computed: {
            ...mapGetters({
                activeView: 'getActiveView',
                role: 'getRole'
            })
        },
        methods: {
            ...mapMutations({
                forceViewChange: 'forceViewChange',
                redirectUser: 'redirectUser',
                resetStore: 'resetStore'
            }),
            changeView: function(role) {
                this.forceViewChange(role);
            },
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
