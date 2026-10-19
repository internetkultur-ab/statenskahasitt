import raw2026 from "../../2026.csv?raw";

export interface TaxBracket {
	from: number;
	to?: number;
	tax: number;
}

export const TAX_YEAR = 2026;

// När nästa års tabell kommer: lägg CSV-filen i projektroten, importera den
// här nedanför och lägg till den i listan.
const csvFiles = [raw2026];

// Parsar Skatteverkets filformat: År;Antal dgr;Tabellnr;Inkomst fr.o.m.;
// Inkomst t.o.m.;Kolumn 1..7. Vi använder månadstabellerna (30B) och
// kolumn 1 (lön/arvode för den som inte fyllt 66 år).
const parse = (csv: string): Record<number, TaxBracket[]> => {
	const tables: Record<number, TaxBracket[]> = {};
	for (const line of csv.replace(/^\uFEFF/, "").split(/\r?\n/)) {
		const cols = line.split(";");
		if (cols[1] !== "30B") continue;
		const tabellNr = Number(cols[2]);
		const from = Number(cols[3]);
		const to = cols[4] === "" ? undefined : Number(cols[4]);
		const tax = Number(cols[5]);
		if (Number.isNaN(tabellNr) || Number.isNaN(from) || Number.isNaN(tax)) {
			continue;
		}
		if (!tables[tabellNr]) tables[tabellNr] = [];
		tables[tabellNr].push({ from, to, tax });
	}
	for (const brackets of Object.values(tables)) {
		brackets.sort((a, b) => a.from - b.from);
	}
	return tables;
};

export const skattetabeller: Record<number, TaxBracket[]> = Object.freeze(
	csvFiles.reduce<Record<number, TaxBracket[]>>((acc, csv) => {
		const tables = parse(csv);
		for (const [tabellNr, brackets] of Object.entries(tables)) {
			acc[Number(tabellNr)] = brackets;
		}
		return acc;
	}, {})
);

export const DEFAULT_TABELL_NR = 29;
