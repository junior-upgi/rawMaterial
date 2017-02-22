SELECT
	workingYear
	,workingMonth
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification
FROM rawMaterial.dbo.planSchedule
GROUP BY
	workingYear
	,workingMOnth
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
	,typeId
	,specification;
