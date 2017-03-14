<template>
    <tbody>
        <td colspan="6" class="bg-primary">
            <h4 style="margin:10px;padding:0px;">尚未下單項目列表</h4>
        </td>
        <newRequestRecord
            v-for="summaryEntry in newRequestSummary"
            :requestSummary="summaryEntry"
            :newShipmentRequestList="filterNewShipmentRequestList(summaryEntry.CUS_NO, summaryEntry.contractType, summaryEntry.workingYear, summaryEntry.workingMonth)">
        </newRequestRecord>
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex';
    import newRequestRecord from './newRequestRecord/newRequestRecord.vue';

    export default {
        name: 'newRequestList',
        components: { newRequestRecord },
        computed: {
            ...mapGetters({
                newRequestSummary: 'newRequestSummary',
                newShipmentRequestList: 'newShipmentRequestList',
                rawMaterialList: 'rawMaterialList'
            })
        },
        methods: {
            filterNewShipmentRequestList: function(CUS_NO, contractType, workingYear, workingMonth) {
                switch(contractType) {
                    case 'annual':
                        return this.newShipmentRequestList.filter((newShipmentRequest) => {
                            return (
                                (newShipmentRequest.CUS_NO === CUS_NO) &&
                                ((new Date(newShipmentRequest.workingDate).getUTCFullYear()) === workingYear)
                            );
                        });
                    case 'monthly':
                        return this.newShipmentRequestList.filter((newShipmentRequest) => {
                            return (
                                (newShipmentRequest.CUS_NO === CUS_NO) &&
                                ((new Date(newShipmentRequest.workingDate).getUTCFullYear()) === workingYear) &&
                                ((new Date(newShipmentRequest.workingDate).getMonth() + 1) === workingMonth)
                            );
                        });
                    default:
                        return this.newShipmentRequestList.filter((newShipmentRequest) => {
                            return newShipmentRequest.CUS_NO === CUS_NO;
                        });
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
