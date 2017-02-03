-- not finalized
SELECT
	b.DEP
	,b.SAL_NO
	,b.PS_ID
	,b.PS_NO
	,a.ITM
	,b.CUS_NO
	,b.PS_DD
	,a.PRD_NO
	,a.QTY
	,a.UNIT
	,a.UP
	,b.REM
	,a.WH
	,b.TAX_ID
	,b.ZHANG_ID
FROM DB_U105.dbo.TF_PSS a
	INNER JOIN (
		SELECT *
		FROM DB_U105.dbo.MF_PSS
		WHERE PS_ID='PC' AND DEP='3F12'
	) b ON a.PS_NO=b.PS_NO
	INNER JOIN rawMaterial.dbo.knownRawMaterial c ON a.PRD_NO=c.PRD_NO
WHERE a.PS_ID='PC' AND a.PS_DD>='2016-01-01';
