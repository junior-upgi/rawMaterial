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
        <!--
        <newRequestRecord
            v-for="summaryEntry in newRequestSummary"
            v-if="organizedRequestList[summaryEntry.CUS_NO]"
            :requestSummary="summaryEntry">
        </newRequestRecord>
        -->
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
            /* ,
            organizedRequestList: function() {
                let organizedRequest = {};
                this.rawMaterialList.forEach((rawMaterial) => {
                    if (organizedRequest[rawMaterial.CUS_NO] === undefined) {
                        organizedRequest[rawMaterial.CUS_NO] = {};
                    }
                    if (organizedRequest[rawMaterial.CUS_NO][rawMaterial.PRD_NO] === undefined) {
                        organizedRequest[rawMaterial.CUS_NO][rawMaterial.PRD_NO] = {};
                    }
                    organizedRequest[rawMaterial.CUS_NO][rawMaterial.PRD_NO][rawMaterial.typeId] = this.newShipmentRequestList.filter((request) => {
                        return (
                            (rawMaterial.CUS_NO === request.CUS_NO) &&
                            (rawMaterial.PRD_NO === request.PRD_NO) &&
                            (rawMaterial.typeId === request.typeId)
                        );
                    });
                    organizedRequest[rawMaterial.CUS_NO][rawMaterial.PRD_NO][rawMaterial.typeId].forEach((currentItem, index, array) => {
                        if(currentItem.contractType === 'annual') {
                            array[index].workingYear = new Date(currentItem.workingDate).getFullYear();
                            array[index].workingMonth = null;
                        } else if (currentItem.contractType === 'monthly') {
                            array[index].workingYear = new Date(currentItem.workingDate).getFullYear();
                            array[index].workingMonth = new Date(currentItem.workingDate).getMonth() + 1;
                        } else {
                            array[index].workingYear = null;
                            array[index].workingMonth = null;
                        }
                    });
                });
                return organizedRequest;
            }
            */
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
