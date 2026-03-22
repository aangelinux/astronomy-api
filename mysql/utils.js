/**
 * Utility functions for formatting values.
 */

import { parse, format } from 'date-fns'

export function name(value) {
	return value.trimStart()
}

export function pha(value) {
	return value === 'Y' ? true : false
}

export function date(date) {
	const parsedDate = parse(
		date.split('±')[0].trim(), 'yyyy-MMM-dd HH:mm', new Date())
	const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss')

	return formattedDate
}

export function float(val) {
	const parsedFloat = parseFloat(val)
	return Number.isNaN(parsedFloat) ? null : parsedFloat
}

export function int(val) {
	const parsedInt = parseInt(val)
	return Number.isNaN(parsedInt) ? null : parsedInt
}