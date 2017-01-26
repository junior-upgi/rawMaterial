import axios from 'axios';
import { mapGetters, mapActions, mapMutations } from 'vuex';

import { store } from './store/store.js';
import { serverUrl } from '../js/config.js';

export default {
    name: 'loginComponent',
    store: store,
    data: function() {
        return {
            loginId: null,
            password: null
        };
    },
    computed: {
        ...mapGetters({
            token: 'getToken',
            role: 'getRole'
        })
    },
    mounted: function() { this.updateStatusMessage('請輸入帳號密碼進行登入'); },
    methods: {
        ...mapMutations({
            updateStatusMessage: 'updateStatusMessage',
            restoreToken: 'restoreToken',
            redirectUser: 'redirectUser',
            initYearList: 'initYearList',
            resetStore: 'resetStore'
        }),
        ...mapActions({
            checkDataAvailibility: 'checkDataAvailibility'
        }),
        submitForm: function() {
            if (document.getElementById('loginForm').checkValidity()) {
                this.updateStatusMessage('檢視帳號檢視中，請稍後...');
                axios.post(`${serverUrl}/login`, {
                    loginId: this.loginId,
                    password: this.password
                }).then((response) => {
                    this.password = '';
                    this.updateStatusMessage('登入成功，請稍待...');
                    sessionStorage.token = response.data.token;
                    this.restoreToken(sessionStorage.token);
                    return this.checkDataAvailibility();
                }).then((response) => {
                    this.updateStatusMessage('進行歷史資料確認...');
                    this.initYearList(response.data);
                    this.updateStatusMessage('歷史資料確認完畢，準備進入作業程式...');
                    this.redirectUser(this.role);
                }).catch((error) => {
                    this.updateStatusMessage(`登入初始化發生錯誤，請向IT反應 (錯誤: ${error})。請重新登入...`);
                    this.resetStore();
                });
            }
        }
    },
    template: `
        <div class="container">
            <div class="row">
                <div class="page-header">
                    <h2>統義玻璃股份有限公司&nbsp;<small>原料採購進貨控管系統登入頁面</small></h2>
                </div>
            </div>
            <div class="row">
                <form id="loginForm" class="form-horizontal" v-on:submit.prevent>
                    <div class="form-group">
                        <label for="loginId" class="col-xs-3 col-lg-2 control-label text-right">使用者帳號</label>
                        <div class="col-xs-8 col-lg-2">
                            <input name="loginId" type="text" class="form-control" placeholder="使用者帳號" required v-model="loginId" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="col-xs-3 col-lg-2 control-label text-right">密碼</label>
                        <div class="col-xs-8 col-lg-2">
                            <input name="password" type="password" class="form-control" placeholder="密碼" required v-model="password" />
                        </div>
                    </div>
                    <div class="btn-group col-xs-offset-3 col-xs-offset-2" role="group">
                        <button type="submit" class="btn btn-default btn-lg" v-on:click="submitForm">登入</button>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="reset" class="btn btn-default btn-lg">重設</button>
                    </div>
                </form>
            </div>
            <br>
            <br>
        </div>`
};
