<template lang="html">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h4>原料種類</h4>
        </div>
        <div class="panel-body" style="height:300px;overflow:auto;">
            <ul class="list-group">
                <li v-for="ratMatType in rawMaterialTypeList" class="list-group-item list-group-item-success text-left">
                    ERP 料號 (PRD_NO): {{ratMatType.PRD_NO}} 原料名稱 (SNM): {{ratMatType.SNM}} 計量單位 (UT): {{ratMatType.UT}}
                </li>
                <li class="list-group-item list-group-item-danger text-left">(請直接於 rawMaterial.dbo.knownRawMatId 新增操作項目)</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'knownRawMaterial',
    computed: {
        ...mapGetters({ rawMaterialTypeList: 'rawMaterialTypeList' })
    }
};

</script>

<style></style>
