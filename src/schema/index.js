/**
 * Merges and exports all GraphQL schemas.
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const types = loadFilesSync(path.join(__dirname, '*.schema.js'),)

// Check if the module is a schema object or DocumentNode (ie has 'kind'), and
// if true then extract the first module value (schema type) to use in typeDefs
const typesArray = types.map(module => {
	if (module && typeof module === 'object' && !('kind' in module)) {
		const values = Object.values(module)
		return values[0]
	}
	return module
})

export const typeDefs = mergeTypeDefs(typesArray)