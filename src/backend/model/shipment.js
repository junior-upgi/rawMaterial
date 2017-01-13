const express = require('express');

const utility = require('../module/utility.js');

const router = express.Router();

router.get('/shipment/:year/:month', function(request, response) { // serve shipment data of a specific month
    let year = request.params.year;
    let month = request.params.month;
    let startDate = `${request.params.year}-${request.params.month}-${(new Date(year, month - 1, 1)).getDate().toString()}`;
    let endDate = `${request.params.year}-${request.params.month}-${(new Date(year, month - 1, 0)).getDate().toString()}`;
    let queryString = `SELECT * FROM rawMaterial.dbo.shipment WHERE date BETWEEN '${startDate}' AND '${endDate}' AND isValid=1 ORDER BY date;`;
    utility.executeQuery(queryString, function(recordset, error) {
        if (error) {
            utility.logger.error(`unable to get specific monthly shipment records: ${error}`);
            return response.status(500).json([]);
        }
        return response.status(200).json(recordset);
    });
});

module.exports = router;
