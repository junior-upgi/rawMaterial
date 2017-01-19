import { decode } from 'jsonwebtoken';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import { mapMutations } from 'vuex';

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
    mounted: function() {
        this.updateStatusMessage('請輸入帳號密碼進行登入');
    },
    methods: {
        ...mapMutations({
            updateStatusMessage: 'updateStatusMessage',
            restoreToken: 'restoreToken',
            redirectUser: 'redirectUser'
        }),
        submitForm: function() {
            if (document.getElementById('loginForm').checkValidity()) {
                this.updateStatusMessage('檢視帳號檢視中，請稍後...');
                Vue.http.post(`${serverUrl}/login`, {
                    loginId: this.loginId,
                    password: this.password
                }).then((response) => {
                    this.password = '';
                    response.json().then((response) => {
                        this.updateStatusMessage('登入成功，請稍待...');
                        sessionStorage.token = response.token;
                        this.restoreToken(sessionStorage.token);
                        this.redirectUser(decode(sessionStorage.token, { complete: true }).payload.role);
                    });
                }, (error) => {
                    this.loginId = '';
                    this.password = '';
                    error.json().then((error) => {
                        this.updateStatusMessage(`請重新登入 (錯誤: ${error.errorMessage})`);
                    });
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
