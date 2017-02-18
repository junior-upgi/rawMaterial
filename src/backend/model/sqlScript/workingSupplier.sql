SELECT
	workingYear
	,workingMonth
	,CUS_NO
	,CUS_SNM
	,PRD_NO
	,PRDT_SNM
FROM rawMaterial.dbo.shipmentOverview
GROUP BY CUS_NO,CUS_SNM,PRD_NO,PRDT_SNM,workingYear,workingMonth;
