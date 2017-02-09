SELECT
	a.SAL_NO
	,a.type
	,a.role
	,b.NAME
	,b.DEP
	,d.NAME AS DEPT_NAME
	,b.POS
	,b.TEL2 AS mobileNumber
	,b.E_MAIL
	,c.DSC_REM AS telegramId
	,e.username
	,e.first_name
	,e.last_name
FROM rawMaterial.dbo.privilege a
	LEFT JOIN DB_U105.dbo.SALM b ON a.SAL_NO=b.SAL_NO
	LEFT JOIN DB_U105.dbo.SALM_DSC c ON a.SAL_NO=c.SAL_NO AND c.DSC_NO='telegramId'
	LEFT JOIN DB_U105.dbo.DEPT d ON b.DEP=d.DEP
	LEFT JOIN telegram.dbo.[user] e ON a.SAL_NO=e.SAL_NO AND CAST(c.DSC_REM AS INT)=e.id;
