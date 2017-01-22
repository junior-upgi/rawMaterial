const bodyParser = require('body-parser');
const express = require('express');

const tokenValidation = require('../middleware/tokenValidation.js');
const utility = require('../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.route('/monthlyMemo/:year/:month')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let queryString = `SELECT TOP(1) * FROM rawMaterial.dbo.monthlyMemo WHERE year=${request.params.year} AND month=${parseInt(request.params.month) + 1};`;
        utility.performQuery(queryString)
            .then(function(recordset) {
                return response.status(200).json(recordset);
            }).catch(function(error) {
                utility.logger.error(`/monthlyMemo route failure: ${error}`);
                return response.status(500).json({ errorMessage: `/monthlyMemo route failure: ${error}` });
            });
    });

module.exports = router;
