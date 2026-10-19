import { useState } from "react";
import { parseNumber } from "../lib/parseNumber";

interface InputProps {
	label: string;
	value: number | "";
	name: string;
	onChange?: (value: number | "") => void;
	disabled?: boolean;
	tag?: string;
}

export const Input = ({
	label,
	value,
	onChange,
	disabled,
	tag,
	name,
}: InputProps): JSX.Element => {
	// Råtext medan fältet redigeras, så att inklistrade och delvis skrivna
	// tal ("35 937,5") inte äts upp av nummertolkningen under tiden.
	const [raw, setRaw] = useState<string | null>(null);
	const display = raw ?? (value === "" ? "" : String(value));

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<label htmlFor={name}>
				{label} {tag && <sup>{tag}</sup>}
			</label>
			<input
				type="text"
				inputMode="decimal"
				value={display}
				onChange={(e) => {
					setRaw(e.target.value);
					onChange && onChange(parseNumber(e.target.value));
				}}
				onBlur={() => setRaw(null)}
				disabled={disabled}
			/>
		</div>
	);
};
