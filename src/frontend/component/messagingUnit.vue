<template>
    <div v-if="!pOPrintMode" style="margin-top:25px;">
        <textarea rows="8" style="width:100%;resize:vertical;" :disabled="dataProcessingState ? true : false" v-model="groupMessage">
        </textarea>
        <button class="btn btn-primary btn-block" :disabled="dataProcessingState ? true : false" @click="sendGroupMessage()">
            發送訊息
        </button>
    </div>
</template>

<script>
import axios from 'axios';
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
            groupMessage: '',
            chat: {
                id: -170186986,
                title: '統義原料控管系統群組',
                type: 'group'
            },
            bot: {
                id: 287236637,
                first_name: 'UPGI IT 機器人',
                username: 'upgiITBot',
                token: '287236637:AAHSuMHmaZJ2Vm9gXf3NeSlInrgr-XXzoRo'
            }
        };
    },
    methods: {
        ...mapActions({ componentErrorHandler: 'componentErrorHandler' }),
        ...mapMutations({ processingDataSwitch: 'processingDataSwitch' }),
        sendGroupMessage: function() {
            this.processingDataSwitch(true);
            let option = {
                method: 'post',
                url: 'http://upgi.ddns.net:9001/broadcast',
                data: {
                    chat_id: this.chat.id,
                    text: `${this.groupMessage}\n\n${this.userData.NAME} 發送`,
                    token: this.bot.token
                }
            };
            axios(option)
                .then((result) => {
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

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
