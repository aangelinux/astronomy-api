/**
 * Parses data from a CSV file and populates the database.
 */

import db from '../src/config/db.js'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'
import { parse, format } from 'date-fns'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PRIMARY = {
	table: 'near_earth_objects',
	filePath: path.join(__dirname, '../data/near_earth_objects.csv'),
	batchSize: 500,
	query: `INSERT INTO near_earth_objects  
	(spkid, name, earth_moid_ld, magnitude, rotation_hours, pot_hazardous_asteroid) 
	VALUES ?`,
 	values: (row) => [
		row['spkid'],
		formatName(row['full_name']),
		row['moid_ld'],
		safeFloat(row['H']),
		safeFloat(row['rot_per']),
		formatPHA(row['pha']),
	]
}

const SECONDARY = {
	table: 'close_approaches',
	filePath: path.join(__dirname, '../data/close_approaches.csv'),
	batchSize: 500,
	query: `INSERT INTO close_approaches  
	(spkid, date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s, rarity) 
	VALUES ?`,
  values: (row, spkid) => [
		spkid,
		formatDate(row['Close-Approach (CA) Date']),
		safeFloat(row['CA DistanceNominal (km)']),
		safeFloat(row['CA DistanceMinimum (km)']),
		safeFloat(row['V relative(km/s)']),
		safeInt(row['Rarity'])
	]
}

const TERTIARY = {
	table: 'orbits',
	filePath: path.join(__dirname, '../data/orbits.csv'),
	batchSize: 500,
	query: `INSERT INTO orbits 
	(spkid, orbital_class, eccentricity, years) VALUES ?`,
	values: (row) => [
		row['spkid'],
		row['class'],
		safeFloat(row['e']),
		safeFloat(row['per_y']),
	]
}

async function seed() {
	const connection = await db.getConnection()
	try {
		await connection.beginTransaction()
		await emptyTables(connection)  // Prevent duplicates
		await streamData(connection, PRIMARY)
		await streamSecondary(connection)
		await streamData(connection, TERTIARY)
		await connection.commit()
		console.log('CSV file processed successfully')
	} catch (error) {
		await connection.rollback()
		console.error('Error populating database: ', error.message)
		process.exit(1)
	} finally {
		connection.release()
		process.exit(0)
	}
}

async function emptyTables(connection) {
	await connection.query(`DELETE FROM ${TERTIARY.table}`)
	await connection.query(`DELETE FROM ${SECONDARY.table}`)

	// Must be last because other tables have FKs that reference it
	await connection.query(`DELETE FROM ${PRIMARY.table}`)
}

async function streamData(connection, CONFIG) {
	const batch = []
	const fileStream = createReadStream(CONFIG.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = CONFIG.values(row)
		batch.push(values)
		if (batch.length >= CONFIG.batchSize) {
			await connection.query(CONFIG.query, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(CONFIG.query, [batch])
	}
}

async function streamSecondary(connection) {
	const batch = []
	const spkidMap = await mapSpkid(connection)
	const fileStream = createReadStream(SECONDARY.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const spkid = spkidMap.get(row['Object'])
		if (!spkid) continue

		const values = SECONDARY.values(row, spkid)
		batch.push(values)
		if (batch.length >= SECONDARY.batchSize) {
			await connection.query(SECONDARY.query, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(SECONDARY.query, [batch])
	}
}

async function mapSpkid(connection) {
	const [rows] = await connection.query(
		`SELECT spkid, name FROM near_earth_objects`)
	
	const map = new Map()
	for (const row of rows) {
		map.set(row.name, row.spkid)
	}
	
	return map
}

function formatName(value) {
	return value.trimStart()
}

function formatPHA(value) {
	return value === 'Y' ? true : false
}

function formatDate(date) {
	const parsedDate = parse(
		date.split('±')[0].trim(), 'yyyy-MMM-dd HH:mm', new Date())
	const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss')

	return formattedDate
}

function safeFloat(val) {
	const parsedFloat = parseFloat(val)
	return Number.isNaN(parsedFloat) ? null : parsedFloat
}

function safeInt(val) {
	const parsedInt = parseInt(val)
	return Number.isNaN(parsedInt) ? null : parsedInt
}

seed().catch(console.error)