import { useState } from "react";
import { Input } from "./components/Input";
import mvp from "mvp.css"

function App() {
	const [billAmount, setBillAmount] = useState<number>(0);
	const [gross, setGross] = useState<number>(0);
	const [net, setNet] = useState<number>(0);

	let employmentFee = Math.round(gross * 0.3142);

	return (
				<aside>
					<p>Här kan du räkna ut hur mycket som blir över till dig efter att staten har tagit sin del.</p>
					<p>&nbsp;</p>
					<label for="billAmount">Belopp ex moms <sup>fakturabelopp</sup></label>
					<Input
						id="billAmount"
						value={billAmount}
						onChange={(value) => {
							setBillAmount(value);
							setGross(Math.round(value / 1.3142));
							setNet(Math.round((value / 1.3142) * 0.7));
						}}
					/>
					<label for="employmentFee">Arbetsgivaravgift</label>
					<Input id="employmentFee" value={employmentFee} disabled />
					<label for="gross">Lön före skatt</label>
					<Input
						id="gross"
						value={gross}
						onChange={(value) => {
							setBillAmount(Math.round(value * 1.3142));
							setGross(value);
							setNet(Math.round(value * 0.7));
						}}
					/>
					<label for="net">Lön efter 30 % skatt</label>
					<Input
						id="net"
						value={net}
						onChange={(value) => {
							setBillAmount(Math.round((value * 1.3142) / 0.7));
							setGross(Math.round(value / 0.7));
							setNet(value);
						}}
					/>
				</aside>
	);
}

export default App;
