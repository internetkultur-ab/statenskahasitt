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
				type="number"
				value={value}
				onChange={(e) => {
					let value: "" | number = e.target.value === "" ? "" : +e.target.value;
					onChange && onChange(value);
				}}
				disabled={disabled}
			/>
		</div>
	);
};
