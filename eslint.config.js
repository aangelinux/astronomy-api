import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { 
		files: ['**/*.{js,mjs,cjs}'], 
		languageOptions: { 
			globals: globals.browser 
		},
    rules: {
      'jsdoc/require-jsdoc': 'off',
			'no-unused-vars': 'off',
			'no-console': 'off'
    }
	},
])
