/**
 * Queries to the Close Approaches table.
 */

import db from '../config/db.js'

export default class Close_Approach {
	static async getApproach(id) {
		const query = `SELECT * FROM Close_Approaches WHERE id = ?`
		const [result] = await db.query(query, [id])
		
		return result[0]
	}

	static async getApproachBySpkid(spkid) {
		const query = `SELECT * FROM Close_Approaches WHERE spkid = ? LIMIT 1`
		const [result] = await db.query(query, [spkid])

		return result[0]  // TODO return all if more than one
	}

	static async getAllApproaches(page) {
		const offset = (page - 1) * 50
		const query = `SELECT * FROM Close_Approaches LIMIT 50 OFFSET ?`
		const [result] = await db.query(query, [offset])

		return result
	}
}