<template>
    <td colspan="2" class="text-left">
        <template v-for="(requestedMaterial,PRD_NO) in requestList">
            <template v-for="(requestedMatType,typeId) in requestedMaterial">
                <div>
                    <span>{{requestedMatType.length}}</span> 車
                    <span>{{getRawMaterialSNM(PRD_NO)}}</span>
                    <span>【{{getRawMaterialSpec(requestSummary.CUS_NO,PRD_NO,typeId)}}】</span>
                </div>
            </template>
        </template>
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
                    if(rawMaterial.PRD_NO === PRD_NO) {
                        PRDT_SNM = rawMaterial.SNM;
                    }
                });
                return PRDT_SNM;
            },
            getRawMaterialSpec: function(CUS_NO, PRD_NO, typeId) {
                let specification = null;
                this.rawMaterialList.forEach((rawMaterial) => {
                    if(
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

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
