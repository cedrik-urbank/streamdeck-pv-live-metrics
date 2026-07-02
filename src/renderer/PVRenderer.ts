/* eslint-disable jsdoc/require-jsdoc */
export default class PVRenderer {
	public static render(data: { pv: number; consumption: number; percent: number }) {
		const color = this.getColor(data.percent);

		const percent = Math.round(data.percent);
		const consumption = Math.round(data.consumption);

		const cx = 72;
		const cy = 65;
		const radius = 43;

		const progress = Math.min(percent, 100) / 100;

		const start = Math.PI;
		const end = Math.PI + Math.PI * progress;

		const x1 = cx + radius * Math.cos(start);
		const y1 = cy + radius * Math.sin(start);

		const x2 = cx + radius * Math.cos(end);
		const y2 = cy + radius * Math.sin(end);

		const arc = `
			M ${x1} ${y1}
			A ${radius} ${radius} 0 0 1 ${x2} ${y2}
		`;

		const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">

	<!-- background -->
	<rect
		width="144"
		height="144"
		rx="22"
		fill="#0b1220"/>


	<!-- gauge background -->
	<path
		d="M29 65 A43 43 0 0 1 115 65"
		fill="none"
		stroke="#263241"
		stroke-width="10"
		stroke-linecap="round"/>


	<!-- gauge progress -->
	<path
		d="${arc}"
		fill="none"
		stroke="${color}"
		stroke-width="10"
		stroke-linecap="round"/>


	<!-- percent -->
	<text
		x="72"
		y="78"
		text-anchor="middle"
		font-size="30"
		font-weight="700"
		fill="#ffffff">
		${percent}%
	</text>


	<!-- divider -->
	<line
		x1="25"
		y1="96"
		x2="119"
		y2="96"
		stroke="#334155"
		stroke-width="2"/>


	<!-- consumption label -->
	<text
		x="72"
		y="125"
		text-anchor="middle"
		font-size="26"
		font-weight="800"
		fill="#ffffff">
		${consumption}W
	</text>

</svg>`;

		return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
	}

	private static getColor(percent: number) {
		if (percent < 5) return "#ef4444"; // red – almost no coverage
		if (percent < 20) return "#f97316"; // orange – low coverage
		if (percent < 50) return "#eab308"; // yellow – moderate coverage
		if (percent < 80) return "#22c55e"; // green – good coverage

		return "#16a34a"; // dark green – excellent / near full
	}
}
