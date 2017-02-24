SELECT
	a.pOId
	,a.pONumber
	,a.revisionNumber
	,a.parentPOId
	,a.childPOId
	,a.contractType
	,CONVERT(char(10),a.startingDate,126) AS startingDate
	,CONVERT(char(10),a.endDate,126) AS endDate
	,CASE
		WHEN a.contractType='oneTime' THEN NULL
		ELSE DATEPART(year,a.startingDate)
		END AS workingYear
	,CASE
		WHEN a.contractType='oneTime' OR a.contractType='annual' THEN NULL
		ELSE DATEPART(month,a.startingDate)
		END AS workingMonth
	,a.CUS_NO
	,a.confirmed
    ,a.fulfilled
	,a.created
	,a.modified
	,a.deprecated
	,b.id AS 'shipments:id'
    ,b.pOId AS 'shipments:pOId'
    ,b.requestDate AS 'shipments:requestDate'
    ,b.arrivalDate AS 'shipments:arrivalDate'
    ,b.received AS 'shipments:received'
    ,b.workingDate AS 'shipments:workingDate'
    ,b.workingYear AS 'shipments:workingYear'
    ,b.workingMonth AS 'shipments:workingMonth'
    ,b.workingDay AS 'shipments:workingDay'
    ,b.CUS_NO AS 'shipments:CUS_NO'
    ,b.CUS_SNM AS 'shipments:CUS_SNM'
    ,b.CUS_NAME AS 'shipments:CUS_NAME'
    ,b.PRD_NO AS 'shipments:PRD_NO'
    ,b.PRDT_SNM AS 'shipments:PRDT_SNM'
    ,b.typeId AS 'shipments:typeId'
    ,b.specification AS 'shipments:specification'
    ,b.unitPrice AS 'shipments:unitPrice'
    ,b.UT AS 'shipments:UT'
    ,b.qtyPerShipment AS 'shipments:qtyPerShipment'
    ,b.quantity AS 'shipments:quantity'
    ,b.estWeight AS 'shipments:estWeight'
    ,b.supplierWeight AS 'shipments:supplierWeight'
    ,b.actualWeight AS 'shipments:actualWeight'
    ,b.workingWeight AS 'shipments:workingWeight'
    ,b.note AS 'shipments:note'
    ,b.created AS 'shipments:created'
    ,b.modified AS 'shipments:modified'
    ,b.deprecated AS 'shipments:deprecated'
FROM rawMaterial.dbo.purchaseOrder a
	LEFT JOIN rawMaterial.dbo.planSchedule b ON a.pOId=b.pOId
WHERE a.deprecated IS NULL;

/*
-- previous version
SELECT
	a.pOId
	,a.pONumber
	,a.revisionNumber
	,a.parentPOId
	,a.childPOId
	,a.contractType
	,CONVERT(char(10),a.startingDate,126) AS startingDate
	,CONVERT(char(10),a.endDate,126) AS endDate
	,CASE
		WHEN a.contractType='oneTime' THEN NULL
		ELSE DATEPART(year,a.startingDate)
		END AS workingYear
	,CASE
		WHEN a.contractType='oneTime' OR a.contractType='annual' THEN NULL
		ELSE DATEPART(month,a.startingDate)
		END AS workingMonth
	,a.CUS_NO
	,a.confirmed
	,a.created
	,a.modified
	,a.deprecated
FROM rawMaterial.dbo.purchaseOrder a
WHERE deprecated IS NULL;
*/
