/* eslint-disable jsdoc/require-jsdoc */
import {
	action,
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

import PVRenderer from "../renderer/PVRenderer";
import PVCalculator from "../services/PVCalculator";
import Validator from "../services/Validator";

@action({ UUID: "de.cedrik.pv-live-metrics.pv-overview" })
export class PVOverView extends SingletonAction<PVOverviewSettings> {
	private timer?: NodeJS.Timeout;

	public override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
		this.restart(ev.action, ev.payload.settings);
	}

	public override async onKeyDown(ev: KeyDownEvent<PVOverviewSettings>): Promise<void> {
		this.refresh(ev.action, await ev.action.getSettings<PVOverviewSettings>());
	}

	public override async onWillAppear(ev: WillAppearEvent<PVOverviewSettings>): Promise<void> {
		const settings = await ev.action.getSettings<PVOverviewSettings>();

		settings.houseIp ??= "192.168.178.93";
		settings.pvIps ??= "192.168.178.167\n192.168.178.173\n192.168.178.170";
		settings.refresh ??= 5000;

		await ev.action.setSettings(settings);

		this.restart(ev.action, settings);
	}

	public override async onWillDisappear(): Promise<void> {
		this.stopTimer();
	}

	private async refresh(action: DialAction | KeyAction, settings: PVOverviewSettings) {
		try {
			if (!Validator.validateSettings(settings)) {
				await action.setTitle("SETUP");
				await action.setImage();
				return;
			}

			const result = await PVCalculator.refresh(settings);

			await action.setTitle("");
			await action.setImage(PVRenderer.render(result));

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			await action.setTitle("ERROR");
		}
	}

	private restart(action: DialAction | KeyAction, settings: PVOverviewSettings) {
		this.stopTimer();

		this.refresh(action, settings);

		const interval = Number(settings.refresh);

		this.timer = setInterval(() => {
			this.refresh(action, settings);
		}, interval);
	}

	private stopTimer() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}
}

export type PVOverviewSettings = {
	houseIp?: string;
	pvIps?: string;
	refresh?: number;
};
