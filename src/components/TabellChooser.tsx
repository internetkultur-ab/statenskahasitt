import { useMemo, useState } from "react";
import { kommuner, forsamlingar } from "../data/kommuner";
import { TAX_YEAR } from "../data/skattetabell";
import type { TaxHandlers, TaxState } from "../hooks/useTaxCalculations";

interface TabellChooserProps {
	state: TaxState;
	handlers: TaxHandlers;
}

interface Row {
	key: string;
	kommun: string;
	forsamling?: string;
	tabellNr: number;
	rate: number;
}

const MAX_SHOWN = 60;

const formatRate = (rate: number): string => rate.toFixed(2).replace(".", ",");

// "Adolf Fredriks Församling" -> "Adolf Fredriks" (kommunnamnet redan visat)
const shortForsamling = (name: string): string =>
	name.replace(/\sFörsamlingen?$/i, "");

export const TabellChooser = ({
	state,
	handlers,
}: TabellChooserProps): JSX.Element => {
	const { member, kommun, forsamling, tabellNr, taxMode } = state;
	const {
		onKommunChange,
		onForsamlingChange,
		onMemberChange,
		onTaxModeChange,
	} = handlers;
	const [query, setQuery] = useState("");

	const rows = useMemo((): Row[] => {
		const q = query.trim().toLowerCase();
		if (member) {
			return forsamlingar
				.filter(
					(f) =>
						q === "" ||
						f.name.toLowerCase().includes(q) ||
						f.kommun.toLowerCase().includes(q)
				)
				.map((f) => ({
					key: `${f.kommun} – ${f.name}`,
					kommun: f.kommun,
					forsamling: f.name,
					tabellNr: f.tabellNr,
					rate: f.rate,
				}));
		}
		return kommuner
			.filter((k) => q === "" || k.name.toLowerCase().includes(q))
			.map((k) => ({
				key: k.name,
				kommun: k.name,
				tabellNr: k.tabellNr,
				rate: k.rate,
			}));
	}, [query, member]);

	const shown = rows.slice(0, MAX_SHOWN);

	const pick = (row: Row): void => {
		if (row.forsamling) {
			onForsamlingChange(row.kommun, row.forsamling);
		} else {
			onKommunChange(row.kommun);
		}
		// Picken är meningslös om kalkylen står i schablonläget.
		if (taxMode !== "tabell") {
			onTaxModeChange("tabell");
		}
	};

	return (
		<>
			<p>
				{member
					? `Skattetabellen inkluderar kyrkoavgift - välj din församling. Gäller kolumn 1, ${TAX_YEAR}.`
					: `Skattetabellen avgörs av kommunens skattesats. Valet gäller kolumn 1 för ${TAX_YEAR} och passar dig som inte betalar kyrkoavgift.`}
			</p>
			<input
				id="kyrkomedlem"
				type="checkbox"
				checked={member}
				onChange={(e) => onMemberChange(e.target.checked)}
			/>{" "}
			<label htmlFor="kyrkomedlem">Medlem i Svenska kyrkan</label>
			<label htmlFor="kommun-sok">
				Kommun där du var folkbokförd den 1 november förra året
			</label>
			<input
				id="kommun-sok"
				type="search"
				placeholder={member ? "Sök kommun eller församling…" : "Sök kommun…"}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<table style={{ marginBottom: "1rem" }}>
				<thead>
					<tr>
						<th>Kommun</th>
						{member && <th>Församling</th>}
						<th>Tabell</th>
						<th>Skattesats</th>
					</tr>
				</thead>
				<tbody>
					{shown.map((row) => {
						const selected = row.forsamling
							? forsamling === row.forsamling && kommun === row.kommun
							: kommun === row.kommun;
						return (
							<tr
								key={row.key}
								style={{
									cursor: "pointer",
									fontWeight: selected ? "bold" : undefined,
								}}
								onClick={() => pick(row)}
							>
								<td>{row.kommun}</td>
								{member && (
									<td>{row.forsamling && shortForsamling(row.forsamling)}</td>
								)}
								<td>{row.tabellNr}</td>
								<td>{formatRate(row.rate)}&nbsp;%</td>
							</tr>
						);
					})}
					{rows.length === 0 && (
						<tr>
							<td colSpan={member ? 4 : 3}>Ingen kommun hittades.</td>
						</tr>
					)}
				</tbody>
			</table>
			{rows.length > shown.length && (
				<p style={{ margin: 0 }}>
					<small>
						Visar {shown.length} av {rows.length} - förfina sökningen.
					</small>
				</p>
			)}
			<p style={{ marginTop: ".5rem", marginBottom: 0 }}>
				Din tabell: <strong>{tabellNr}</strong>
				{kommun ? ` (${kommun}${forsamling ? ` – ${shortForsamling(forsamling)}` : ""})` : ""}
			</p>
			<button
				type="button"
				style={{
					background: "none",
					border: "none",
					padding: 0,
					color: "#07c",
					textDecoration: "underline",
					cursor: "pointer",
					font: "inherit",
				}}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				Till kalkylen ↑
			</button>
		</>
	);
};
