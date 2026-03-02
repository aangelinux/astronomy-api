/**
 * Queries to the Users table.
 */

import db from '../config/db.js'

export default class User {
	static async getUser(username) {
		const query = `SELECT * FROM Users WHERE username = ?`
		const [result] = await db.query(query, [username])
		
		return result
	}

	static async register(data) {
		const query = `
		INSERT INTO Users (username, password_hash, created)
		VALUES (?, ?, NOW())`

		const [result] = await db.query(query, [
			data.username,
			data.password_hash
		])

		return result
	}

	static async delete(user) {
		const query = `DELETE FROM Users WHERE username = ?`
		const [result] = await db.query(query, [user])

		return result
	}
}