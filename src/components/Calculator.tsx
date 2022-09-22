import { useTaxCalculations } from "../hooks/useTaxCalculations";
import { Input } from "./Input";

interface CalculatorProps {}

export const Calculator = ({}: CalculatorProps): JSX.Element => {
	const valueFromPath = window.location.pathname.split("/").filter(Boolean)[0];
	const [
		{ billAmount, employmentFee, gross, net },
		{ onBillChange, onGrossChange, onNetChange },
	] = useTaxCalculations(
		Number.isNaN(+valueFromPath) ? undefined : +valueFromPath
	);

	return (
		<>
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
				label="Lön efter 30 % skatt"
				value={net}
				onChange={onNetChange}
			/>
		</>
	);
};
