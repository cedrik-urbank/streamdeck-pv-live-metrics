/**
 * A utility class for interacting with Shelly devices to fetch power consumption and production data.
 * This class provides static methods to retrieve the total power consumption of a house and the current power output of PV systems.
 * It also includes a method to calculate the total power output from multiple PV systems.
 */
export default class ShellyApi {
	/**
	 * Fetches the total power consumption of the house from the Shelly device at the given IP address.
	 * @param ip The IP address of the Shelly device.
	 * @returns The total power consumption in watts.
	 * @throws An error if the request fails or the response is invalid.
	 */
	public static async getHousePower(ip: string) {
		const res = await fetch(`http://${ip}/status`);

		if (!res.ok) throw new Error("House meter offline");

		const json: unknown = await res.json();

		if (typeof json !== "object" || json === null) throw new Error("Invalid response from house meter");

		return (
			json as {
				/**
				 * The total power consumption of the house in watts.
				 */
				total_power: number;
			}
		).total_power;
	}

	/**
	 * Fetches the current power output of a PV system from the Shelly device at the given IP address.
	 * @param ip The IP address of the Shelly device.
	 * @returns The current power output in watts.
	 * @throws An error if the request fails or the response is invalid.
	 */
	public static async getPvPower(ip: string) {
		const res = await fetch(`http://${ip}/meter/0`);

		if (!res.ok) throw new Error(ip);

		const json: unknown = await res.json();

		if (typeof json !== "object" || json === null) throw new Error("Invalid response from PV meter");

		return (
			json as {
				/**
				 * The current power output of the PV system in watts.
				 */
				power: number;
			}
		).power;
	}

	/**
	 * Fetches the total power output of all PV systems from the Shelly devices at the given IP addresses.
	 * @param ips The IP addresses of the Shelly devices.
	 * @returns The total power output in watts.
	 * @throws An error if any request fails or the response is invalid.
	 */
	public static async getTotalPvPower(ips: string[]) {
		const results = await Promise.allSettled(ips.map((ip) => this.getPvPower(ip)));

		let total = 0;

		for (const result of results) {
			if (result.status === "fulfilled") total += result.value;
		}

		return total;
	}
}
