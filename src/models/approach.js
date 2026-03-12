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

	static async getAllApproaches(input) {
		const filters = Object.keys(input)

		const limit = filters.includes('limit') ? input['limit'] : 50
		const offset = filters.includes('page') ? ((input['page'] - 1) * limit) : 0
		const rarity = filters.includes('rarity') ? input['rarity'] : null

		let filter
		let values = [limit, offset]
		// Need to check for null specifically, 
		// because if rarity is 0 the if-statement will evaluate to false
		if (rarity !== null) { 
			filter = `WHERE rarity = ?`
			values = [rarity, limit, offset]
		}

		const query = `SELECT * FROM close_approaches ${filter} LIMIT ? OFFSET ?`
		const [result] = await db.query(query, values)

		return result
	}
}