/**
 * Connection to a MySQL database.
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createPool({
	// Support CI / docker-compose default env var names and sensible fallbacks
	port: process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306,
	host: process.env.MYSQLHOST || process.env.MYSQL_HOST || 'mysql',
	user: process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
	// CI often supplies MYSQL_ROOT_PASSWORD; prefer explicit MYSQLPASSWORD if set
	password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
	database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || undefined,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	connectTimeout: 10000
})

export default db