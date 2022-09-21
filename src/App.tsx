import { useState } from "react";
import { Input } from "./components/Input";

function App() {
	const [billAmount, setBillAmount] = useState<number>(0);
	const [gross, setGross] = useState<number>(0);
	const [net, setNet] = useState<number>(0);

	let employmentFee = Math.round(gross * 0.3142);

	return (
		<main>
			<section>
				<form style={{ minWidth: "0" }}>
					<Input
						label="Belopp exkl moms"
						value={billAmount}
						onChange={(value) => {
							setBillAmount(value);
							setGross(Math.round(value / 1.3142));
							setNet(Math.round((value / 1.3142) * 0.7));
						}}
					/>
					<Input label="Arbetsgivaravgift" value={employmentFee} disabled />
					<Input
						label="Lön före skatt"
						value={gross}
						onChange={(value) => {
							setBillAmount(Math.round(value * 1.3142));
							setGross(value);
							setNet(Math.round(value * 0.7));
						}}
					/>
					<Input
						label="Lön efter 30 % skatt"
						value={net}
						onChange={(value) => {
							setBillAmount(Math.round((value * 1.3142) / 0.7));
							setGross(Math.round(value / 0.7));
							setNet(value);
						}}
					/>
				</form>
			</section>
		</main>
	);
}

export default App;
