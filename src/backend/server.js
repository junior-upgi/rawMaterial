const bodyParser = require('body-parser');
const cors = require('cors');
// const CronJob = require('cron').CronJob;
const express = require('express');
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');
const moment = require('moment-timezone');
const morgan = require('morgan');
// const httpRequest = require('request-promise');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

const upgiSystem = require('./model/upgiSystem.js');
const systemPrivilege = require('./model/systemPrivilege.js');
const telegramUser = require('./model/telegramUser.js');
// const telegramBot = require('./model/telegramBot.js');

let app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// app.use(favicon(__dirname + '/../src/frontend/upgiLogo.png')); // middleware to serve favicon
app.use(favicon(__dirname + '/../public/upgiLogo.png')); // middleware to serve favicon
app.use(`/${serverConfig.systemReference}`, express.static('./public')); // serve static files
app.use(`/${serverConfig.systemReference}/bower_components`, express.static('./bower_components')); // serve static files

app.get(`/${serverConfig.systemReference}/status`, function(request, response) {
    return response.status(200).json({
        system: serverConfig.systemReference,
        status: 'online',
        timestamp: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    });
});

app.get(`/${serverConfig.systemReference}/systemList`, function(request, response) { // serve system information
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

// middleware for token validation, anything blow this point will subject to this function
app.use(function(request, response, next) {
    // get the full request route
    let requestRoute = `${request.protocol}://${request.get('Host')}${request.originalUrl}`;
    // check request for token
    let accessToken =
        (request.body && request.body.accessToken) ||
        (request.query && request.query.accessToken) ||
        request.headers['x-access-token'];
    if (accessToken) { // if a token is found
        jwt.verify(accessToken, serverConfig.passphrase, function(error, decodedToken) {
            if (error) {
                utility.logger.error(`token validation failure: ${error}`);
                return response.status(403).redirect({
                    error: error
                });
            }
            utility.logger.info('token is valid, checking access privilege');
            let loginID = decodedToken.loginID;
            let systemID = decodedToken.systemID;
            if (systemPrivilege.checkRoutePriv(loginID, systemID, requestRoute)) {
                next();
            } else {
                utility.logger.error('user does not have access privilege');
                return response.status(403).json({
                    error: 'user does not access privilege'
                });
            }
        });
    } else { // if there is no token, return an error
        utility.logger.error('token does not exist');
        return response.status(403).json({
            error: 'token does not exist'
        });
    }
});

app.get(`/${serverConfig.systemReference}/test`, function(request, response) {
    return response.status(200).json({
        message: 'passed the test'
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
