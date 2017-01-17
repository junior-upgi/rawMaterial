const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');

const serverConfig = require('../module/serverConfig.js');
const systemPrivilege = require('../model/systemPrivilege.js');
const telegramUser = require('../model/telegramUser');
const utility = require('../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.post('/login', function(request, response) {
    utility.logger.info(`received login request from ${request.body.loginId}`);
    let ldapClient = ldap.createClient({ url: serverConfig.ldapServerUrl });
    ldapClient.bind(`uid=${request.body.loginId},ou=user,dc=upgi,dc=ddns,dc=net`, request.body.password, function(error) {
        if (error) {
            utility.logger.error(`LDAP validation failure: ${error.lde_message}`);
            return response.status(403).json({ errorMessage: error.lde_message });
        }
        ldapClient.unbind(function(error) {
            if (error) {
                utility.logger.error(`LDAP server separation failure: ${error.lde_message}`);
                utility.sendMessage([telegramUser.getUserID('蔡佳佑')], [`LDAP server separation failure: ${error.lde_message}`]);
            }
            utility.logger.info(`${request.body.loginId} account info validated, checking access rights`);
            // continue to check if user has rights to access the website of the system selected
            if (!systemPrivilege.checkMembership(request.body.loginId)) {
                utility.logger.error('account does not have privilege data');
                return response.status(403).json({ errorMessage: '此帳號尚未設定原料採購進貨系統使用權限' });
            } else {
                utility.logger.info(`${request.body.loginId} ${request.body.systemID} access privilege validated`);
                let payload = {
                    loginId: request.body.loginId,
                    role: systemPrivilege.getRole(request.body.loginId)
                };
                let token = jwt.sign(payload, serverConfig.passphrase, { expiresIn: 3600 });
                utility.logger.info(`${request.body.loginId} login procedure completed`);
                return response.status(200).json({ token: token });
            }
        });
    });
});

module.exports = router;
