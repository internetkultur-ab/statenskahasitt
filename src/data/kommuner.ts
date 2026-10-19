import raw2026 from "../../skattesatser-kommuner-2026.txt?raw";

export interface Kommun {
	name: string;
	rate: number;
	tabellNr: number;
	// Kyrkomedlemmars tabell, om samtliga församlingar i kommunen ger samma
	// tabellnummer. Annars null - då krävs val av enskild församling.
	tabellNrMedlem: number | null;
}

export interface Forsamling {
	name: string;
	kommun: string;
	rate: number; // summa inkl. kyrkoavgift
	tabellNr: number;
}

const prettyName = (upper: string): string =>
	upper
		.toLowerCase()
		.replace(/(^|[\s\-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());

// Parsar Skatteverkets fil "Skattesatser och kommuner": År, Församlingskod,
// Kommun, Församling, Summa inkl./exkl. kyrkoavgift, ... En rad per församling.
// Skattesatsen avrundas till hela procent vilket ger tabellnumret (tabell
// 29-42 beräknas för skattesatserna 29-42 %) - exklusive kyrkoavgift för den
// som inte betalar kyrkoavgift, inklusive för den som gör det.
const parse = (txt: string): { kommuner: Kommun[]; forsamlingar: Forsamling[] } => {
	const kommunRates = new Map<string, number>();
	const kommunMemberTabeller = new Map<string, Set<number>>();
	const forsamlingar: Forsamling[] = [];
	const seenForsamlingar = new Set<string>();

	for (const line of txt.replace(/^\uFEFF/, "").split(/\r?\n/)) {
		const cols = line.split("\t");
		if (cols[0] !== "2026") continue;
		const kommun = cols[2];
		const forsamling = cols[3];
		const inkl = Number(cols[4]);
		const exkl = Number(cols[5]);
		if (!kommun || !forsamling || Number.isNaN(inkl) || Number.isNaN(exkl)) {
			continue;
		}
		if (!kommunRates.has(kommun)) kommunRates.set(kommun, exkl);
		if (!kommunMemberTabeller.has(kommun)) {
			kommunMemberTabeller.set(kommun, new Set());
		}
		kommunMemberTabeller.get(kommun)!.add(Math.round(inkl));
		const key = `${kommun}\u0000${forsamling}`;
		if (!seenForsamlingar.has(key)) {
			seenForsamlingar.add(key);
			forsamlingar.push({
				name: prettyName(forsamling),
				kommun: prettyName(kommun),
				rate: inkl,
				tabellNr: Math.round(inkl),
			});
		}
	}

	const kommuner: Kommun[] = Array.from(kommunRates, ([name, rate]) => {
		const memberTabeller = kommunMemberTabeller.get(name)!;
		const memberTabellerArr = Array.from(memberTabeller);
		return {
			name: prettyName(name),
			rate,
			tabellNr: Math.round(rate),
			tabellNrMedlem:
				memberTabellerArr.length === 1 ? memberTabellerArr[0] : null,
		};
	}).sort((a, b) => a.name.localeCompare(b.name, "sv"));

	forsamlingar.sort(
		(a, b) =>
			a.kommun.localeCompare(b.kommun, "sv") ||
			a.name.localeCompare(b.name, "sv")
	);

	return { kommuner, forsamlingar };
};

const { kommuner, forsamlingar } = parse(raw2026);

export { kommuner, forsamlingar };

export const findKommun = (name: string): Kommun | undefined =>
	kommuner.find((k) => k.name === name);

export const findForsamling = (
	kommunName: string,
	name: string
): Forsamling | undefined =>
	forsamlingar.find((f) => f.kommun === kommunName && f.name === name);
