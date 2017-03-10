<template>
    <td colspan="2" class="text-left">
        {{requestSummary.newRequestCount}} 車
        {{requestSummary.PRDT_SNM}}【{{requestSummary.specification}}】
    </td>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'newRequestList',
        props: [
            'requestList',
            'requestSummary'
        ],
        computed: {
            ...mapGetters({ rawMaterialList: 'rawMaterialList' })
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
