/**
 * Queries to the Users table.
 */

import db from '../config/db.js'

export default class User {
	static async getUser(userid) {
		const query = `SELECT * FROM Users WHERE userid = ?`
		const [result] = await db.query(query, [userid])
		
		return result[0]
	}

	static async findByUsername(username) {
		const query = `SELECT * FROM Users WHERE username = ?`
		const [result] = await db.query(query, [username])

		return result[0]
	}

	static async register(data) {
		const query = `
		INSERT INTO Users (username, password_hash, created)
		VALUES (?, ?, NOW())`

		const [result] = await db.query(query, [
			data.username,
			data.password_hash
		])

		return result.insertId
	}

	static async delete(user) {
		const query = `DELETE FROM Users WHERE username = ?`
		const [result] = await db.query(query, [user])

		return result
	}
}