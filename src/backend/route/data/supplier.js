const bodyParser = require('body-parser');
const express = require('express');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.get('/data/supplier/pONotice', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.pONotice')
        .where({ CUS_NO: request.query.CUS_NO })
        .orderBy('CUS_NO')
        .orderBy('lineNumber')
        .debug(false)
        .then((resultset) => {
            return response.status(200).json(resultset);
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `廠商訂單備註資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/supplier', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.supplier')
        .debug(false)
        .then((resultset) => {
            return response.status(200).json({ supplierList: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `廠商基本資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/supplier/workingMaterial', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.workingMaterial')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        }).debug(false)
        .then((resultset) => {
            return response.status(200).json({ workingMaterial: resultset });
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `進貨廠商相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

module.exports = router;
