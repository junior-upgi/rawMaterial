<template>
    <div>
        <!-- admin -->
        <button v-if="role==='admin'" type="button" class="btn btn-danger btn-block" @click="changeView('admin')">
            <span v-if="activeView==='admin'" class="glyphicon glyphicon-ok"></span> <strong>管理模組</strong>
        </button>
        <!-- furnace -->
        <button v-if="role==='admin'" type="button" class="btn btn-success btn-block" @click="changeView('furnace')">
            <span v-if="activeView==='furnace'" class="glyphicon glyphicon-ok"></span> <strong>窯爐模組</strong>
        </button>
        <!-- purchasing -->
        <button v-if="role==='admin'" type="button" class="btn btn-info btn-block" @click="changeView('purchasing')">
            <span v-if="activeView==='purchasing'" class="glyphicon glyphicon-ok"></span> <strong>採購模組</strong>
        </button>
        <!-- supplier -->
        <button v-if="role==='admin'" type="button" class="btn btn-warning btn-block" @click="changeView('supplier')">
            <span v-if="activeView==='supplier'" class="glyphicon glyphicon-ok"></span> <strong>廠商模組</strong>
        </button>
        <button type="button" class="btn btn-primary btn-block" :disabled="activeView==='login'?true:false" @click="logout">
            <strong>登出</strong>
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
                redirectUser: 'redirectUser',
                resetStore: 'resetStore'
            }),
            changeView: function(role) {
                this.$store.commit('forceViewChange', role);
            },
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            }
        }
    };

</script>
