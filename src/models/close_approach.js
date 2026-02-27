/**
 * Queries to the Close Approaches table.
 */

export default class Close_Approach {
	static async getApproach(id) {
		const query = `SELECT * FROM Close_Approaches WHERE spkid = ?`
		const [result] = await db.query(query, [id])
		
		return result
	}

	static async getAllApproaches(page) {
		const query = `SELECT * FROM Close_Approaches LIMIT 50 OFFSET = ?`
		const [result] = await db.query(query, [page])

		return result
	}
}