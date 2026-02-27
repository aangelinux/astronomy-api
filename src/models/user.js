/**
 * Queries to the Users table.
 */

export default class User {
	static async getUser(id) {
		const query = `SELECT * FROM Users WHERE userid = ?`
		const [result] = await db.query(query, [id])
		
		return result
	}

	static async getAllUsers(page) {
		const query = `SELECT * FROM Users LIMIT 50 OFFSET = ?`
		const [result] = await db.query(query, [page])

		return result
	}

	static async addUser(data) {
		const query = `
		INSERT INTO Users (username, password_hash, created)
		VALUES (?, ?, NOW())`

		const [result] = await db.query(query, [
			data.username,
			data.password_hash
		])

		return result
	}
}