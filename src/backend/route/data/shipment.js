const bodyParser = require('body-parser');
const express = require('express');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.get('/data/shipment/tonnageSummary', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.tonnageSummary')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        })
        .orderBy('CUS_NO')
        .orderBy('PRD_NO')
        .then((resultset) => {
            return response.status(200).json({ tonnageSummary: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料進貨重量概況相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/shipment/overview', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.shipmentOverview')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        })
        .orderBy('CUS_NO')
        .orderBy('PRDT_SNM')
        .orderBy('workingDate')
        .then((resultset) => {
            return response.status(200).json({ shipmentOverview: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料進貨概況相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

function dailyPlanScheduleSummary(knexObj, workingYear, workingMonth) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.dailyPlanScheduleSummary')
        .where({
            workingYear: workingYear,
            workingMonth: workingMonth
        })
        .orderBy('workingDate')
        .orderBy('received', 'DESC');
}

function planSchedule(knexObj, workingYear, workingMonth) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.planSchedule')
        .where({
            workingYear: workingYear,
            workingMonth: workingMonth
        })
        .orderBy('PRD_NO')
        .orderBy('CUS_NO')
        .orderBy('requestDate');
}

router.get('/data/shipment/dailySummary', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    dailyPlanScheduleSummary(knex, request.query.workingYear, request.query.workingMonth)
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
        planSchedule(knex, request.query.workingYear, request.query.workingMonth)
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
                return planSchedule(knex, request.body.workingYear, request.body.workingMonth);
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return dailyPlanScheduleSummary(knex, request.body.workingYear, request.body.workingMonth);
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
        let condition = request.body.id !== null ? {
            id: request.body.id
        } : {
            requestDate: request.body.requestDate,
            CUS_NO: request.body.CUS_NO,
            PRD_NO: request.body.PRD_NO,
            typeId: request.body.typeId,
            arrivalDate: null,
            supplierWeight: null,
            actualWeight: null,
            deprecated: null
        };
        knex('rawMaterial.dbo.shipmentRequest')
            .update({
                modified: utility.currentDatetimeString(),
                deprecated: utility.currentDatetimeString()
            })
            .where(condition)
            .then(() => {
                return planSchedule(knex, request.body.workingYear, request.body.workingMonth);
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return dailyPlanScheduleSummary(knex, request.body.workingYear, request.body.workingMonth);
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
    })
    .put(function(request, response, next) {
        let responseObject = {
            shipmentSchedule: null,
            scheduleSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.shipmentRequest')
            .update({
                arrivalDate: request.body.arrivalDate,
                actualWeight: request.body.actualWeight,
                supplierWeight: request.body.supplierWeight,
                note: request.body.note,
                modified: utility.currentDatetimeString()
            })
            .where({ id: request.body.id })
            .then(() => {
                return planSchedule(knex, request.body.workingYear, request.body.workingMonth);
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return dailyPlanScheduleSummary(knex, request.body.workingYear, request.body.workingMonth);
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
                        `原料進廠資料寫入發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    });

module.exports = router;
