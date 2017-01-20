const express = require('express');

const tokenValidation = require('../middleware/tokenValidation.js');

const utility = require('../module/utility');

const router = express.Router();

router.get('/data/rawMaterialSpecDetail', tokenValidation, function(request, response) {
    let queryString = 'SELECT * FROM rawMaterial.dbo.rawMaterialSpecDetail ORDER BY sequentialIndex;';
    utility.performQuery(queryString)
        .then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/rawMaterialSpecDetail route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/rawMaterialSpecDetail route failure: ${error}` });
        });
});

module.exports = router;
