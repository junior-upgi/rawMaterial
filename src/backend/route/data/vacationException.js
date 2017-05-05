const express = require('express');

const router = express.Router();
const serverConfig = require('../../serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../utility.js');

router.route('/data/vacationException')
    .all(tokenValidation)
    .get(function (request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.vacationException')
            .select(knex.raw('CONVERT(CHAR(10),exceptionDate,126) AS exceptionDate, flag, CUS_NO'))
            .orderBy('exceptionDate').debug(false)
            .then((resultset) => {
                return response.status(200).json({ vacationException: resultset });
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `特殊假日設定資料讀取發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    });

module.exports = router;
