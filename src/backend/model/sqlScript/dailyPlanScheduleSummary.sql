SELECT
	requestDate
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification
    ,qtyPerShipment
    ,SUM(quantity) AS quantity
	,SUM(qtyPerShipment*quantity) AS estWeight
    ,UT
FROM rawMaterial.dbo.planSchedule
WHERE deprecated IS NULL
GROUP BY
	requestDate
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification
    ,qtyPerShipment
    ,UT;
