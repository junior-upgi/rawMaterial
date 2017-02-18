-- find the latest finalized purchase record of any raw material
SELECT a.*
FROM rawMaterial.dbo.accountHistory a
	INNER JOIN (
		-- subquery to find latest LZ_DD on any given raw material
		SELECT
			PRD_NO
			,MAX(LZ_DD) AS MAX_LZ_DD
		FROM rawMaterial.dbo.accountHistory
		GROUP BY PRD_NO) b ON a.PRD_NO=b.PRD_NO AND a.LZ_DD=b.MAX_LZ_DD
	INNER JOIN (
		-- subquery to find last ITM in any TF_LZ1 group and raw material type
		SELECT LZ_NO,PRD_NO,MAX(ITM) AS MAX_ITM
		FROM DB_U105.dbo.TF_LZ1
		GROUP BY LZ_NO,PRD_NO) c ON a.LZ_NO=c.LZ_NO AND a.PRD_NO=c.PRD_NO AND a.ITM=c.MAX_ITM;
