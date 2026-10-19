// Rensar inklistrade tal med svensk formatering: "35 937,00", "35.937,00",
// "35,937.00", "35 937" -> 35937. Mellanslag (även hårda och tunna) är
// tusentalsavgränsare; komma och punkt är decimaltecken - vid båda gäller
// det sista. Returnerar "" för tomt eller ogiltigt.
export const parseNumber = (text: string): number | "" => {
	const cleaned = text.replace(/\s/g, "");
	if (cleaned === "" || !/\d/.test(cleaned)) {
		return "";
	}

	let candidate = cleaned;
	const lastComma = candidate.lastIndexOf(",");
	const lastDot = candidate.lastIndexOf(".");
	const lastSep = Math.max(lastComma, lastDot);

	if (lastComma !== -1 && lastDot !== -1) {
		// Båda tecknen finns - det sista är decimaltecknet, det andra är
		// tusentalsavgränsare.
		const decimalSep = candidate[lastSep] === "," ? "," : ".";
		const groupSep = decimalSep === "," ? "." : ",";
		candidate = candidate.split(groupSep).join("");
		candidate = candidate.replace(decimalSep, ".");
	} else if (lastComma !== -1) {
		// Svenskt decimaltecken: "35,5" -> 35.5
		candidate = candidate.replace(/,/g, ".");
	} else if (lastDot !== -1 && /^\d{1,3}(\.\d{3})+$/.test(candidate)) {
		// Ensam punkt men tydligt tusental i svensk format: "35.937" -> 35937
		candidate = candidate.replace(/\./g, "");
	}

	const value = Number(candidate);
	return Number.isNaN(value) ? "" : value;
};
