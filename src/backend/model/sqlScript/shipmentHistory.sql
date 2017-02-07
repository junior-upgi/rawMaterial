SELECT
	a.PS_ID
	,a.PS_NO
	,b.ITM
	,CONVERT(char(10),a.PS_DD,126) AS PS_DD
	,a.CUS_NO
	,a.DEP
	,a.LZ_CLS_ID
	,b.PRD_NO
	,b.UNIT
	,b.QTY
	,b.UP
	,b.TAX_RTO
    ,b.OS_ID
	,b.OS_NO
	,b.EST_ITM
FROM DB_U105.dbo.MF_PSS a
	INNER JOIN DB_U105.dbo.TF_PSS b ON a.PS_NO=b.PS_NO
WHERE
	a.PS_ID='PC' AND
	a.PS_DD>'2016-01-01' AND
	b.PRD_NO IN (SELECT PRD_NO FROM rawMaterial.dbo.knownRawMatId);
