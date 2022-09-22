import { useMemo, useState } from "react";

export const useTaxCalculations = () => {
	const [billAmount, setBillAmount] = useState<number | "">("");
	const [gross, setGross] = useState<number | "">("");
	const [net, setNet] = useState<number | "">("");

	const handlers = useMemo(
		() => ({
			onBillChange: (value: number | "") => {
				setBillAmount(value);
				setGross(value === "" ? "" : Math.round(value / 1.3142));
				setNet(value === "" ? "" : Math.round((value / 1.3142) * 0.7));
			},
			onGrossChange: (value: number | "") => {
				setBillAmount(value === "" ? "" : Math.round(value * 1.3142));
				setGross(value);
				setNet(value === "" ? "" : Math.round(value * 0.7));
			},
			onNetChange: (value: number | "") => {
				setBillAmount(value === "" ? "" : Math.round((value * 1.3142) / 0.7));
				setGross(value === "" ? "" : Math.round(value / 0.7));
				setNet(value);
			},
		}),
		[]
	);

	return [
		{
			billAmount,
			gross,
			net,
			employmentFee:
				billAmount === "" ? "" : Math.round((billAmount / 1.3142) * 0.3142),
		},
		handlers,
	] as const;
};
