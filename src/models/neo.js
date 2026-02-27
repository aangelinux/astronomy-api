/**
 * Queries to the Near-Earth Objects table.
 */

import db from '../config/db.js'

export default class Neo {
	static async getNeo(id) {

	}

	static async getAllNeos() {
		const query = `
		SELECT * FROM Near_Earth_Objects
		WHERE spkid > 50
		ORDER BY spkid
		LIMIT 50`

		const [result] = await db.query(query)
		console.log(result)
		
		return result
	}

	static async addNeo(data) {

	}

	static async updateNeo(id, data) {

	}

	static async deleteNeo(id) {

	}
}