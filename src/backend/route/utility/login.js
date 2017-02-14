const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');

const serverConfig = require('../../module/serverConfig.js');
const utility = require('../../module/utility.js');
const errorHandler = utility.endpointErrorHandler;

const router = express.Router();
router.use(bodyParser.json());

router.post('/login', function(request, response) {
    utility.logger.info(`received login request from ${request.body.loginId}`);
    let method = request.method;
    let url = request.originalUrl;
    let ldapClient = ldap.createClient({ url: serverConfig.ldapServerUrl });
    ldapClient.bind(`uid=${request.body.loginId},ou=user,dc=upgi,dc=ddns,dc=net`, request.body.password, function(error) {
        if (error) {
            return response.status(403).json(errorHandler(method, url, `LDAP validation failure: ${error.lde_message}`));
        }
        ldapClient.unbind((error) => {
            if (error) {
                return response.status(403).json(errorHandler(method, url, `LDAP server separation failure: ${error.lde_message}`));
            }
            utility.logger.info(`${request.body.loginId} account info validated, checking access rights`);
            // continue to check if user has rights to access the website of the system selected
            let knex = require('knex')(serverConfig.mssqlConfig);
            knex.select('*').from('rawMaterial.dbo.privilegeDetail').where({ SAL_NO: request.body.loginId })
                .then((resultset) => {
                    if (resultset.length === 0) {
                        return response.status(403).json(errorHandler(method, url, '此帳號尚未設定原料採購進貨系統使用權限'));
                    } else {
                        utility.logger.info(`${request.body.loginId} ${serverConfig.systemReference} access privilege validated`);
                        let payload = resultset[0];
                        payload.loginId = request.body.loginId;
                        let token = jwt.sign(payload, serverConfig.passphrase, { expiresIn: 3600 });
                        utility.logger.info(`${request.body.loginId} login procedure completed`);
                        return response.status(200).json({ token: token });
                    }
                })
                .catch((error) => {
                    return response.status(500).json(errorHandler(method, url, '帳號權限資料讀取失敗'));
                })
                .finally(() => {
                    knex.destroy();
                });
        });
    });
});

module.exports = router;
