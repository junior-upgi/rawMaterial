<template>
    <tr>
        <actionField
            :CUS_NO="requestSummary.CUS_NO"
            :workingYear="requestSummary.workingYear"
            :workingMonth="requestSummary.workingMonth"></actionField>
        <td>{{requestSummary.workingYear}}</td>
        <td>{{requestSummary.workingMonth}}</td>
        <td>{{requestSummary.CUST_SNM}}</td>
        <newRequestSummary
            :requestList="organizedRequestList[requestSummary.CUS_NO]"
            :requestSummary="requestSummary">
        </newRequestSummary>
    </tr>
</template>

<script>
    import { mapGetters } from 'vuex';

    import actionField from './actionField.vue';
    import newRequestSummary from './newRequestSummary.vue';

    export default {
        name: 'newRequestRecord',
        components: {
            actionField,
            newRequestSummary
        },
        props: ['requestSummary'],
        computed: {
            ...mapGetters({
                newShipmentRequestList: 'newShipmentRequestList',
                rawMaterialList: 'rawMaterialList'
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
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
