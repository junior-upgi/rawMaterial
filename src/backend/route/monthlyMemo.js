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
                if (recordset.length === 0) {
                    utility.logger.info('if record does not exist, return a mock object simulate empty record');
                    return response.status(200).json([{
                        year: parseInt(request.params.year),
                        month: parseInt(request.params.month) + 1,
                        content: null
                    }]);
                } else {
                    return response.status(200).json(recordset);
                }
            }).catch(function(error) {
                utility.logger.error(`GET /monthlyMemo route failure: ${error}`);
                return response.status(500).json({ errorMessage: `GET /monthlyMemo route failure: ${error}` });
            });
    })
    .post(function(request, response, next) {
        utility.logger.info('delete any existing record of the same year/month');
        let queryString = `DELETE FROM rawMaterial.dbo.monthlyMemo WHERE year=${request.params.year} AND month=${parseInt(request.params.month) + 1};`;
        utility.performQuery(queryString)
            .then(function() {
                utility.logger.info('check the memo content');
                if (request.body.content !== '') {
                    utility.logger.info('if the content is non-empty, insert a new record and continue');
                    queryString = `INSERT INTO rawMaterial.dbo.monthlyMemo VALUES(${request.params.year},${parseInt(request.params.month) + 1},'${request.body.content}');`;
                    return utility.performQuery(queryString);
                } else {
                    utility.logger.info('if the content is empty, return a mock object simulate empty record');
                    return response.status(200).json([{
                        year: parseInt(request.params.year),
                        month: parseInt(request.params.month) + 1,
                        content: null
                    }]);
                }
            }).then(function() {
                utility.logger.info('extract record again to ensure it\'s correct and return');
                queryString = `SELECT TOP(1) * FROM rawMaterial.dbo.monthlyMemo WHERE year=${request.params.year} AND month=${parseInt(request.params.month) + 1};`;
                return utility.performQuery(queryString);
            }).then(function(recordset) {
                return response.status(200).json(recordset);
            }).catch(function(error) {
                utility.logger.error(`POST /monthlyMemo route failure: ${error}`);
                return response.status(500).json({ errorMessage: `POST /monthlyMemo route failure: ${error}` });
            });
    });

module.exports = router;
