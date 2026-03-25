/**
 * Queries to the Close Approaches table.
 */

import db from '../config/db.js'

export default class Close_Approach {
	static async getApproach(id) {
		const query = `SELECT * FROM close_approaches WHERE id = ?`
		const [result] = await db.query(query, [id])
		
		return result[0]
	}

	static async getApproachBySpkid(spkid) {
		const query = `SELECT * FROM close_approaches WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result
	}

	static async filterApproaches({ limit = 50, offset = 0, rarity = null }) {
		let query = `SELECT * FROM close_approaches WHERE rarity = ? LIMIT ? OFFSET ?`
		let values = [rarity, limit, offset]

		if (rarity === null) { 
			query = `SELECT * FROM close_approaches LIMIT ? OFFSET ?`
			values = [limit, offset]
		}
		const [result] = await db.query(query, values)

		return result
	}
}