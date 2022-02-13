<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { longVowelsList, getLongChar } from "../../ipautils"

	export let letter: string;
	export let stateLong: LetterState = "🔳";
	export let stateShort: LetterState = "🔳";
	export let isLong = false;
	export let isIPA = false;
	let letterModded = letter;
	
	$: letterModded = switchMode(isLong, isIPA, letter);

	const dispatch = createEventDispatcher();
	
	function switchMode(is_long: Boolean, is_ipa: Boolean, l: string)
	{
		let res = l;
		if (is_long && is_ipa) {
			res = getLongChar(l);
		}
		return res;
	}
</script>

<div 
	class="{isIPA ? (isLong ? stateLong : stateShort) : ''} {isIPA ? 'lower' : 'upper'}"
	class:big={letter.length !== 1} 
	on:click={() => dispatch("keystroke", letterModded)}
	>
	{letterModded}<slot />
</div>

<style>
	div {
		font-size: calc(var(--fs-tiny) + 1px);
		font-weight: bold;
		border-radius: 4px;
		height: 42px;
		background: var(--key-bg);
		cursor: pointer;
		display: grid;
		place-items: center;
		flex: 1;
		transition: background-color 0.3s ease-in-out;
	}
	:global(.guesses) div {
		transition-delay: 0.1s;
	}
	:global(.guesses .preventChange) div {
		transition-duration: 0.15s;
		transition-delay: 0s;
		background: var(--key-bg) !important;
	}
	.lower {
		text-transform: lowercase;
	}
	.upper {
		text-transform: uppercase;
	}
	.big {
		font-size: var(--fs-tiny);
		flex-grow: 1.5;
	}
	.⬛ {
		background: var(--color-absent);
	}
	.🟨 {
		background: var(--color-present);
	}
	.🟩 {
		background: var(--color-correct);
	}
</style>
