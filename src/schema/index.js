/**
 * Merges and exports all GraphQL schemas.
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const typesArray = loadFilesSync(path.join(__dirname, '../src/schema/*.js'))
export const typeDefs = mergeTypeDefs(typesArray)