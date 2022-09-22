interface InputProps {
	label: string;
	value: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
}

export const Input = ({
	id,
	value,
	onChange,
	disabled,
}: InputProps): JSX.Element => {
	return (
			<input
				type="number"
				id={id}
				name={id}
				value={value}
				onChange={(e) => {
					let value = +e.target.value;
					onChange && onChange(value);
				}}
				disabled={disabled}
			/>
	);
};
