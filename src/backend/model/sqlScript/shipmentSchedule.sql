SELECT
    a.id
    ,a.pOId
    ,CONVERT(CHAR(10),a.requestDate,126) AS 'requestDate'
    ,CONVERT(CHAR(10),a.receivedDate,126) AS 'receivedDate'
    ,CASE
        WHEN a.receivedDate IS NULL THEN CONVERT(CHAR(10),a.requestDate,126)
        ELSE CONVERT(CHAR(10),a.receivedDate,126)
        END AS 'workingDate'
    ,a.CUS_NO
    ,c.CUST_SNM
    ,c.CUST_NAME
    ,a.PRD_NO
    ,c.PRDT_SNM
    ,a.typeId
    ,c.specification
    ,a.unitPrice
    ,c.unitPrice AS 'referencePrice'
    ,c.currency
    ,a.requestWeight
    ,c.qtyPerShipment
    ,a.supplierWeight
    ,a.actualWeight
    ,a.note
    ,a.created
    ,a.deprecated
    ,b.id AS 'purchaseOrder:id'
    ,b.revisionNumber AS 'purchaseOrder:revisionNumber'
    ,b.originalPOId AS 'purchaseOrder:originalPOId'
    ,b.pONumber AS 'purchaseOrder:pONumber'
    ,b.contractType AS 'purchaseOrder:contractType'
    ,CONVERT(CHAR(10),b.documentDate,126) AS 'purchaseOrder:documentDate'
    ,b.workingYear AS 'purchaseOrder:workingYear'
    ,b.workingMonth AS 'purchaseOrder:workingMonth'
    ,CONVERT(CHAR(10),b.startingDate,126) AS 'purchaseOrder:startingDate'
    ,CONVERT(CHAR(10),b.endDate,126) AS 'purchaseOrder:endDate'
    ,b.CUS_NO AS 'purchaseOrder:CUS_NO'
    ,b.customGross AS 'purchaseOrder:customGross'
    ,b.customTax AS 'purchaseOrder:customTax'
    ,b.customNet AS 'purchaseOrder:customNet'
    ,CONVERT(CHAR(10),b.confirmDate,126) AS 'purchaseOrder:confirmDate'
    ,CONVERT(CHAR(10),b.fulfillDate,126) AS 'purchaseOrder:fulfillDate'
    ,CONVERT(CHAR(10),b.finalizeDate,126) AS 'purchaseOrder:finalizeDate'
    ,b.created AS 'purchaseOrder:created'
    ,b.deprecated AS 'purchaseOrder:deprecated'
FROM rawMaterial.dbo.shipment a
    LEFT JOIN rawMaterial.dbo.purchaseOrder b ON a.pOId=b.id
    LEFT JOIN rawMaterial.dbo.rawMaterialSpecDetail c ON (a.CUS_NO=c.CUS_NO) AND (a.PRD_NO=c.PRD_NO) AND (a.typeId=c.typeId)
WHERE (
    (a.deprecated IS NULL) OR
    ((a.deprecated IS NOT NULL) AND (b.deprecated IS NULL))
);

/*
SELECT
    a.id
    ,a.requestDate
	,CASE
        WHEN h.PS_DD IS NOT NULL THEN DATEPART(year,h.PS_DD) -- 已進廠, 以入廠日期為作業日期
        WHEN h.PS_DD IS NULL AND e.OS_DD IS NOT NULL THEN DATEPART(year,f.EST_DD) -- 已採購尚未進廠，以採購需求日為作業日期
		WHEN e.OS_DD IS NULL AND c.SQ_DD IS NOT NULL THEN DATEPART(year,d.EST_DD) -- 已請購未採購，以請購購需求日為作業日期
		ELSE a.workingYear -- 以上條件均不符合
		END AS workingYear
	,CASE
        WHEN h.PS_DD IS NOT NULL THEN DATEPART(month,h.PS_DD) -- 已進廠, 以入廠日期為作業日期
        WHEN h.PS_DD IS NULL AND e.OS_DD IS NOT NULL THEN DATEPART(month,f.EST_DD) -- 已採購尚未進廠，以採購需求日為作業日期
		WHEN e.OS_DD IS NULL AND c.SQ_DD IS NOT NULL THEN DATEPART(month,d.EST_DD) -- 已請購未採購，以請購購需求日為作業日期
		ELSE a.workingMonth -- 以上條件均不符合
		END AS workingMonth
	,CASE
        WHEN h.PS_DD IS NOT NULL THEN DATEPART(day,h.PS_DD) -- 已進廠, 以入廠日期為作業日期
        WHEN h.PS_DD IS NULL AND e.OS_DD IS NOT NULL THEN DATEPART(day,f.EST_DD) -- 已採購尚未進廠，以採購需求日為作業日期
		WHEN e.OS_DD IS NULL AND c.SQ_DD IS NOT NULL THEN DATEPART(day,d.EST_DD) -- 已請購未採購，以請購購需求日為作業日期
		ELSE DATEPART(day,a.requestDate) -- 以上條件均不符合
		END AS workingDay
	,CASE
        WHEN h.PS_DD IS NOT NULL THEN CONVERT(char(10),h.PS_DD,126) -- 已進廠, 以入廠日期為作業日期
        WHEN h.PS_DD IS NULL AND e.OS_DD IS NOT NULL THEN CONVERT(char(10),f.EST_DD,126) -- 已採購尚未進廠，以採購需求日為作業日期
		WHEN e.OS_DD IS NULL AND c.SQ_DD IS NOT NULL THEN CONVERT(char(10),d.EST_DD,126) -- 已請購未採購，以請購購需求日為作業日期
		ELSE CONVERT(char(10),a.requestDate,126) -- 以上條件均不符合
		END AS workingDate
    ,a.CUS_NO
	,b.CUST_SNM
	,b.CUST_NAME
    ,a.PRD_NO
	,b.PRDT_SNM
    ,a.typeId
	,b.specification
	,b.unitPrice
	,b.UT
	,b.qtyPerShipment
	,a.shipmentCount
    ,a.receivedCount
	,b.qtyPerShipment * a.shipmentCount AS estWeight  -- 預估進廠重量
    ,a.supplierWeight
    ,a.actualWeight
	,CASE
        WHEN a.actualWeight IS NOT NULL AND a.supplierWeight IS NOT NULL AND h.QTY IS NOT NULL THEN h.QTY
		WHEN a.actualWeight IS NULL AND a.supplierWeight IS NULL AND a.SQ_NO IS NULL THEN b.qtyPerShipment * 1
		WHEN a.actualWeight IS NOT NULL AND a.supplierWeight IS NOT NULL AND a.SQ_NO IS NOT NULL THEN d.QTY
		ELSE b.qtyPerShipment * 1
		END AS workingWeight
    ,a.note
    ,a.created
    ,a.modified
    ,a.deprecated
    ,CASE
        WHEN g.LZ_CLS_ID = 'T' THEN 'finalized'
        WHEN g.LZ_CLS_ID = 'F' AND h.QTY IS NOT NULL AND a.supplierWeight IS NOT NULL AND a.actualWeight IS NOT NULL THEN 'filfilled'
        WHEN e.OS_NO IS NOT NULL AND e.PRE_ID = 'T' AND a.supplierWeight IS NULL AND a.actualWeight IS NULL THEN 'confirmed'
        WHEN e.OS_NO IS NOT NULL AND e.PRE_ID = 'F' AND a.supplierWeight IS NULL AND a.actualWeight IS NULL THEN 'ordered'
        WHEN c.SQ_NO IS NOT NULL AND (d.QTY_PO IS NULL OR d.QTY_PO < 1) THEN 'requested'
        ELSE 'pending'
        END AS status
    -- 請購單 --------------------------------------
	,CONVERT(char(10),c.SQ_DD,126) AS SQ_DD -- 請購單日期
    ,c.SQ_NO                                -- 請購單號
    ,a.SQ_ITM                               -- 請購單表身項次
    ,d.QTY AS SQ_QTY                        -- 請購數量
    ,d.QTY_PO                               -- 已採購數量
	,c.CLS_ID AS SQ_CLS_ID                  -- 請購結案標示(true/false)
    -- 採購單/訂單 ----------------------------------
    ,CONVERT(char(10),e.OS_DD,126) AS OS_DD -- 採購單日期
    ,e.OS_NO                                -- 採購單號
    ,f.ITM AS OS_ITM                        -- 採購單表身項次
    ,f.QTY AS OS_QYT                        -- 採購數量
    ,f.QTY_PS                               -- 已進貨數量
    ,e.PRE_ID                               -- 訂單確認標示(true/false, 天心CLIENT為表頭"確認交期"勾選項目)
	,e.CLS_ID AS OS_CLS_ID                  -- 採購結案標示(true/false)
    -- 進貨單 --------------------------------------
	,CONVERT(char(10),h.PS_DD,126) AS PS_DD -- 進貨日期
	,h.PS_NO                                -- 進廠單號
	,h.ITM AS PS_ITM                        -- 進廠單表身項次
	,h.QTY AS PS_QTY                        -- 進貨數量
	,g.LZ_CLS_ID                            -- 立帳結案(true/false)
FROM rawMaterial.dbo.shipment a
	LEFT JOIN rawMaterial.dbo.rawMaterialSpecDetail b ON a.CUS_NO=b.CUS_NO AND a.PRD_NO=b.PRD_NO AND a.typeId=b.typeId
    LEFT JOIN DB_1111.dbo.MF_SQ c ON a.CUS_NO=c.CUS_NO AND a.SQ_NO=c.SQ_NO
    LEFT JOIN DB_1111.dbo.TF_SQ d ON a.SQ_NO=d.SQ_NO AND a.SQ_ITM=d.ITM
    LEFT JOIN DB_1111.dbo.MF_POS e ON a.SQ_NO=e.QT_NO
    LEFT JOIN DB_1111.dbo.TF_POS f ON a.SQ_NO=f.QT_NO AND a.SQ_ITM=f.EST_ITM
	LEFT JOIN DB_1111.dbo.MF_PSS g ON e.OS_NO=g.OS_NO
	LEFT JOIN DB_1111.dbo.TF_PSS h ON e.OS_NO=h.OS_NO AND f.ITM=h.EST_ITM
WHERE a.deprecated IS NULL;
*/
