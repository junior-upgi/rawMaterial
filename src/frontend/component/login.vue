<script>
    import axios from 'axios';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import { store } from '../store/store.js';

    import { serverUrl } from '../clientConfig.js';

    export default {
        name: 'login',
        store: store,
        computed: { ...mapGetters({ userName: 'getUserName' }) },
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
            login: function() {
                if (document.getElementById('loginForm').checkValidity()) {
                    axios.post(`${serverUrl}/login`, {
                        loginId: this.loginId,
                        password: this.password
                    }).then((response) => {
                        this.password = '';
                        sessionStorage.token = response.data.token;
                        this.restoreToken(sessionStorage.token);
                        alert(`${this.userName}，歡迎登入，確認後將進入作業程式模組...`);
                        return this.initData();
                    }).then(() => {
                        this.redirectUser();
                    }).catch((error) => {
                        this.password = '';
                        this.resetStore();
                        // console.log(error.errorMessage);
                        alert('登入失敗，請檢查帳號密碼是否正確並重新登入...');
                    });
                }
            }
        }
    };

</script>

<template>
    <div class="row col-xs-10 col-sm-4">
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
    </div>
</template>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
