/**
 * Queries to the Orbits table.
 */

import db from '../config/db.js'

export default class Orbit {
	static async getOrbit(spkid) {
		const query = `SELECT * FROM orbits WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])
		
		return result[0]
	}

	static async filterOrbits({ limit = 50, page = 1, orbital_class = null }) {
		const offset = ((page - 1) * limit)
		let query = 'SELECT * FROM orbits WHERE orbital_class = ? LIMIT ? OFFSET ?'
		let values = [orbital_class, limit, offset]

		if (orbital_class === null) { 
			query = 'SELECT * FROM orbits LIMIT ? OFFSET ?'
			values = [limit, offset]
		}

		const [result] = await db.query(query, values)

		return result
	}
}