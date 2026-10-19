import {
	DEFAULT_TABELL_NR,
	skattetabeller,
	TaxBracket,
} from "../data/skattetabell";

export const availableTabellNr: number[] = Object.keys(skattetabeller)
	.map(Number)
	.sort((a, b) => a - b);

const bracketsFor = (tabellNr: number): TaxBracket[] =>
	skattetabeller[tabellNr] || skattetabeller[DEFAULT_TABELL_NR];

// Skatteverket: lönen avrundas till närmast lägre 100-talsbelopp innan
// skattetabellen tillämpas.
const roundDownTo100 = (gross: number): number => Math.floor(gross / 100) * 100;

const taxForRounded = (brackets: TaxBracket[], rounded: number): number => {
	let lo = 0;
	let hi = brackets.length - 1;
	let index = 0;
	while (lo <= hi) {
		const mid = (lo + hi) >> 1;
		if (brackets[mid].from <= rounded) {
			index = mid;
			lo = mid + 1;
		} else {
			hi = mid - 1;
		}
	}
	// Inkomst under tabellens första respektive över dess sista skikt
	// använder ytterligare respektive sista radens skattebelopp.
	return brackets[index].tax;
};

export const taxFromGross = (gross: number, tabellNr: number): number =>
	taxForRounded(bracketsFor(tabellNr), roundDownTo100(gross));

export const netFromGross = (gross: number, tabellNr: number): number =>
	gross - taxFromGross(gross, tabellNr);

// Söker tillbaka: vilken lön ger den efterfrågade nettolönen?
// Skatten beräknas på lönen avrundad nedåt till 100-tal, så nettolönen är
// inte monoton (skatten kliver t.ex. från 0 till 150 kr vid 2 100 kr) -
// därför letar vi rad för rad. Exakt träff vinner (högstade lönen), annars
// den lön som ger minst möjliga överavdrag.
export const grossFromNet = (net: number, tabellNr: number): number => {
	const brackets = bracketsFor(tabellNr);
	let bestExact = -1;
	let bestOver: { gross: number; net: number } | undefined;

	for (const bracket of brackets) {
		// 100-talslöner som hanteras av denna rad
		const slabStart =
			bracket === brackets[0] ? 0 : Math.ceil(bracket.from / 100) * 100;
		const slabEnd = bracket.to
			? Math.floor(bracket.to / 100) * 100
			: Math.ceil(bracket.from / 100) * 100;

		// Löner i [m, m + 99] ger skatten för 100-talsbeloppet m
		const gross = net + bracket.tax;
		if (gross >= slabStart && gross <= slabEnd + 99) {
			bestExact = Math.max(bestExact, gross);
		}

		const lowestNetInSlab = slabStart - bracket.tax;
		if (
			lowestNetInSlab >= net &&
			(!bestOver || lowestNetInSlab < bestOver.net)
		) {
			bestOver = { gross: slabStart, net: lowestNetInSlab };
		}
	}

	if (bestExact >= 0) {
		return bestExact;
	}
	if (bestOver) {
		return bestOver.gross;
	}
	// Önskad nettolön överstiger tabellen - högsta täckta lönen
	const last = brackets[brackets.length - 1];
	return last.to ? Math.floor(last.to / 100) * 100 : Math.ceil(last.from / 100) * 100;
};
