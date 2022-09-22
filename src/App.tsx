import { Calculator } from "./components/Calculator";

function App() {
	return (
		<main>
			<section>
				<p>
					Här kan du räkna ut hur mycket som blir över till dig efter att staten
					har tagit sin del.
				</p>
				<p>&nbsp;</p>
			</section>
			<section>
				<Calculator />
			</section>
		</main>
	);
}

export default App;
