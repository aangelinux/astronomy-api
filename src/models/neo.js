/**
 * Queries to the Near-Earth Objects attribute.
 */

import db from '../config/db.js'

export default class Neo {
	static async getNeo(spkid) {
		const query = `SELECT * FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result[0]
	}

	static async getAllNeos(page) {
		const offset = (page - 1) * 50
		const query = `SELECT * FROM Near_Earth_Objects LIMIT 50 OFFSET ?`
		const [result] = await db.query(query, [offset])

		return result
	}

	static async addNeo(data) {
		const attributes = Object.keys(data).join(', ')
		const values = Object.values(data)

		let questionMarks = `?`
		const valuesLength = values.length
		for (let i = 0; i < valuesLength; i++) questionMarks.concat(', ?')

		const query = `INSERT INTO Near_Earth_Objects (${attributes}) VALUES (${questionMarks})`
		const [result] = await db.query(query, [values])

		return result
	}

	static async updateNeo(spkid, data) {
		const rows = Object.keys(data)
		if (rows.length === 0) return null

		const attributes = rows.map(attribute => `${attribute} = ?`).join(', ')
		const values = rows.map(attribute => data[attribute])

		const query = `UPDATE Near_Earth_Objects SET ${attributes} WHERE spkid = ?`
		const [result] = await db.query(query, [...values, spkid])

		return result
	}

	static async deleteNeo(spkid) {
		const query = `DELETE FROM Near_Earth_Objects WHERE spkid = ?`
		const [result] = await db.query(query, [spkid])

		return result
	}
}