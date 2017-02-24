SELECT
	a.id
    ,a.pOId
	,CONVERT(char(10),a.requestDate,126) AS requestDate
	,CONVERT(char(10),a.arrivalDate,126) AS arrivalDate
	,CASE
		WHEN a.arrivalDate IS NULL THEN 0
		ELSE 1
		END AS received
	,CASE
		WHEN a.arrivalDate IS NULL THEN CONVERT(char(10),a.requestDate,126)
		ELSE CONVERT(char(10),a.arrivalDate,126)
		END AS workingDate
	,CASE
		WHEN a.arrivalDate IS NULL THEN DATEPART(year,a.requestDate)
		ELSE DATEPART(year,a.arrivalDate)
		END AS workingYear
	,CASE
		WHEN a.arrivalDate IS NULL THEN DATEPART(month,a.requestDate)
		ELSE DATEPART(month,a.arrivalDate)
		END AS workingMonth
	,CASE
		WHEN a.arrivalDate IS NULL THEN DATEPART(day,a.requestDate)
		ELSE DATEPART(day,a.arrivalDate)
		END AS workingDay
	,a.CUS_NO
	,b.SNM AS CUS_SNM
	,b.NAME AS CUS_NAME
	,a.PRD_NO
	,c.PRDT_SNM
	,a.typeId
	,c.specification
	,c.unitPrice
	,c.UT
	,c.qtyPerShipment
	,a.quantity
	,c.qtyPerShipment * a.quantity AS estWeight
	,a.supplierWeight
	,a.actualWeight
	,CASE
		WHEN actualWeight IS NULL AND supplierWeight IS NULL THEN c.qtyPerShipment * a.quantity
		WHEN actualWeight <= supplierWeight THEN actualWeight
		ELSE supplierWeight
		END AS workingWeight
	,a.note
	,a.created
	,a.modified
	,a.deprecated
FROM rawMaterial.dbo.shipmentRequest a
	LEFT JOIN rawMaterial.dbo.CUST b ON a.CUS_NO=b.CUS_NO
	LEFT JOIN rawMaterial.dbo.rawMatSpecDetail c ON a.PRD_NO=c.PRD_NO AND a.typeId=c.typeId
WHERE deprecated IS NULL;
