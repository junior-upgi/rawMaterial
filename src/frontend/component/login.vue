<template>
    <form id="loginForm" class="form" v-on:submit.prevent>
        <div class="form-group">
            <input class="form-control" name="loginId" type="text" placeholder="使用者帳號" v-model="loginId" required />
        </div>
        <div class="form-group">
            <input class="form-control" name="password" type="password" placeholder="密碼" v-model="password" required />
        </div>
        <button class="btn btn-lg" type="submit" v-on:click="login">登入</button>
        <button class="btn btn-lg" type="reset">重設</button>
    </form>
</template>

<script>
    import axios from 'axios';
    import { mapActions, mapMutations } from 'vuex';
    import { store } from '../store/store.js';

    import { serverUrl } from '../clientConfig.js';

    export default {
        name: 'login',
        store: store,
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
                buildStore: 'buildStore',
                redirectUser: 'redirectUser',
                resetStore: 'resetStore',
                restoreToken: 'restoreToken'
            }),
            login: function() {
                if (document.getElementById('loginForm').checkValidity()) {
                    axios.post(`${serverUrl}/login`, {
                        loginId: this.loginId,
                        password: this.password
                    }).then((response) => {
                        this.password = '';
                        sessionStorage.token = response.data.token;
                        this.restoreToken(sessionStorage.token);
                        return this.initData();
                    }).then((responseList) => {
                        this.buildStore(responseList);
                        this.redirectUser();
                    }).catch((error) => {
                        console.log(error);
                        this.password = '';
                        alert('登入失敗，請檢查帳號密碼是否正確並重新登入...');
                        this.resetStore();
                    });
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
