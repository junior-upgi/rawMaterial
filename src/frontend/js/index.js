import { viewFileSourceUrl } from './config.js';
import { displayLoginForm } from './login.js';

$('document').ready(function() {
    // check if login token existence
    if (sessionStorage.token === undefined) {
        displayLoginForm();
    } else {
        $('body').empty().load(`${viewFileSourceUrl}/${sessionStorage.role}.html`);
    }
});
