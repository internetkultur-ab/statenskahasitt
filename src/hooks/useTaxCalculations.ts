import { useMemo, useState } from "react";
import { findForsamling, findKommun } from "../data/kommuner";
import { DEFAULT_TABELL_NR, skattetabeller } from "../data/skattetabell";
import { getCookie, setCookie } from "../lib/cookies";
import { grossFromNet, netFromGross } from "../lib/taxTable";

export type TaxMode = "schablon" | "tabell";

const MODE_COOKIE = "skattemode";
const KYRKA_COOKIE = "kyrkomedlem";
const KOMMUN_COOKIE = "kommun";
const FORSAMLING_COOKIE = "forsamling";
const TABELL_COOKIE = "skattetabellnr";

// /tabell/35
const tabellFromPath = (): number | undefined => {
	const match = window.location.pathname.match(/^\/tabell\/(\d+)\/?$/);
	if (!match) return undefined;
	const nr = Number(match[1]);
	return nr in skattetabeller ? nr : undefined;
};

const initialMode = (): TaxMode =>
	tabellFromPath() !== undefined
		? "tabell"
		: getCookie(MODE_COOKIE) === "tabell"
		? "tabell"
		: "schablon";

// Slår upp den sparade kommun-/församlingskombinationen och räknar fram
// vilket tabellnummer den motsvarar. Församlingen används bara för kyrko-
// medlemmar i kommuner där kyrkoavgiften påverkar tabellnumret.
const initialSelection = (): {
	kommun: string;
	forsamling: string;
	member: boolean;
	tabellNr: number;
} => {
	const tabellNrFromPath = tabellFromPath();
	if (tabellNrFromPath !== undefined) {
		// Explicit länk: /tabell/35 vinner över sparade val, och kalkylen
		// öppnas i tabelläget.
		return {
			kommun: "",
			forsamling: "",
			member: getCookie(KYRKA_COOKIE) === "1",
			tabellNr: tabellNrFromPath,
		};
	}
	const member = getCookie(KYRKA_COOKIE) === "1";
	const kommunName = getCookie(KOMMUN_COOKIE) || "";
	const kommun = findKommun(kommunName);
	if (!kommun) {
		const fallback = Number(getCookie(TABELL_COOKIE));
		return {
			kommun: "",
			forsamling: "",
			member,
			tabellNr:
				!Number.isNaN(fallback) && fallback in skattetabeller
					? fallback
					: DEFAULT_TABELL_NR,
		};
	}
	const forsamlingName = getCookie(FORSAMLING_COOKIE) || "";
	const forsamling = findForsamling(kommunName, forsamlingName);
	if (member) {
		if (forsamling) {
			return {
				kommun: kommun.name,
				forsamling: forsamling.name,
				member,
				tabellNr: forsamling.tabellNr,
			};
		}
		if (kommun.tabellNrMedlem !== null) {
			return {
				kommun: kommun.name,
				forsamling: "",
				member,
				tabellNr: kommun.tabellNrMedlem,
			};
		}
		// Tvetydig kommun - rätt tabell kräver val av församling, tills dess
		// gäller tabellnumret utan kyrkoavgift.
		return {
			kommun: kommun.name,
			forsamling: "",
			member,
			tabellNr: kommun.tabellNr,
		};
	}
	return {
		kommun: kommun.name,
		forsamling: "",
		member,
		tabellNr: kommun.tabellNr,
	};
};

export const useTaxCalculations = (billAmountInitial?: number) => {
	const [taxMode, setTaxMode] = useState<TaxMode>(initialMode);
	const initial = initialSelection();
	const [kommun, setKommun] = useState<string>(initial.kommun);
	const [forsamling, setForsamling] = useState<string>(initial.forsamling);
	const [member, setMember] = useState<boolean>(initial.member);
	const [tabellNr, setTabellNr] = useState<number>(initial.tabellNr);

	const grossFromBill = (bill: number): number => Math.round(bill / 1.3142);
	const billFromGross = (gross: number): number => Math.round(gross * 1.3142);
	const netFromGrossInMode = (
		mode: TaxMode,
		table: number,
		gross: number
	): number =>
		mode === "schablon" ? Math.round(gross * 0.7) : netFromGross(gross, table);

	const initialGross = billAmountInitial
		? grossFromBill(billAmountInitial)
		: undefined;

	const [billAmount, setBillAmount] = useState<number | "">(
		billAmountInitial || ""
	);
	const [gross, setGross] = useState<number | "">(initialGross || "");
	const [net, setNet] = useState<number | "">(
		initialGross
			? netFromGrossInMode(taxMode, initial.tabellNr, initialGross)
			: ""
	);

	const handlers = useMemo(
		() => ({
			onBillChange: (value: number | "") => {
				setBillAmount(value);
				const newGross = value === "" ? "" : grossFromBill(value);
				setGross(newGross);
				setNet(
					newGross === "" ? "" : netFromGrossInMode(taxMode, tabellNr, newGross)
				);
			},
			onGrossChange: (value: number | "") => {
				setGross(value);
				setBillAmount(value === "" ? "" : billFromGross(value));
				setNet(
					value === "" ? "" : netFromGrossInMode(taxMode, tabellNr, value)
				);
			},
			onNetChange: (value: number | "") => {
				setNet(value);
				if (taxMode === "schablon") {
					setBillAmount(value === "" ? "" : Math.round((value * 1.3142) / 0.7));
					setGross(value === "" ? "" : Math.round(value / 0.7));
				} else {
					const newGross =
						value === "" ? "" : grossFromNet(value, tabellNr);
					setGross(newGross);
					setBillAmount(newGross === "" ? "" : billFromGross(newGross));
				}
			},
			onTaxModeChange: (mode: TaxMode) => {
				setTaxMode(mode);
				setCookie(MODE_COOKIE, mode);
				if (gross !== "") {
					setNet(netFromGrossInMode(mode, tabellNr, gross));
				}
			},
			onKommunChange: (name: string) => {
				const kommun = findKommun(name);
				if (!kommun) return;
				setKommun(kommun.name);
				setForsamling("");
				setTabellNr(kommun.tabellNr);
				setCookie(KOMMUN_COOKIE, kommun.name);
				setCookie(FORSAMLING_COOKIE, "");
				setCookie(TABELL_COOKIE, String(kommun.tabellNr));
				if (gross !== "") {
					setNet(netFromGrossInMode(taxMode, kommun.tabellNr, gross));
				}
			},
			onForsamlingChange: (kommunName: string, name: string) => {
				const forsamling = findForsamling(kommunName, name);
				if (!forsamling) return;
				setKommun(forsamling.kommun);
				setForsamling(forsamling.name);
				setTabellNr(forsamling.tabellNr);
				setCookie(KOMMUN_COOKIE, forsamling.kommun);
				setCookie(FORSAMLING_COOKIE, forsamling.name);
				setCookie(TABELL_COOKIE, String(forsamling.tabellNr));
				if (gross !== "") {
					setNet(netFromGrossInMode(taxMode, forsamling.tabellNr, gross));
				}
			},
			onTabellNrChange: (value: number) => {
				if (!(value in skattetabeller)) return;
				setTabellNr(value);
				setKommun("");
				setForsamling("");
				setCookie(KOMMUN_COOKIE, "");
				setCookie(FORSAMLING_COOKIE, "");
				setCookie(TABELL_COOKIE, String(value));
				window.history.pushState({}, "", `/tabell/${value}`);
				if (gross !== "") {
					setNet(netFromGrossInMode(taxMode, value, gross));
				}
			},
			onMemberChange: (isMember: boolean) => {
				setMember(isMember);
				setCookie(KYRKA_COOKIE, isMember ? "1" : "0");
				setForsamling("");
				setCookie(FORSAMLING_COOKIE, "");
				const selected = findKommun(kommun);
				if (!selected) return;
				const nextTabellNr =
					isMember && selected.tabellNrMedlem !== null
						? selected.tabellNrMedlem
						: selected.tabellNr;
				setTabellNr(nextTabellNr);
				setCookie(TABELL_COOKIE, String(nextTabellNr));
				if (gross !== "") {
					setNet(netFromGrossInMode(taxMode, nextTabellNr, gross));
				}
			},
		}),
		[taxMode, tabellNr, gross, kommun]
	);

	return [
		{
			billAmount,
			gross,
			net,
			taxMode,
			kommun,
			forsamling,
			member,
			tabellNr,
			employmentFee:
				billAmount === "" ? "" : Math.round((billAmount / 1.3142) * 0.3142),
		},
		handlers,
	] as const;
};

export type TaxState = ReturnType<typeof useTaxCalculations>[0];
export type TaxHandlers = ReturnType<typeof useTaxCalculations>[1];
