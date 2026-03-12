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

	static async getAllOrbits(input) {
		const filters = Object.keys(input)

		const limit = filters.includes('limit') ? input['limit'] : 50
		const offset = filters.includes('page') ? ((input['page'] - 1) * limit) : 0
		const orb_class = filters.includes('orbital_class') ? input['orbital_class'] : null

		let filter
		let values = [limit, offset]
		if (orb_class !== null) { 
			filter = `WHERE orbital_class = ?`
			values = [orb_class, limit, offset]
		}

		const query = `SELECT * FROM orbits ${filter} LIMIT ? OFFSET ?`
		const [result] = await db.query(query, values)

		return result
	}
}