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
                utility.logger.error(`token validation failure: ${error}`);
                return response.status(403).json({
                    errorMessage: error.message
                });
            }
            next();
        });
    } else { // if there is no token, return an error
        utility.logger.error('token does not exist');
        return response.status(403).json({
            errorMessage: 'token does not exist'
        });
    }
};
