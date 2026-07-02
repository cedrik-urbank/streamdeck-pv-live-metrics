import { PVOverviewSettings } from "../actions/pv-overview";

/**
 * Validator class provides static methods to validate IPv4 addresses and settings for the PV Overview action.
 */
export default class Validator {
	/**
	 * Checks if a string is a valid IPv4 address.
	 * @param ip The string to check.
	 * @returns True if the string is a valid IPv4 address, false otherwise.
	 */
	public static isIPv4(ip: string): boolean {
		return /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(ip);
	}

	/**
	 * Parses a string of IPv4 addresses separated by newlines.
	 * @param text The string to parse.
	 * @returns An array of valid IPv4 addresses.
	 */
	public static parsePvIps(text: string): string[] {
		return text
			.split(/\r?\n/)
			.map((v) => v.trim())
			.filter((v) => v.length > 0)
			.filter(this.isIPv4);
	}

	/**
	 * Validates the settings object for the PV Overview action.
	 * @param settings The settings object to validate.
	 * @returns True if the settings are valid, false otherwise.
	 */
	public static validateSettings(settings: PVOverviewSettings): boolean {
		if (!settings.houseIp || !settings.pvIps || settings.refresh === undefined) return false;

		if (!this.isIPv4(settings.houseIp)) return false;

		if (this.parsePvIps(settings.pvIps).length === 0) return false;

		if (settings.refresh < 1000) return false;

		return true;
	}
}
