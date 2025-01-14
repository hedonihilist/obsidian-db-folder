import { DateTime } from "luxon";
import { DEFAULT_SETTINGS } from "helpers/Constants";
import { LOGGER } from "services/Logger";

/**
 * Parse datetime to string using luxon
 * @param datetime 
 * @param format 
 * @returns 
 */
export function parseLuxonDatetimeToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        LOGGER.error(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`);
    }
    return result;
}

/**
 * Parse date to string using luxon
 * @param datetime 
 * @param format 
 * @returns 
 */
export function parseLuxonDateToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        LOGGER.error(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`);
    }
    return result;
}

/**
 * Parse string to datetime using luxon
 * @param datetime 
 * @param format 
 * @returns 
 */
export function parseStringToLuxonDatetime(datetime: string, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
        if (!result.isValid) {
            result = null;
        }
    } catch (e) {
        LOGGER.error(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`);
    }
    return result;
}

/**
 * Parse string to date using luxon
 * @param datetime 
 * @param format 
 * @returns 
 */
export function parseStringToLuxonDate(datetime: string, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
        if (!result.isValid) {
            result = null;
        }
    } catch (e) {
        LOGGER.error(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`);
    }
    return result;
}