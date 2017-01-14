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
