import { TabellChooser } from "./components/TabellChooser";
import { Calculator } from "./components/Calculator";
import { useTaxCalculations } from "./hooks/useTaxCalculations";

function App() {
	const valueFromPath = window.location.pathname.split("/").filter(Boolean)[0];
	const [state, handlers] = useTaxCalculations(
		Number.isNaN(+valueFromPath) ? undefined : +valueFromPath
	);

	return (
		<main>
			<section>
				<aside>
					<p>
						<strong>Staten ska ha sitt.</strong> Räkna ut vad som blir över
						till dig.
					</p>
					<p>&nbsp;</p>
					<Calculator state={state} handlers={handlers} />
				</aside>
			</section>
			<hr />
			<article>
				<details id="vilken-tabell">
					<summary>Vilken tabell har jag?</summary>
					<TabellChooser state={state} handlers={handlers} />
				</details>
			</article>
		</main>
	);
}

export default App;
