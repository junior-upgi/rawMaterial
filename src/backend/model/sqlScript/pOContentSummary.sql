SELECT
    d.pOId
    ,d.CUS_NO
    ,f.CUST_SNM
    ,f.CUST_NAME
    ,d.PRD_NO
    ,f.PRDT_SNM
    ,d.typeId
    ,f.specification
    ,d.requestShipmentCount
    ,e.pendingShipmentCount
    ,d.totalRequestedWeight
    ,d.totalReceivedWeight
FROM (
    -- count shipments attached to valid PO and summarize weight columns
    SELECT c.pOId ,c.CUS_NO ,c.PRD_NO ,c.typeId
        ,COUNT(*) AS requestShipmentCount
        ,SUM(c.requestWeight) AS totalRequestedWeight
        ,SUM(c.receivedWeight) AS totalReceivedWeight
    FROM (
        -- list shipments attached to valid PO and weight columns
        SELECT a.pOId ,a.CUS_NO ,a.PRD_NO ,a.typeId ,a.requestWeight
            ,CASE
                WHEN (ISNULL(a.supplierWeight,0)<=ISNULL(a.actualWeight,0)) THEN ISNULL(a.supplierWeight,0)
                ELSE ISNULL(a.actualWeight,0)
                END AS receivedWeight
        FROM rawMaterial.dbo.shipment a LEFT JOIN rawMaterial.dbo.purchaseOrder b ON a.pOId=b.id
        WHERE a.deprecated IS NULL AND a.pOId IS NOT NULL AND b.deprecated IS NULL) AS c
    GROUP BY c.pOId,c.CUS_NO,c.PRD_NO,c.typeId) AS d
    LEFT JOIN (
    -- get a pending shipment count grouped by material type on each activePO's
    SELECT c.pOId ,c.CUS_NO ,c.PRD_NO ,c.typeId ,COUNT(*) AS pendingShipmentCount
    FROM (
        -- list pending shipments that's attached to valid PO
        SELECT a.pOId ,a.CUS_NO ,a.PRD_NO ,a.typeId ,a.receivedDate
        FROM rawMaterial.dbo.shipment a LEFT JOIN rawMaterial.dbo.purchaseOrder b ON a.pOId=b.id
        WHERE a.deprecated IS NULL AND a.pOId IS NOT NULL AND b.deprecated IS NULL AND a.receivedDate IS NULL) AS c
    GROUP BY c.pOId,c.CUS_NO,c.PRD_NO,c.typeId) AS e ON d.pOId=e.pOId
    LEFT JOIN rawMaterial.dbo.rawMaterialSpecDetail AS f ON (d.CUS_NO=f.CUS_NO) AND (d.PRD_NO=f.PRD_NO) AND (d.typeId=f.typeId);
