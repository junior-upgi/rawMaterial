/*
const express = require('express');
const serverConfig = require('../../module/serverConfig.js');
const knex = require('knex')(serverConfig.mssqlConfig);

const router = express.Router();

router.get('/data/rawMaterial/Basic', function(request, response) {
    knex.select('*')
        .from('rawMaterial.dbo.knownRawMatId')
        .leftJoin('DB_U105.dbo.PRDT')
        .then((resultset) => {
            return response.status(200).json(resultset);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => { knex.destroy(); });
});
module.exports = router;
*/
