import { Calculator } from "./components/Calculator";

function App() {
	return (
		<>
			<main>
				<section>
					<aside>
						<p>
							<strong>Staten ska ha sitt.</strong> Räkna ut vad som blir över till dig.
						</p>
						<p>&nbsp;</p>
						<Calculator />
					</aside>
				</section>
			</main>
		</>
	);
}

export default App;
