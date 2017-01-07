const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');
const moment = require('moment-timezone');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const tokenValidation = require('./module/tokenValidation.js');
const utility = require('./module/utility.js');

const rawMaterial = require('./model/rawMaterial.js');
const systemPrivilege = require('./model/systemPrivilege.js');
const telegramUser = require('./model/telegramUser.js');
// const telegramBot = require('./model/telegramBot.js');
const upgiSystem = require('./model/upgiSystem.js');

let app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// app.use(favicon(__dirname + '/../src/frontend/upgiLogo.png')); // middleware to serve favicon
app.use(favicon(__dirname + '/../public/upgiLogo.png')); // middleware to serve favicon
app.use(`/${serverConfig.systemReference}`, express.static(__dirname + '/../public')); // serve static files
app.use(`/${serverConfig.systemReference}/bower_components`, express.static(__dirname + '/../bower_components')); // serve static files

app.get(`/${serverConfig.systemReference}/status`, function(request, response) { // serve system status
    return response.status(200).json({
        hostname: serverConfig.serverHostname,
        system: serverConfig.systemReference,
        status: 'online',
        timestamp: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    });
});

app.get(`/${serverConfig.systemReference}/systemList`, function(request, response) { // serve system accessibilty by this server
    return response.status(200).json(upgiSystem.list);
});

app.post(`/${serverConfig.systemReference}/login`, function(request, response) { // handles login requests
    utility.logger.info(`received login request from ${request.body.loginID}`);
    let ldapClient = ldap.createClient({ url: serverConfig.ldapServerUrl });
    ldapClient.bind(`uid=${request.body.loginID},ou=user,dc=upgi,dc=ddns,dc=net`, request.body.password, function(error) {
        if (error) {
            utility.logger.error(`LDAP validation failure: ${error.lde_message}`);
            return response.status(403).json({
                errorMessage: error.lde_message
            });
        }
        ldapClient.unbind(function(error) {
            if (error) {
                utility.logger.error(`LDAP server separation failure: ${error.lde_message}`);
                utility.sendMessage([telegramUser.getUserID('蔡佳佑')], [`LDAP server separation failure: ${error.lde_message}`]);
            }
            utility.logger.info(`${request.body.loginID} account info validated, checking access rights`);
            // continue to check if user has rights to access the website of the system selected
            let userPrivObject = systemPrivilege.list.filter(function(privObject) {
                return privObject.erpID === request.body.loginID;
            });
            if (userPrivObject.length !== 1) {
                utility.logger.info(`userPrivObject.length: ${userPrivObject.length}`);
                return response.status(403).json({
                    errorMessage: '此帳號沒有使用權限'
                });
            } else {
                let systemMembershipObject = userPrivObject[0].membershipList.filter(function(membershipObject) {
                    return membershipObject.systemID === parseInt(request.body.systemID);
                });
                if (systemMembershipObject.length !== 1) {
                    utility.logger.info(`systemMembershipObject.length: ${systemMembershipObject.length}`);
                    return response.status(403).json({
                        errorMessage: '此帳號沒有使用權限'
                    });
                }
                utility.logger.info(`${request.body.loginID} ${request.body.systemID} access privilege validated`);
                let payload = {
                    loginID: request.body.loginID,
                    systemID: request.body.systemID,
                    privilege: systemPrivilege.getPrivObject(request.body.loginID, request.body.systemID)
                };
                let token = jwt.sign(payload, serverConfig.passphrase, { expiresIn: systemMembershipObject[0].accessPeriod });
                utility.logger.info(`${request.body.loginID} login procedure completed`);
                return response.status(200).json({
                    token: token,
                    redirectUrl: function() {
                        return upgiSystem.list.filter(function(system) {
                            return system.id === parseInt(request.body.systemID);
                        })[0].frontendUrl;
                    }()
                });
            }
        });
    });
});

// serves raw material list
app.get(`/${serverConfig.systemReference}/rawMaterialList`, function(request, response) {
    return response.status(200).json(rawMaterial.list);
});

app.get(`/${serverConfig.systemReference}/validateToken`, tokenValidation, function(request, response) {
    return response.status(200).json({
        error: null
    });
});

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
    } else {
        utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
    }
});

utility.statusReport.start(); // start the server status reporting function
