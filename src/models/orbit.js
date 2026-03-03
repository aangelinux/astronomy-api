/**
 * Queries to the Orbits table.
 */

import db from '../config/db.js'

export default class Orbit {
	static async getOrbit(spkid) {
		const query = `SELECT * FROM Orbits WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])
		
		return result[0]
	}

	static async getAllOrbits(page) {
		const offset = (page - 1) * 50
		const query = `SELECT * FROM Orbits LIMIT 50 OFFSET ?`
		const [result] = await db.query(query, [offset])

		return result
	}
}