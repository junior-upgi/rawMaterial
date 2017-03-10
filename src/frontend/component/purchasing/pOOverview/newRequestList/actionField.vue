<template>
    <td>
        <button
            v-if="matchingActivePO !== null"
            type="button" class="btn btn-danger btn-xs">
            更新訂單
        </button>
        <button
            v-else
            type="button" class="btn btn-primary btn-xs"
            @click="createNewPO">
            開立訂單
        </button>
    </td>
</template>

<script>
    import { mapActions, mapMutations, mapGetters } from 'vuex';

    export default {
        name: 'actionField',
        props: ['CUS_NO', 'workingYear', 'workingMonth'],
        computed: {
            ...mapGetters({ activePOList: 'activePOList' }),
            matchingActivePO: function() {
                let matchingActivePO = this.activePOList.filter((activePO) => {
                    return (
                        (activePO.CUS_NO === this.CUS_NO) &&
                        (activePO.workingYear === this.workingYear) &&
                        (activePO.workingMonth === this.workingMonth)
                    );
                });
                return (matchingActivePO[0] === undefined) ? null : matchingActivePO[0];
            }
        },
        methods: {
            ...mapActions({ setWorkingTime: 'setWorkingTime' }),
            ...mapMutations({ setWorkingSupplier: 'setWorkingSupplier' }),
            createNewPO: function(CUS_NO, workingYear, workingMonth) {
                this.setWorkingSupplier(CUS_NO);
                this.setWorkingTime({
                    workingYear: workingYear,
                    workingMonth: workingMonth
                });
                return 1;
            }
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
