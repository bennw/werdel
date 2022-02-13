<script lang="ts">
	import { definitions as cache, ipaDict } from "../../utils";
	export let word: string;
	/** The maximum number of alternate definitions to provide*/
	export let alternates = 9;
	let wordEng = ipaDict.getEngFromIpa(word);

	async function getWordData(word: string): Promise<DictionaryEntry> {
		wordEng = ipaDict.getEngFromIpa(word);
		/*if (!cache.has(word)) {
			const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
				mode: "cors",
			});
			if (data.ok) {
				cache.set(word, (await data.json())[0]);
			} else {
				throw new Error(`Failed to fetch definition`);
			}
		}
		return cache.get(word);*/
		return "";
	}
</script>

<div class="def">
	{#await getWordData(word)}
		<h4>Fetching definition...</h4>
	{:then data}
		<div>Your word was <strong>{word} ({wordEng})</strong>.</div>
	{:catch}
		<div>Your word was <strong>{word} ({wordEng})</strong>.</div>
	{/await}
</div>

<style>
	h2 {
		display: inline-block;
		margin-right: 1rem;
		margin-bottom: 0.8rem;
	}
	ol {
		padding-left: 1.5rem;
	}
	li {
		margin-bottom: 0.5rem;
	}
	li::first-letter {
		text-transform: uppercase;
	}
	li::marker {
		color: var(--fg-secondary);
	}
</style>
