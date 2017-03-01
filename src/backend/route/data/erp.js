// const bodyParser = require('body-parser');
const express = require('express');
// const Treeize = require('treeize');
// const uuidV4 = require('uuid/v4');
// const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
// const utility = require('../../module/utility.js');

const router = express.Router();
// router.use(bodyParser.json());

router.route('/data/erp/pss')
    .all(tokenValidation)
    .put(function(request, response, next) {
        return response.status(200).end();
    });

module.exports = router;
