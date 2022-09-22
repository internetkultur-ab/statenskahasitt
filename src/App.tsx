import { Calculator } from "./components/Calculator";

function App() {
	return (
		<>
			<header>
				<h1>Staten ska ha sitt</h1>
			</header>
			<main>
				<section>
					<aside>
						<p>
							Här kan du räkna ut hur mycket som blir över till dig efter att
							staten har tagit sin del.
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
