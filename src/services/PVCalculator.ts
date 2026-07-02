import { PVOverviewSettings } from "../actions/pv-overview";
import ShellyApi from "../api/ShellyApi";
import Validator from "./Validator";

/**
 * Calculator for handling PV (Photovoltaic) related calculations.
 */
export default class PVCalculator {
	/**
	 * Refreshes the PV overview data based on the provided settings.
	 * @param settings The settings for the PV overview.
	 * @returns A promise resolving to the calculated PV overview data.
	 */
	public static async refresh(settings: PVOverviewSettings) {
		if (!Validator.validateSettings(settings)) throw new Error("Invalid settings");

		if (settings.houseIp === undefined || settings.pvIps === undefined) throw new Error("Missing settings");

		const pvIps = Validator.parsePvIps(settings.pvIps);

		// Grid connection:
		// positive = importing power
		// negative = exporting power
		const grid = await ShellyApi.getHousePower(settings.houseIp);

		// Total power generation of all PV systems
		const pv = await ShellyApi.getTotalPvPower(pvIps);

		/**
		 * Actual household consumption.
		 *
		 * Calculated from PV generation and grid power flow.
		 */
		const consumption = Math.max(pv + grid, 0);

		/**
		 * Percentage of household consumption covered by PV.
		 *
		 * Limited to 100% when there is excess generation.
		 */
		const percent = consumption > 0 ? Math.min((pv / consumption) * 100, 100) : 0;

		const exporting = grid < 0 ? Math.abs(grid) : 0;

		const importing = grid > 0 ? grid : 0;

		return {
			// Grid power flow
			grid,

			// PV generation
			pv,

			// Household consumption
			consumption,

			// PV coverage percentage
			percent,

			// Power imported from the grid
			importing,

			// Power exported to the grid
			exporting,
		};
	}
}
