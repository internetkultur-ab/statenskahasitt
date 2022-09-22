import { useTaxCalculations } from "../hooks/useTaxCalculations";
import { Input } from "./Input";

interface CalculatorProps {}

export const Calculator = ({}: CalculatorProps): JSX.Element => {
	const [
		{ billAmount, employmentFee, gross, net },
		{ onBillChange, onGrossChange, onNetChange },
	] = useTaxCalculations();

	return (
		<form style={{ minWidth: "0" }}>
			<Input
				label="Belopp exkl moms"
				value={billAmount}
				onChange={onBillChange}
			/>
			<Input label="Arbetsgivaravgift" value={employmentFee} disabled />
			<Input label="Lön före skatt" value={gross} onChange={onGrossChange} />
			<Input label="Lön efter 30 % skatt" value={net} onChange={onNetChange} />
		</form>
	);
};
