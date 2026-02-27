/**
 * Queries to the Orbits table.
 */

export default class Orbit {
	static async getOrbit(id) {
		const query = `SELECT * FROM Orbits WHERE spkid = ?`
		const [result] = await db.query(query, [id])
		
		return result
	}

	static async getAllOrbits(page) {
		const query = `SELECT * FROM Orbits LIMIT 50 OFFSET = ?`
		const [result] = await db.query(query, [page])

		return result
	}
}