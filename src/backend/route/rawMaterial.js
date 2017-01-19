const express = require('express');

const tokenValidation = require('../middleware/tokenValidation.js');

const utility = require('../module/utility');

const router = express.Router();

router.get('/data/rawMaterialSpecDetail', tokenValidation, function(request, response) {
    let queryString = 'SELECT * FROM rawMaterial.dbo.rawMaterialSpecDetail ORDER BY sequentialIndex;';
    utility.executeQuery(queryString, function(recordset, error) {
        if (error) {
            utility.logger.error(`specDetailList route failure: ${error}`);
            return response.status(500).json({ errorMessage: error });
        }
        return response.status(200).json(recordset);
    });
});

module.exports = router;
