SELECT
	a.CUS_NO
	,a.CUST_SNM
	,a.PRD_NO
	,a.PRDT_SNM
	,a.typeId
	,a.specification
	,a.workingDate
	,a.workingYear
	,a.workingMonth
	,DATEPART(day,a.workingDate) AS workingDay
    ,SUM(a.quantity) AS totalQuantity
	,SUM(a.workingWeight*a.quantity) AS totalWeight
FROM rawMaterial.dbo.shipmentSchedule a
WHERE a.deprecated IS NULL
GROUP BY a.CUS_NO,a.CUST_SNM,a.PRD_NO,a.PRDT_SNM,a.typeId,a.specification,a.workingDate,a.workingYear,a.workingMonth;
