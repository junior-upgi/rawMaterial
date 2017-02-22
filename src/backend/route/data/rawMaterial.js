const express = require('express');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();

router.route('/data/rawMaterial')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.select('*').from('rawMaterial.dbo.rawMatSpecDetail').orderBy('sequentialIndex')
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

router.get('/data/rawMaterial/supplyingSpecList', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.supplyingSpecList')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        })
        .orderBy('CUS_NO')
        .orderBy('PRD_NO')
        .orderBy('typeId')
        .then((resultset) => {
            return response.status(200).json({ supplyingSpecList: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料進貨規格列表相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.route('/data/rawMaterial/knownList')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.select('*').from('rawMaterial.dbo.knownRawMatDetail')
            .then((resultset) => {
                return response.status(200).json({ rawMatTypeList: resultset });
            })
            .catch((error) => {
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
