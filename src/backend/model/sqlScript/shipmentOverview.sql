SELECT
	requestDate
    ,DATEPART(year,requestDate) AS workingYear
    ,DATEPART(month,requestDate) AS workingMonth
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
FROM rawMaterial.dbo.planSchedule
GROUP BY CUS_NO,CUS_SNM,PRD_NO,PRDT_SNM,requestDate;
