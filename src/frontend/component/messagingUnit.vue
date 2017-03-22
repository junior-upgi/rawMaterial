<template lang="html">
    <div v-if="!pOPrintMode" style="margin-top:25px;">
        <textarea
            rows="8" style="width:100%;resize:vertical;"
            :disabled="dataProcessingState ? true : false"
            v-model="groupMessage">
        </textarea>
        <button
            class="btn btn-primary btn-block"
            :disabled="dataProcessingState ? true : false"
            @click="sendGroupMessage()">
            發送訊息
        </button>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'messagingUnit',
    computed: {
        ...mapGetters({
            pOPrintMode: 'checkPOPrintMode',
            dataProcessingState: 'checkDataProcessingState',
            userData: 'userData'
        })
    },
    data: function() {
        return {
            groupMessage: ''
        };
    },
    methods: {
        ...mapActions({
            componentErrorHandler: 'componentErrorHandler',
            employeeChatBroadcast: 'employeeChatBroadcast'
        }),
        ...mapMutations({ processingDataSwitch: 'processingDataSwitch' }),
        sendGroupMessage: function() {
            this.processingDataSwitch(true);
            this.employeeChatBroadcast({
                groupMessage: this.groupMessage
            }).then((result) => {
                this.groupMessage = '';
                this.processingDataSwitch(false);
            }).catch((error) => {
                this.componentErrorHandler({
                    component: 'messagingUnit',
                    method: 'sendGroupMessage',
                    situation: '傳送群組訊息發生錯誤',
                    systemErrorMessage: error
                });
            });
        }
    }
};
</script>

<style></style>
