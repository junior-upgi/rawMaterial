const Sequelize = require('sequelize');
const uuidV4 = require('uuid/v4');

const serverConfig = require('../module/serverConfig.js');

const sequelize = new Sequelize(
    serverConfig.systemReference,
    serverConfig.upgiSystemAccount,
    serverConfig.upgiSystemPassword, {
        dialect: 'mssql',
        timezone: serverConfig.workingTimezone,
        host: serverConfig.mssqlConfig.host,
        pool: { max: 5, min: 0, idle: 10000 }
    });

const Shipment = sequelize.define('shipment', {
    id: {
        type: Sequelize.UUID,
        defaultValue: function() {
            return uuidV4().toUpperCase();
        },
        primaryKey: true
    },
    requestDate: { type: Sequelize.DATEONLY, unique: 'compositeIndex', allowNull: false },
    CUS_NO: { type: Sequelize.STRING, unique: 'compositeIndex', allowNull: false },
    PRD_NO: { type: Sequelize.STRING, unique: 'compositeIndex', allowNull: false },
    typeId: { type: Sequelize.INTEGER, unique: 'compositeIndex', allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    note: { type: Sequelize.TEXT },
    arrivalDate: { type: Sequelize.DATEONLY },
    supplierWeight: { type: Sequelize.INTEGER },
    fullWeight: { type: Sequelize.INTEGER },
    emptyWeight: { type: Sequelize.INTEGER },
    created: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    modified: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    deprecated: { type: Sequelize.DATE }
}, {
    getterMethods: {
        requestYear: function() { return new Date(this.requestDate).getFullYear(); }
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deprecated',
    underscore: false,
    freezeTableName: true,
    tableName: 'shipment'
});

module.exports = { table: Shipment };