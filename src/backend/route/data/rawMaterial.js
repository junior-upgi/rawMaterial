const express = require('express');
const serverConfig = require('../../serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../utility.js');

const router = express.Router();

router.get('/data/rawMaterial', tokenValidation, (request, response) => {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*').from('rawMaterial.dbo.rawMaterialSpecDetail').orderBy('sequentialIndex').debug(false)
        .then((resultset) => {
            return response.status(200).json({ rawMatList: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料細項相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/rawMaterial/knownList', tokenValidation, (request, response) => {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*').from('rawMaterial.dbo.knownRawMatDetail').debug(false)
        .then((resultset) => {
            return response.status(200).json({ rawMatTypeList: resultset });
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料類別相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

module.exports = router;
