/**
 * Merges and exports all GraphQL schemas.
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load all .js schema files in this directory except this index file.
const rawTypes = loadFilesSync([
	path.join(__dirname, '*.js'),
	'!' + path.join(__dirname, 'index.js')
])

// loadFilesSync returns module exports (objects). Each schema module exports
// a named const (e.g. `export const neo = gql`), so extract the first
// exported value (the SDL DocumentNode / string) from each module before
// passing to mergeTypeDefs.
const typesArray = rawTypes.map(mod => {
	if (mod && typeof mod === 'object' && !('kind' in mod)) {
		const vals = Object.values(mod)
		return vals[0]
	}
	return mod
})

export const typeDefs = mergeTypeDefs(typesArray)