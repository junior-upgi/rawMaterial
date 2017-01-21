SELECT
	a.PRD_NO
	,c.SNM AS PRDT_SNM
	,a.typeId
    ,b.UT
	,a.CUS_NO
	,d.SNM AS CUS_SNM
	,a.specification
    ,a.unitPerTruck
	,a.sequentialIndex
FROM rawMaterial.dbo.rawMaterialSpec a
    INNER JOIN rawMaterial.dbo.rawMaterialDetail b ON a.PRD_NO=b.PRD_NO
	INNER JOIN DB_U105.dbo.PRDT c ON a.PRD_NO=c.PRD_NO
	INNER JOIN DB_U105.dbo.CUST d ON a.CUS_NO=d.CUS_NO
WHERE a.display=1;
