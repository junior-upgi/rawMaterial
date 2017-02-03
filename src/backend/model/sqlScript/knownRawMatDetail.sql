SELECT
	a.PRD_NO
	,b.SNM
FROM rawMaterial.dbo.knownRawMaterial a
	INNER JOIN DB_U105.dbo.PRDT b ON a.PRD_NO=b.PRD_NO;
