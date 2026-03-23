/**
 * Queries to the Near-Earth Objects table.
 */

import db from '../config/db.js'

export default class Neo {
	static async getNeo(spkid) {
		const query = `SELECT * FROM near_earth_objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result[0]
	}

	static async filterNeos({ limit = 50, page = 1, name = null }) {
		const offset = ((page - 1) * limit)
		let query = 'SELECT * FROM near_earth_objects WHERE name LIKE ? LIMIT ? OFFSET ?'
		let values = [`%${name}%`, limit, offset]

		if (name === null) { 
			query = 'SELECT * FROM near_earth_objects LIMIT ? OFFSET ?'
			values = [limit, offset]
		}

		const [result] = await db.query(query, values)

		return result
	}

	static async addNeo(data) {
		const attributes = Object.keys(data).join(', ')
		const values = Object.values(data)
		const questionMarks = values.map(() => '?').join(', ')

		const query = `INSERT INTO near_earth_objects (${attributes}) VALUES (${questionMarks})`
		const [result] = await db.query(query, values)

		return result
	}

	static async updateNeo(spkid, data) {
		const keys = Object.keys(data)
		if (keys.length === 0) return null

		const attributes = keys.map(attribute => `${attribute} = ?`).join(', ')
		const values = Object.values(data)

		const query = `UPDATE near_earth_objects SET ${attributes} WHERE spkid = ?`
		const [result] = await db.query(query, [...values, spkid])

		return result
	}

	static async deleteNeo(spkid) {
		const query = `DELETE FROM near_earth_objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result
	}
}