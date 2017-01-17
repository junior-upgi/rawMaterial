import $ from 'jquery';
import { decode } from 'jsonwebtoken';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

import { bus } from './index.js';

import { serverUrl } from '../js/config.js';

export const loginComponent = {
    name: 'login-template',
    template: `
        <div class="container">
            <div class="row">
                <div class="page-header">
                    <h1>統義玻璃股份有限公司&nbsp;<small>原料管控系統登入頁面</small></h1>
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
            <div>{{ statusMessage }}</div>
        </div>`,
    data: function() {
        return {
            loginId: '',
            password: '',
            statusMessage: '請輸入帳號密碼進行登入'
        };
    },
    methods: {
        submitForm: function() {
            if ($('form#loginForm')[0].checkValidity()) {
                this.statusMessage = '檢視帳號檢視中，請稍後...';
                Vue.http.post(`${serverUrl}/login`, {
                    loginId: this.loginId,
                    password: this.password
                }).then((response) => {
                    this.password = '';
                    response.json().then((response) => {
                        this.statusMessage = '登入成功，請稍待...';
                        this.$emit('user-validated', response.token);
                    });
                }, (error) => {
                    error.json().then((error) => { this.statusMessage = error.errorMessage; });
                    this.password = '';
                });
            }
        }
    }
};
