import { systemReference } from './config.js';
import { displayLoginForm } from './login.js';

$('document').ready(function() {
    // check if login token existence
    if (sessionStorage.rawMaterialToken === undefined) {
        displayLoginForm();
    } else {
        console.log(systemReference);
        console.log(sessionStorage.rawMaterialToken);
    }
});
