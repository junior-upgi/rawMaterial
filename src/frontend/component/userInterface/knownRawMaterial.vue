<template>
    <div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title text-left">原料種類</h3>
            </div>
            <div class="panel-body" style="height:300px;overflow:auto;">
                <ul class="list-group">
                    <li v-for="ratMatType in rawMaterialTypeList" class="list-group-item list-group-item-success text-left col-xs-12">
                        ERP 料號 (PRD_NO): {{ratMatType.PRD_NO}} 原料名稱 (SNM): {{ratMatType.SNM}} 計量單位 (UT): {{ratMatType.UT}}
                    </li>
                    <li class="list-group-item list-group-item-danger text-left col-xs-12">(請直接於 rawMaterial.dbo.knownRawMatId 新增操作項目)</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { store } from '../../store/store.js';

    export default {
        name: 'knownRawMaterial',
        store: store,
        computed: {
            ...mapGetters({ rawMaterialTypeList: 'getRawMaterialTypeList' })
        },
        data: () => {
            return {
                knownRatMatList: [
                    { PRD_NO: 'MROPA001', SNM: '石英砂1', UT: '公斤' },
                    { PRD_NO: 'MROPA002', SNM: '石英砂2', UT: '公斤' },
                    { PRD_NO: 'MROPA003', SNM: '石英砂3', UT: '公斤' },
                    { PRD_NO: 'MROPA004', SNM: '石英砂4', UT: '公斤' }
                ]
            };
        }
    };

</script>
