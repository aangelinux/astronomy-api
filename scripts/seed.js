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
	table: 'Near_Earth_Objects',
	filePath: path.join(__dirname, '../data/near_earth_objects.csv'),
	batchSize: 500,
	query: `INSERT INTO Near_Earth_Objects  
	(spkid, name, earth_moid_ld, magnitude, rotation_hours, pot_hazardous_asteroid) 
	VALUES ?`
}

const SECONDARY = {
	table: 'Close_Approaches',
	filePath: path.join(__dirname, '../data/close_approaches.csv'),
	batchSize: 500,
	query: `INSERT INTO Close_Approaches  
	(spkid, date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s, rarity) 
	VALUES ?`
}

const TERTIARY = {
	table: 'Orbits',
	filePath: path.join(__dirname, '../data/orbits.csv'),
	batchSize: 500,
	query: `INSERT INTO Orbits 
	(spkid, orbital_class, eccentricity, years) VALUES ?`
}

async function seed() {
	const connection = await db.getConnection()
	try {
		await connection.beginTransaction()
		await emptyTables(connection)  // Prevent duplicates
		await streamPrimary(connection)
		await streamSecondary(connection)
		await streamTertiary(connection)
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

async function streamPrimary(connection) {
	const batch = []
	const fileStream = createReadStream(PRIMARY.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = primaryValues(row)
		batch.push(values)
		if (batch.length >= PRIMARY.batchSize) {
			await connection.query(PRIMARY.query, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(PRIMARY.query, [batch])
	}
}

const primaryValues = (row) => [
	row['spkid'],
	formatName(row['full_name']),
	row['moid_ld'],
	safeFloat(row['H']),
	safeFloat(row['rot_per']),
	parsePHA(row['pha']),
]

function formatName(value) {
	return value.trimStart()
}

function parsePHA(value) {
	return value === 'Y' ? true : false
}

async function streamSecondary(connection) {
	const batch = []
	const spkidMap = await mapSpkid(connection)
	const fileStream = createReadStream(SECONDARY.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const spkid = spkidMap.get(row['Object'])
		if (!spkid) continue

		const values = secondaryValues(row, spkid)
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

const secondaryValues = (row, spkid) => [
	spkid,
	formatDate(row['Close-Approach (CA) Date']),
	safeFloat(row['CA DistanceNominal (km)']),
	safeFloat(row['CA DistanceMinimum (km)']),
	safeFloat(row['V relative(km/s)']),
	safeInt(row['Rarity'])
]

async function mapSpkid(connection) {
	const [rows] = await connection.query(
		`SELECT spkid, name FROM Near_Earth_Objects`)
	
	const map = new Map()
	for (const row of rows) {
		map.set(row.name, row.spkid)
	}
	
	return map
}

function formatDate(date) {
	const parsedDate = parse(
		date.split('±')[0].trim(), 'yyyy-MMM-dd HH:mm', new Date())
	const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss')

	return formattedDate
}

async function streamTertiary(connection) {
	const batch = []
	const fileStream = createReadStream(TERTIARY.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = tertiaryValues(row)
		batch.push(values)
		if (batch.length >= TERTIARY.batchSize) {
			await connection.query(TERTIARY.query, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(TERTIARY.query, [batch])
	}
}

const tertiaryValues = (row) => [
	row['spkid'],
	row['class'],
	safeFloat(row['e']),
	safeFloat(row['per_y']),
]

function safeFloat(val) {
	const parsedFloat = parseFloat(val)
	return Number.isNaN(parsedFloat) ? null : parsedFloat
}

function safeInt(val) {
	const parsedInt = parseInt(val)
	return Number.isNaN(parsedInt) ? null : parsedInt
}

seed().catch(console.error)