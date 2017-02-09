const jwt = require('jsonwebtoken');

const serverConfig = require('../module/serverConfig.js');
const utility = require('../module/utility.js');

// middleware func declaration for token validation
module.exports = function(request, response, next) {
    // get the full request route
    let requestRoute = `${request.protocol}://${request.get('Host')}${request.originalUrl}`;
    utility.logger.info(`conducting token validation on ${requestRoute}`);
    // check request for token
    let accessToken =
        (request.body && request.body.accessToken) ||
        (request.query && request.query.accessToken) ||
        request.headers['x-access-token'];
    if (accessToken) { // if a token is found
        jwt.verify(accessToken, serverConfig.passphrase, function(error, decodedToken) {
            if (error) {
                return response.status(403).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `帳號使用權限發生錯誤: ${error.message}`)
                );
            }
            utility.logger.info('credential is valid...');
            next();
        });
    } else { // if there is no token, return an error
        return response.status(403).json(
            utility.endpointErrorHandler(
                request.method,
                request.originalUrl,
                '認證遺失，請重新登入')
        );
    }
};
