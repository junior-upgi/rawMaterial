const bodyParser = require('body-parser');
const express = require('express');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.get('/data/shipment/dailySummary', tokenValidation, function(request, response, next) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.dailyPlanScheduleSummary')
        .then((resultset) => {
            return response.status(200).json({ scheduleSummary: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料每日進貨預約相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.route('/data/shipment')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.select('*')
            .from('rawMaterial.dbo.planSchedule')
            .where('deprecated', null)
            .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('requestDate')
            .then((resultset) => {
                return response.status(200).json({ shipmentSchedule: resultset });
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `原料進貨預約相關資料讀取發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    })
    .post(function(request, response, next) {
        let responseObject = {
            shipmentSchedule: null,
            scheduleSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        let requestList = [];
        for (let index = 0; index < request.body.quantity; index++) {
            requestList.push(knex('rawMaterial.dbo.shipmentRequest')
                .insert({
                    requestDate: request.body.requestDate,
                    CUS_NO: request.body.CUS_NO,
                    PRD_NO: request.body.PRD_NO,
                    typeId: request.body.typeId,
                    quantity: 1,
                    created: utility.currentDatetimeString(),
                    modified: utility.currentDatetimeString()
                })
            );
        }
        Promise.all(requestList)
            .then(() => {
                return knex.select('*')
                    .from('rawMaterial.dbo.planSchedule')
                    .where('deprecated', null)
                    .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('requestDate');
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return knex.select('*').from('rawMaterial.dbo.dailyPlanScheduleSummary');
            })
            .then((resultset) => {
                responseObject.scheduleSummary = resultset;
                knex.destroy();
                return response.status(200).json(responseObject);
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `新增原料進貨預約作業發生錯誤: ${error}`)
                );
            });
    })
    .delete(function(request, response, next) {
        let responseObject = {
            shipmentSchedule: null,
            scheduleSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.shipmentRequest')
            .update({
                modified: utility.currentDatetimeString(),
                deprecated: utility.currentDatetimeString()
            })
            .where('requestDate', '=', request.body.requestDate)
            .andWhere('CUS_NO', '=', request.body.CUS_NO)
            .andWhere('PRD_NO', '=', request.body.PRD_NO)
            .andWhere('typeId', '=', request.body.typeId)
            .then(() => {
                return knex.select('*')
                    .from('rawMaterial.dbo.planSchedule')
                    .where('deprecated', null)
                    .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('requestDate');
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return knex.select('*').from('rawMaterial.dbo.dailyPlanScheduleSummary');
            })
            .then((resultset) => {
                responseObject.scheduleSummary = resultset;
                return response.status(200).json(responseObject);
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `取消原料進貨預約作業發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    });

module.exports = router;
