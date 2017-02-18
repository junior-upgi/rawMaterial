SELECT
    received
	,CONVERT(char(10),workingDate,126) AS workingDate
    ,workingYear
    ,workingMonth
    ,workingday
	,CUS_NO
	,CUS_SNM
    ,CUS_NAME
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification
    ,UT
    ,qtyPerShipment
    ,SUM(quantity) AS quantity
	,SUM(qtyPerShipment*quantity) AS estWeight
    ,SUM(supplierWeight) AS supplierWeight
    ,SUM(actualWeight) AS actualWeight
    ,SUM(workingWeight) AS workingWeight
FROM rawMaterial.dbo.planSchedule
WHERE deprecated IS NULL
GROUP BY
    received
	,workingDate
	,workingYear
	,workingMonth
	,workingDay
	,CUS_NO
	,CUS_SNM
    ,CUS_NAME
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification
    ,UT
    ,qtyPerShipment;
