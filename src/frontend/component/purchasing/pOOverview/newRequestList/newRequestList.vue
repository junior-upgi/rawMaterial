<template>
    <tbody>
        <tr v-for="summaryEntry in newRequestSummary"
            v-if="organizedRequestList[summaryEntry.CUS_NO] && checkNewRequestAvailability(summaryEntry.CUS_NO)">
            <td>待下單項目</td>
            <td>{{summaryEntry.workingYear}}</td>
            <td>{{summaryEntry.workingMonth}}</td>
            <td>{{summaryEntry.CUST_SNM}}</td>
            <newRequestSummary
                :requestList="organizedRequestList[summaryEntry.CUS_NO]"
                :requestSummary="summaryEntry">
            </newRequestSummary>
        </tr>
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex';
    import newRequestSummary from './newRequestSummary.vue';

    export default {
        name: 'newRequestList',
        components: { newRequestSummary },
        computed: {
            ...mapGetters({
                newRequestSummary: 'newRequestSummary',
                newShipmentRequestList: 'newShipmentRequestList',
                rawMaterialList: 'rawMaterialList',
                supplierList: 'supplierList'
            }),
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
                            array[index].workingMonth = new Date(currentItem.workingDate).getMonth();
                        } else {
                            array[index].workingYear = null;
                            array[index].workingMonth = null;
                        }
                    });
                });
                return organizedRequest;
            }
        },
        methods: {
            checkNewRequestAvailability: function(CUS_NO) {
                let newRequestAvailable = false;
                for(let rawMatIndex in this.organizedRequestList[CUS_NO]) {
                    for(let typeIdIndex in this.organizedRequestList[CUS_NO][rawMatIndex]) {
                        if (this.organizedRequestList[CUS_NO][rawMatIndex][typeIdIndex].length > 0) {
                            newRequestAvailable = true;
                        }
                    }
                }
                return newRequestAvailable;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
