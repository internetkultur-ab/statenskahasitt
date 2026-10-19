import { availableTabellNr } from "../lib/taxTable";
import type { TaxHandlers, TaxState } from "../hooks/useTaxCalculations";
import { Input } from "./Input";

interface CalculatorProps {
	state: TaxState;
	handlers: TaxHandlers;
}

export const Calculator = ({ state, handlers }: CalculatorProps): JSX.Element => {
	const { billAmount, employmentFee, gross, net, taxMode, tabellNr } = state;
	const {
		onBillChange,
		onGrossChange,
		onNetChange,
		onTaxModeChange,
		onTabellNrChange,
	} = handlers;

	return (
		<>
			<div>
				<input
					id="mode-schablon"
					type="radio"
					name="taxMode"
					checked={taxMode === "schablon"}
					onChange={() => onTaxModeChange("schablon")}
				/>{" "}
				<label htmlFor="mode-schablon">Schablon 30&nbsp;%</label>{" "}
				<input
					id="mode-tabell"
					type="radio"
					name="taxMode"
					checked={taxMode === "tabell"}
					onChange={() => onTaxModeChange("tabell")}
				/>{" "}
				<label htmlFor="mode-tabell">Skattetabell</label>
			</div>
			{taxMode === "tabell" && (
				<select
					aria-label="Tabellnummer"
					value={tabellNr}
					style={{ width: "calc(100% - 1.6rem)" }}
					onChange={(e) => onTabellNrChange(Number(e.target.value))}
				>
					{availableTabellNr.map((nr) => (
						<option key={nr} value={nr}>
							Tabell {nr}
						</option>
					))}
				</select>
			)}
			<Input
				name="billAmount"
				label="Belopp exkl. moms"
				value={billAmount}
				tag="fakturabelopp"
				onChange={onBillChange}
			/>
			<Input
				name="employmentFee"
				label="Arbetsgivaravgift"
				value={employmentFee}
				disabled
			/>
			<Input
				name="gross"
				label="Lön före skatt"
				value={gross}
				onChange={onGrossChange}
			/>
			<Input
				name="net"
				label={taxMode === "schablon" ? "Lön efter 30 % skatt" : "Lön efter skatt"}
				value={net}
				onChange={onNetChange}
			/>
		</>
	);
};
