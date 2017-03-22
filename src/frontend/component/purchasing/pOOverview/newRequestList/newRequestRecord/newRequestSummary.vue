<template lang="html">
    <td colspan="2" class="text-left">
        <ul style="margin:0px 0px 0px 20px;padding:0px">
            <template v-for="(requestedMaterial,PRD_NO) in requestList">
                <template v-for="(requestedMatType,typeId) in requestedMaterial">
                    <li v-if="requestedMatType.length > 0" style="margin:0px;padding:0px">
                        <span>{{requestedMatType.length}} 車{{getRawMaterialSNM(PRD_NO)}}</span>
                        <span>【{{getRawMaterialSpec(requestSummary.CUS_NO,PRD_NO,typeId)}}】</span>
                    </li>
                </template>
            </template>
        </ul>
    </td>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'newRequestSummary',
    props: [
        'requestList',
        'requestSummary'
    ],
    computed: {
        ...mapGetters({
            rawMaterialTypeList: 'rawMaterialTypeList',
            rawMaterialList: 'rawMaterialList'
        })
    },
    methods: {
        getRawMaterialSNM: function(PRD_NO) {
            let PRDT_SNM = null;
            this.rawMaterialTypeList.forEach((rawMaterial) => {
                if (rawMaterial.PRD_NO === PRD_NO) {
                    PRDT_SNM = rawMaterial.SNM;
                }
            });
            return PRDT_SNM;
        },
        getRawMaterialSpec: function(CUS_NO, PRD_NO, typeId) {
            let specification = null;
            this.rawMaterialList.forEach((rawMaterial) => {
                if (
                    (rawMaterial.CUS_NO === CUS_NO) &&
                    (rawMaterial.PRD_NO === PRD_NO) &&
                    (rawMaterial.typeId === parseInt(typeId))
                ) {
                    specification = rawMaterial.specification;
                }
            });
            return specification;
        }
    }
};

</script>

<style></style>
