<template>
    <thead>
        <tr class="bg-primary">
            <td v-for="tdItem in tdList" class="text-center" :style="{border:printingBorder}">
                {{tdItem}}
            </td>
        </tr>
    </thead>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'summarySectionHeader',
    computed: {
        ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
        printingBorder: function() {
            if (this.pOPrintMode) {
                return '2px solid black !important';
            } else {
                return null;
            }
        }
    },
    data: function() {
        return {
            tdList: ['項 次', '品 名', '規 格', '數 量', '單 位', '單 價', '合 計']
        };
    }
};
</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
