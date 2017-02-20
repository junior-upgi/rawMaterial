SELECT
	CUS_NO
	,PRD_NO
	,workingYear
	,workingMonth
	,received
	,SUM(workingWeight) AS workingWeight
FROM rawMaterial.dbo.planSchedule
GROUP BY CUS_NO,PRD_NO,workingYear,workingMonth,received;
