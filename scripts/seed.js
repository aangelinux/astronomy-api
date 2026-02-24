/**
 * Parses data from a CSV file and populates the database.
 */

import csvParser from 'csv-parser'
import { createReadStream } from 'fs'
import db from '../src/config/db.js'
import { parse, format } from 'date-fns'

const batch = []
const batchSize = 500
const bulkQuery = `
INSERT INTO Close_Approaches 
(neo_name, ca_date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s,
infinity_velocity_km_s, abs_magnitude, diameter_min_km, diameter_max_km, rarity) 
VALUES ?`

const safeFloat = (val) => {
	const parsedFloat = parseFloat(val)
	return Number.isNaN(parsedFloat) ? null : parsedFloat
}

const safeInt = (val) => {
	const parsedIn = parseInt(val)
	return Number.isNaN(parsedIn) ? null : parsedIn
}

async function populateDB() {
	const connection = await db.getConnection()
	try {
		await connection.beginTransaction()
		await connection.query('DELETE FROM Close_Approaches') // Prevent duplicated data

		const fileStream = createReadStream('./scripts/neo_close_approaches.csv')
			.pipe(csvParser())

		for await (const row of fileStream) {
			const date = parse(
				row['Close-Approach (CA) Date'].split('±')[0].trim(), 'yyyy-MMM-dd HH:mm', new Date())
			const parsedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
			const diameter = row['Diameter'].replace('m', '')

			let minDiameter, maxDiameter
			if (diameter.includes('±')) {
				[minDiameter, maxDiameter] = diameter.split('±')
			} else if (diameter.includes('-')) {
				[minDiameter, maxDiameter] = diameter.split('-')
			} else {
				minDiameter = diameter
				maxDiameter = diameter
			}

			const values = [
				row['Object'],
				parsedDate,
				safeFloat(row['CA DistanceNominal (km)']),
				safeFloat(row['CA DistanceMinimum (km)']),
				safeFloat(row['V relative(km/s)']),
				safeFloat(row['V infinity(km/s)']),
				safeFloat(row['H(mag)']),
				safeFloat(minDiameter),
				safeFloat(maxDiameter),
				safeInt(row['Rarity'])
			]

			batch.push(values)
			if (batch.length >= batchSize) {
				await connection.query(bulkQuery, [batch])
				batch.length = 0
			}
		}

		if (batch.length > 0) {
			await connection.query(bulkQuery, [batch])
		}

		await connection.commit()
		console.log('CSV file processed')
	} catch (error) {
		await connection.rollback()
		console.error('Error populating database: ', error.message)
	} finally {
		connection.release()
		process.exit()
	}
}

populateDB().catch(console.error)