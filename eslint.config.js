import { config } from "@elgato/eslint-config";

export default [
	...config.recommended,
	{
		ignores: [
			"dist/**",
			"**/*.streamDeckPlugin",
			"**/*.sdPlugin",
			"de.cedrik.pv-live-metrics.sdPlugin/**/*.js",
		],
	},
];
