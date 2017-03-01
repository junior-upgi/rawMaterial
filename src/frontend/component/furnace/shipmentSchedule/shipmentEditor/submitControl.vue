<template>
    <td>
        <button
            v-if="!pristine&&workingDateReady&&weightDataReady"
            type="button"
            class="btn btn-info btn-sm"
            :disabled="dataProcessingState?true:false"
            @click="update()">
            <span class="glyphicon glyphicon-ok-sign"></span> 修改
        </button>
        <button
            type="button"
            class="btn btn-warning btn-sm"
            :disabled="dataProcessingState?true:false"
            @click="cancel()">
            <span class="glyphicon glyphicon-remove-sign"></span> 刪除
        </button>
    </td>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'submitControl',
        props: [
            'pristine',
            'shipped',
            'weightDataReady',
            'workingDateReady'
        ],
        computed: {
            ...mapGetters({ dataProcessingState: 'checkDataProcessingState' })
        },
        methods: {
            cancel: function() { this.$emit('cancel'); },
            update: function() { this.$emit('update'); }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
