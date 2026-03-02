/**
 * Queries to the Near-Earth Objects table.
 */

import db from '../config/db.js'

export default class Neo {
	static async getNeo(spkid) {
		const query = `SELECT * FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result[0]
	}

	static async getAllNeos(page) {
		const offset = page * 50

		const query = `SELECT * FROM Near_Earth_Objects LIMIT 50 OFFSET ?`
		const [result] = await db.query(query, [offset])

		return result
	}

	static async addNeo(data) {
		const query = `
		INSERT INTO Near_Earth_Objects (spkid, name, earth_moid_ld, magnitude, rotation_hours, pha)
		VALUES (?, ?, ?, ?, ?, ?)`

		const [result] = await db.query(query, [
			data.spkid,
			data.name,
			data.earth_moid_ld,
			data.magnitude,
			data.rotation_hours,
			data.pha
		])

		return result
	}

	static async updateNeo(spkid, data) {
		const rows = Object.keys(data)
		if (rows.length === 0) return null

		const updateTables = rows.map(table = `${table} = ?`).join(', ')
		const values = rows.map(table => data[table])

		const query = `UPDATE Near_Earth_Objects SET ${updateTables} WHERE spkid = ?`
		const [result] = await db.query(query, [...values, spkid])

		return result
	}

	static async deleteNeo(spkid) {
		const query = `DELETE FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result
	}
}