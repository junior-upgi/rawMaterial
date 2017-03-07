<template>
    <td class="text-left" style="white-space:nowrap;">
        <div
            v-for="(supplyingSpec,index) in releventList"
            style="padding-left:10px;">
            {{index+1}}. {{supplyingSpec.specification}}
        </div>
    </td>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'supplyingSpecList',
        props: ['CUS_NO'],
        computed: {
            ...mapGetters({ supplyingSpecList: 'getSupplyingSpecList' }),
            releventList: function() {
                return this.supplyingSpecList.filter((supplyingSpec) => {
                    return supplyingSpec.CUS_NO === this.CUS_NO;
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
