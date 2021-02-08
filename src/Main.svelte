<script lang="ts">
	import { Accordion, AccordionItem } from "carbon-components-svelte";

	export let name: string;

	const count: number = 1;
</script>

<main>
	<h1>Hello {name}! {count}</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

	<Accordion>
		<AccordionItem title="Natural Language Classifier">
			<p>
				Natural Language Classifier uses advanced natural language processing and
				machine learning techniques to create custom classification models. Users
				train their data and the service predicts the appropriate category for the
				inputted text.
			</p>
		</AccordionItem>
		<AccordionItem title="Natural Language Understanding">
			<p>
				Analyze text to extract meta-data from content such as concepts, entities,
				emotion, relations, sentiment and more.
			</p>
		</AccordionItem>
		<AccordionItem title="Language Translator">
			<p>
				Translate text, documents, and websites from one language to another.
				Create industry or region-specific translations via the service's
				customization capability.
			</p>
		</AccordionItem>
	</Accordion>
</main>

<style type="text/scss">
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

		h1 {
			color: #ff3e00;
			text-transform: uppercase;
			font-size: 4em;
			font-weight: 100;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>