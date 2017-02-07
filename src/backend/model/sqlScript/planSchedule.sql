SELECT
	a.id
    ,CONVERT(char(10),a.requestDate,126) AS requestDate
	,a.CUS_NO
	,b.CUS_SNM
	,a.PRD_NO
	,b.PRDT_SNM
	,a.typeId
	,b.specification
	,a.quantity
    ,b.unitPerTruck*a.quantity AS estWeight
    ,b.UT
    ,CONVERT(char(10),a.arrivalDate,126) AS arrivalDate
    ,a.supplierWeight
    ,a.fullWeight
    ,a.emptyWeight
	,a.note
    ,a.finalized
    ,a.created
    ,a.modified
    ,a.deprecated
FROM rawMaterial.dbo.shipment a
	INNER JOIN rawMaterial.dbo.rawMaterialSpecDetail b ON a.CUS_NO=b.CUS_NO AND a.PRD_NO=b.PRD_NO AND a.typeId=b.typeId;
