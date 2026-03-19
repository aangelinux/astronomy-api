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

	static async filterOrbits(input) {
		const limit = input['limit'] || 50
		const offset = ((input['page'] - 1) * limit) || 0
		const orbitClass = input['orbital_class'] || null

		let query = 'SELECT * FROM orbits WHERE orbital_class = ? LIMIT ? OFFSET ?'
		let values = [orbitClass, limit, offset]
		
		if (orbitClass === null) { 
			query = 'SELECT * FROM orbits LIMIT ? OFFSET ?'
			values = [limit, offset]
		}

		const [result] = await db.query(query, values)

		return result
	}
}