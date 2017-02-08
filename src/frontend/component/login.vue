<script>
    import axios from 'axios';

    import { serverUrl } from '../clientConfig.js';

    export default {
        name: 'login',
        data: function() {
            return {
                loginId: '',
                password: ''
            };
        },
        methods: {
            login() {
                if (document.getElementById('loginForm').checkValidity()) {
                    axios.post(`${serverUrl}/login`, {
                        loginId: this.loginId,
                        password: this.password
                    }).then((response) => {
                        this.password = '';
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
        }
    };

</script>

<template>
    <form id="loginForm" v-on:submit.prevent>
        <div class="form-group">
            <input class="form-control" name="loginId" type="text" placeholder="使用者帳號" v-model="loginId" required />
        </div>
        <div class="form-group">
            <input class="form-control"  name="password" type="password" placeholder="密碼" v-model="password" required />
        </div>
        <div class="form-group">
            <button class="btn btn-lg" type="submit" v-on:click="login">登入</button>
            <button class="btn btn-lg" type="btn btn-lg reset">重設</button>
        </div>
    </form>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
