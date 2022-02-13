<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte/internal";
	import { letterStates, mode } from "../../stores";
	import { COLS, keys, ipaDict } from "../../utils";
	import { getCubes } from "../../ipautils";
	import Key from "./Key.svelte";

	export let value = "";
	export let disabled = false;
	let preventChange = true;
	
	export let txtEng = "";
	export let txtIpa = "";
	let txtIpaValid = false;

	const dispatch = createEventDispatcher();

	function appendValue(char: string) {
		if (!disabled && value.length < COLS) {
			dispatch("keystroke", char);
			value += char;
		}
	}
	function backspaceValue() {
		if (!disabled) {
			value = value.slice(0, value.length - 1);
		}
	}
	function updateFromEng(char: string) {
		//if (txtEng.length == 5) {
		txtIpaValid = false;
		txtEng = txtEng.toLowerCase()
		if (ipaDict.hasOwnProperty(txtEng))
		{
			txtIpa = ipaDict[txtEng];
			value = txtIpa;
			if (getCubes(txtIpa, false).length == COLS) {
				txtIpaValid = true;
			}
		}
		else {
			txtIpa = "";
			value = "";
		}
	}
	function updateFromIpa(char: string) {
		value = txtIpa;
		let strEng = ipaDict.getEngFromIpa(txtIpa);
		if (strEng) {
			txtEng = strEng;
		}
		else {
			txtEng = "";
		}
		if (getCubes(txtIpa, false).length == COLS) {
			txtIpaValid = true;
		} else {
			txtIpaValid = false;
		}
	}
	function handleKeystroke(e: KeyboardEvent) {
		// checkIPAValue(e.key.toLowerCase());
		if (!disabled && !e.ctrlKey && !e.altKey) {
			if (e.key && /^[a-z]$/.test(e.key.toLowerCase())) {
				//return appendValue(e.key.toLowerCase());
			}
			//if (e.key === "Backspace") return backspaceValue();

			if (e.key === "Enter") return dispatch("submitWord");
		}
		if (e.key === "Escape") dispatch("esc");
	}

	// Ensure keys change on load instead of loading their state color & change the color of all the keys to neutral, then to their correct color on mode change
	const unsub = mode.subscribe(() => {
		preventChange = true;
		setTimeout(() => (preventChange = false), 200);
	});
	onDestroy(unsub);
</script>

<svelte:body on:keydown={handleKeystroke} />

<div class:preventChange class="keyboard">
	<div class="divinput">
		<input 
			class="inputnormal"
			bind:value={txtEng}
			on:input={updateFromEng}
			placeholder="English"
			autofocus
		/>
	</div><div class="divinput">
		<input 
			class='{txtIpaValid ? "inputvalid": "inputnormal"}'
			bind:value={txtIpa}
			on:input={updateFromIpa}
			placeholder="IPA"
		/>
	</div>
</div>

<style>
	.keyboard {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2px;
	}
	.row {
		width: 100%;
		display: flex;
		margin: 0 auto 8px;
		padding: 0 8px;
		gap: 6px;
	}
	.row:nth-of-type(2) {
		padding: 0 30px;
	}
	.divinput {
		width: 60%;
		align-items: center;
		padding: 2px;
	}
	.divtxt {
		width: 20%;
		align-items: left;
	}
	.inputnormal {
		font-size: 1.6rem;
		width: 100%;
		background-color: var(--bg-secondary);
		color: var(--fg-primary);
	}
	.inputvalid:focus {
		outline: none !important;
		border: 2px solid var(--color-correct);
		border-radius: 4px;
        box-shadow: 0 0 4px #719ECE;
	}
	.inputvalid {
		font-size: 1.6rem;
		width: 100%;
		background-color: var(--bg-secondary);
		color: var(--fg-primary);
		border: 2px solid var(--color-correct);
		border-radius: 4px;
	}
	svg {
		fill: var(--fg-primary);
		width: 24px;
	}
</style>
