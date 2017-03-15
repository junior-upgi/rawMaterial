<template>
    <tbody>
        <tr>
            <td colspan="7" class="text-left"
                :style="{border:printingBorder}">
                <div
                    v-for="message in pONoticeList"
                    style="margin:0px;padding-left:10px;">
                    <h5>{{message.string}}</h5>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'reminderDisplay',
        props: ['pONoticeList'],
        computed: {
            ...mapGetters({
                pOPrintMode: 'checkPOPrintMode'
                // pONoticeArray: 'getPONoticeArray'
            }),
            printingBorder: function() {
                if (this.pOPrintMode) {
                    return '2px solid black !important';
                } else {
                    return null;
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
