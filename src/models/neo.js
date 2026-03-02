/**
 * Queries to the Near-Earth Objects table.
 */

import db from '../config/db.js'

export default class Neo {
	static async getNeo(id) {
		const query = `SELECT * FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [id])
		
		return result[0]
	}

	static async getAllNeos(page) {
		const query = `SELECT * FROM Near_Earth_Objects LIMIT 50 OFFSET = ?`
		const [result] = await db.query(query, [page])

		return result
	}

	static async addNeo(data) {
		const query = `
		INSERT INTO Near_Earth_Objects (spkid, name, earth_moid_ld, magnitude, rotation_hours, pha)
		VALUES (?, ?, ?, ?, ?, ?)`

		const [result] = await db.query(query, [
			data.id,
			data.name,
			data.earth_moid_ld,
			data.magnitude,
			data.rotation_hours,
			data.pha
		])

		return result
	}

	static async updateNeo(id, data) {
		const tables = Object.keys(data)

		const query = `UPDATE Near_Earth_Objects SET ${tables} = ? WHERE spkid = ?`
		const [result] = await db.query(query, [...data, id])

		return result
	}

	static async deleteNeo(id) {
		const query = `DELETE FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [id])

		return result
	}
}