import { useMemo, useState } from "react";

export const useTaxCalculations = () => {
	const [billAmount, setBillAmount] = useState<number>(0);

	const handlers = useMemo(
		() => ({
			onBillChange: (value: number) => setBillAmount(value),
			onGrossChange: (value: number) =>
				setBillAmount(Math.round(value * 1.3142)),
			onNetChange: (value: number) =>
				setBillAmount(Math.round((value * 1.3142) / 0.7)),
		}),
		[]
	);

	return [
		{
			billAmount,
			gross: Math.round(billAmount / 1.3142),
			net: Math.round((billAmount / 1.3142) * 0.7),
			employmentFee: Math.round((billAmount / 1.3142) * 0.3142),
		},
		handlers,
	] as const;
};
