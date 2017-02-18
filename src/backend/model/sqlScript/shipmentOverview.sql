SELECT
	workingDate
    ,DATEPART(year,workingDate) AS workingYear
    ,DATEPART(month,workingDate) AS workingMonth
    ,DATEPART(day,workingDate) AS workingDay
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
FROM rawMaterial.dbo.planSchedule
GROUP BY CUS_NO,CUS_SNM,PRD_NO,PRDT_SNM,workingDate;
