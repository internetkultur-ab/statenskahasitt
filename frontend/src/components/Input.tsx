interface InputProps {
	label: string;
	value: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
}

export const Input = ({
	label,
	value,
	onChange,
	disabled,
}: InputProps): JSX.Element => {
	return (
		<label>
			{label}
			<input
				type="number"
				value={value}
				onChange={(e) => {
					let value = +e.target.value;
					onChange && onChange(value);
				}}
				disabled={disabled}
			/>
		</label>
	);
};
