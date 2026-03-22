/**
 * Stores configuration objects for the datasets.
 */

import { fileURLToPath } from 'url'
import path from 'path'
import * as format from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const NEOS = {
	filePath: path.join(__dirname, '../data/near_earth_objects.csv'),
	table: 'near_earth_objects',
	query: 
	`INSERT INTO near_earth_objects  
	(spkid, name, earth_moid_ld, magnitude, rotation_hours, pot_hazardous_asteroid) 
	VALUES ?`,
	/**
	 * Extract CSV data and modify it where needed,
	 * so it can be safely inserted into the DB
	 */
 	transform: (row) => [  
		row['spkid'],
		format.name(row['full_name']),
		format.float(row['moid_ld']),
		format.float(row['H']),
		format.float(row['rot_per']),
		format.pha(row['pha']),
	]
}

export const ORBITS = {
	filePath: path.join(__dirname, '../data/orbits.csv'),
	table: 'orbits',
	query: 
	`INSERT INTO orbits 
	(spkid, orbital_class, eccentricity, years) 
	VALUES ?`,
	transform: (row) => [
		row['spkid'],
		row['class'],
		format.float(row['e']),
		format.float(row['per_y']),
	]
}

export const APPROACHES = {
	filePath: path.join(__dirname, '../data/close_approaches.csv'),
	table: 'close_approaches',
	query: 
	`INSERT INTO close_approaches  
	(spkid, date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s, rarity) 
	VALUES ?`,
  transform: (row, { spkids }) => {
		// The file of Approaches only has the names of the NEOs,
		// not their spkids (unique IDs), so before inserting spkid,
		// we have to get it from the NEO dataset
		const spkid = spkids.get(row['Object'])
		if (!spkid) return null

		return [
			spkid,
			format.date(row['Close-Approach (CA) Date']),
			format.float(row['CA DistanceNominal (km)']),
			format.float(row['CA DistanceMinimum (km)']),
			format.float(row['V relative(km/s)']),
			format.int(row['Rarity'])
		]
	} 
}