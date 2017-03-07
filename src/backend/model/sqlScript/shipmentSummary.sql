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
    ,SUM(a.shipmentCount) AS totalShipmentCount
    ,SUM(a.receivedCount) AS totalReceivedCount
	,SUM(a.workingWeight*a.shipmentCount) AS totalWeight
FROM rawMaterial.dbo.shipmentSchedule a
WHERE a.deprecated IS NULL
GROUP BY a.CUS_NO,a.CUST_SNM,a.PRD_NO,a.PRDT_SNM,a.typeId,a.specification,a.workingDate,a.workingYear,a.workingMonth;
