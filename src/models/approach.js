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

	static async filterApproaches(input) {
		const limit = input.limit ? input['limit'] : 50
		const offset = input.page ? ((input['page'] - 1) * limit) : 0
		const rarity = input.rarity ? input['rarity'] : null

		let query, values
		// Need to check for null specifically, 
		// because if rarity is 0 the if-statement will evaluate to false
		if (rarity === null) { 
			query = `SELECT * FROM close_approaches LIMIT ? OFFSET ?`
			values = [limit, offset]
		} else {
			query = `SELECT * FROM close_approaches WHERE rarity = ? LIMIT ? OFFSET ?`
			values = [rarity, limit, offset]
		}
		const [result] = await db.query(query, values)

		return result
	}
}