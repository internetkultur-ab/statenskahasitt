import { useMemo, useState } from "react";

export const useTaxCalculations = () => {
	const [billAmount, setBillAmount] = useState<number | "">("");

	const handlers = useMemo(
		() => ({
			onBillChange: (value: number | "") => setBillAmount(value),
			onGrossChange: (value: number | "") =>
				setBillAmount(value === "" ? "" : Math.round(value * 1.3142)),
			onNetChange: (value: number | "") =>
				setBillAmount(value === "" ? "" : Math.round((value * 1.3142) / 0.7)),
		}),
		[]
	);

	return [
		{
			billAmount,
			gross: billAmount === "" ? "" : Math.round(billAmount / 1.3142),
			net: billAmount === "" ? "" : Math.round((billAmount / 1.3142) * 0.7),
			employmentFee:
				billAmount === "" ? "" : Math.round((billAmount / 1.3142) * 0.3142),
		},
		handlers,
	] as const;
};
