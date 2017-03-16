<template>
    <tbody :style="{border:printingBorder}">
        <tr>
            <td colspan="3" class="text-left" style="padding:10px;">
                <div class="container-fluid">
                    <div v-for="message in pONoticeList" class="row">
                        <h5>{{message.string}}</h5>
                    </div>
                </div>
            </td>
            <td colspan="4" class="text-right">
                <textarea style="padding-left:10px;width:100%;height:100%;resize:vertical;border:0px;" rows="8" placeholder="可在此手動輸入其他資訊。訊息可列印但不加以儲存 (高度調整可能超過單頁列印尺寸，請自行斟酌輸入內容多寡)" v-model.lazy="customMessageValue" @change="$emit('customMessageChangeEvent', customMessageValue)">
                </textarea>
            </td>
        </tr>
    </tbody>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'reminderDisplay',
    props: ['customMessage', 'pONoticeList'],
    computed: {
        ...mapGetters({
            pOPrintMode: 'checkPOPrintMode'
        }),
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
            customMessageValue: this.customMessage
        };
    },
    watch: {
        customMessage: function(changedCustomMessageValue) {
            this.customMessageValue = changedCustomMessageValue;
        }
    }
};
</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
