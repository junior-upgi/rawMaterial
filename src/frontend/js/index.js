import { decode } from 'jsonwebtoken';
import Vue from 'vue';

import { loginComponent } from '../js/login.js';

window.onload = function() {
    new Vue({
        el: '#app',
        components: {
            'login-template': loginComponent,
            'furnace-staff-template': { template: '<div>mock furnace staff template</div>' }
        },
        data: {
            token: null,
            loginId: null,
            role: null,
            testParent: 'abc'
        },
        methods: {
            userRedirect(token) {
                this.token = token;
                this.loginId = decode(token, { complete: true }).payload.loginId;
                this.role = decode(token, { complete: true }).payload.role;
            }
        }
    });
};

/*
import { serverUrl } from './config.js';

window.onload = function() {
    $.get(`${serverUrl}/template/login.html`)
        .then(function(loginTemplateHtml) {
            let loginTemplate = {
                template: loginTemplateHtml,
                methods: {
                    submitForm: function(event) {
                        console.log('submitClicked');
                    }
                }
            };
            new Vue({
                el: '#app',
                components: {
                    'login-template': loginTemplate,
                    'furnace-staff-template': { template: '<div>mock furnace staff template</div>' }
                },
                data: {
                    token: null,
                    role: null
                },
                methods: {
                    submitForm: function(event) {
                        alert(event);
                    }
                }
            });
        });
};
*/

/*
import { serverUrl } from './config.js';
import { displayLoginForm } from './login.js';

import { adminValidate } from './admin/entry.js';
import { blackListedValidate } from './blackListed/entry.js';
import { furnaceStaffValidate, furnaceInitInterface } from './furnaceStaff/entry.js';
import { purchasingStaffValidate } from './purchasingStaff/entry.js';
import { supplierValidate } from './supplier/entry.js';

const appBranchList = {
    admin: adminValidate,
    blackListed: blackListedValidate,
    furnaceStaff: furnaceStaffValidate,
    purchasingStaff: purchasingStaffValidate,
    supplier: supplierValidate
};

const initInterface = {
    furnaceStaff: furnaceInitInterface
};

$('document').ready(function() {
    // check if login token existence
    if (sessionStorage.token === undefined) {
        displayLoginForm();
    } else {
        $('body').empty().load(`${serverUrl}/view/${sessionStorage.role}.html`, function() {
            appBranchList[sessionStorage.role]();
            initInterface[sessionStorage.role]();
        });
    }
});
*/
