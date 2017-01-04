import { viewFileSourceUrl } from './config.js';
import { displayLoginForm } from './login.js';
import { adminTest } from './admin.js';
import { blackListedTest } from './blackListed.js';
import { furnaceStaffTest } from './furnaceStaff.js';
import { purchasingStaffTest } from './purchasingStaff.js';
import { supplierTest } from './supplier.js';

const branchTest = {
    admin: adminTest,
    blackListed: blackListedTest,
    furnaceStaff: furnaceStaffTest,
    purchasingStaff: purchasingStaffTest,
    supplier: supplierTest
};

$('document').ready(function() {
    // check if login token existence
    if (sessionStorage.token === undefined) {
        displayLoginForm();
    } else {
        $('body').empty().load(`${viewFileSourceUrl}/${sessionStorage.role}.html`);
        branchTest[sessionStorage.role]();
    }
});
