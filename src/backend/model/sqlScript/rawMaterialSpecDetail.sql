SELECT
	a.PRD_NO
	,b.SNM AS PRDT_SNM
	,a.typeId
	,a.CUS_NO
	,c.SNM AS CUS_SNM
	,a.specification
	,a.sequentialIndex
FROM rawMaterial.dbo.rawMaterialSpec a
	INNER JOIN DB_U105.dbo.PRDT b ON a.PRD_NO=b.PRD_NO
	INNER JOIN DB_U105.dbo.CUST c ON a.CUS_NO=c.CUS_NO
WHERE a.display=1;
