SELECT
	a.id
    ,CONVERT(char(10),a.requestDate,126) AS requestDate
	,a.CUS_NO
	,b.CUS_SNM
	,a.PRD_NO
	,b.PRDT_SNM
	,a.typeId
	,b.specification
    ,b.qtyPerShipment
	,a.quantity
    ,b.qtyPerShipment*a.quantity AS estWeight
    ,b.UT
    ,CONVERT(char(10),a.arrivalDate,126) AS arrivalDate
    ,a.supplierWeight
    ,a.actualWeight
	,a.note
    ,a.created
    ,a.modified
    ,a.deprecated
FROM rawMaterial.dbo.shipmentRequest a
	INNER JOIN rawMaterial.dbo.rawMatSpecDetail b ON a.CUS_NO=b.CUS_NO AND a.PRD_NO=b.PRD_NO AND a.typeId=b.typeId;
