<template>
    <tbody :style="{border:printingBorder}">
        <tr>
            <td colspan="3" class="text-left"
                style="padding:10px;">
                <div class="container-fluid">
                    <div v-for="message in pONoticeList" class="row">
                        <h5>{{message.string}}</h5>
                    </div>
                </div>
            </td>
            <td colspan="4" class="text-left">
                <textarea
                    style="width:100%;height:100%;"
                    placeholder="手動輸入其他資訊，訊息不會儲存(請自行調整尺寸)">
                </textarea>
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
            ...mapGetters({ pOPrintMode: 'checkPOPrintMode' }),
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
