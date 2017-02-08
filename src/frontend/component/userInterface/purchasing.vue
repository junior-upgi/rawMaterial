<template>
    <div>
        <div>purchasing view loaded</div>
        <button type="button" @click="logout">登出</button>
    </div>
</template>
<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'purchasing',
        methods: {
            ...mapMutations({ resetStore: 'resetStore' }),
            logout: function() {
                if (confirm('請確認是否登出系統？將遺失未儲存之資料...')) {
                    this.resetStore();
                }
            }
        }
    };

</script>
