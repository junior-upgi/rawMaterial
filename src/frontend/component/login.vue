<script>
    import axios from 'axios';
    import { mapActions, mapMutations } from 'vuex';
    import { store } from '../store/store.js';

    import { serverUrl } from '../clientConfig.js';

    export default {
        name: 'login',
        store: store,
        computed: {},
        data: function() {
            return {
                loginId: '',
                password: '',
                statusMessage: null
            };
        },
        methods: {
            ...mapActions({ initData: 'initData' }),
            ...mapMutations({
                redirectUser: 'redirectUser',
                resetStore: 'resetStore',
                restoreToken: 'restoreToken'
            }),
            login() {
                if (document.getElementById('loginForm').checkValidity()) {
                    axios.post(`${serverUrl}/login`, {
                        loginId: this.loginId,
                        password: this.password
                    }).then((response) => {
                        this.password = '';
                        sessionStorage.token = response.data.token;
                        this.restoreToken(sessionStorage.token);
                        alert('登入成功，確認後將轉向作業程式模組...');
                        this.initData();
                        this.redirectUser();
                    }).catch((error) => {
                        this.password = '';
                        this.resetStore();
                        // console.log(error);
                        alert('登入失敗，請檢查帳號密碼是否正確並重新登入...');
                    });
                }
            },
            initData
        }
    };

</script>

<template>
    <div>
        <br>
        <form id="loginForm" v-on:submit.prevent>
            <div class="form-group">
                <input class="form-control col-3" name="loginId" type="text" placeholder="使用者帳號" v-model="loginId" required />
            </div>
            <div class="form-group">
                <input class="form-control col-3" name="password" type="password" placeholder="密碼" v-model="password" required />
            </div>
            <div class="form-group">
                <button class="btn btn-lg" type="submit" v-on:click="login">登入</button>
                <button class="btn btn-lg" type="btn btn-lg reset">重設</button>
            </div>
        </form>
    </div>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
