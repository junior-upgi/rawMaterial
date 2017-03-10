SELECT
    f.CUS_NO
    ,g.CUST_SNM
    ,f.contractType
    ,f.PRD_NO
    ,g.PRDT_SNM
    ,f.typeId
    ,g.specification
    ,f.workingYear
    ,f.workingMonth
    ,f.newRequestCount
FROM (
    SELECT
        e.CUS_NO
        ,e.contractType
        ,e.PRD_NO
        ,e.typeId
        ,e.workingYear
        ,e.workingMonth
        ,COUNT(*) AS newRequestCount
    FROM (
        SELECT
            d.CUS_NO
            ,d.contractType
            ,d.PRD_NO
            ,d.typeId
            ,CASE
                WHEN d.contractType='annual' THEN DATEPART(year,d.workingDate)
                WHEN d.contractType='monthly' THEN DATEPART(year,d.workingDate)
                ELSE NULL
                END AS workingYear
            ,CASE
                WHEN d.contractType='annual' THEN NULL
                WHEN d.contractType='monthly' THEN DATEPART(month,d.workingDate)
                ELSE NULL
                END AS workingMonth
        FROM (
            SELECT
                a.CUS_NO
                ,b.contractType
                ,a.PRD_NO
                ,a.typeId
                ,CASE
                    WHEN a.receivedDate IS NULL THEN CONVERT(CHAR(10),a.requestDate,126)
                    ELSE CONVERT(CHAR(10),a.receivedDate,126)
                    END AS 'workingDate'
            FROM rawMaterial.dbo.shipment a
                LEFT JOIN rawMaterial.dbo.supplier b ON a.CUS_NO=b.CUS_NO
                LEFT JOIN rawMaterial.dbo.purchaseOrder c ON a.pOId=c.id
            WHERE a.deprecated IS NULL AND a.receivedDate IS NULL AND c.deprecated IS NULL) d) e
    GROUP BY e.CUS_NO,e.contractType,e.PRD_NO,e.typeId,e.workingYear,e.workingMonth) f
    LEFT JOIN rawMaterialSpecDetail g ON (f.CUS_NO=g.CUS_NO) AND (f.PRD_NO=g.PRD_NO) AND (f.typeId=g.typeId);
