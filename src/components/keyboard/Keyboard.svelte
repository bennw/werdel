<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte/internal";
	import { letterStates, mode } from "../../stores";
	import { COLS, keys, keysIpa, ipaDict } from "../../utils";
	import { getCubes, getLongChar } from "../../ipautils";
	import Key from "./Key.svelte";

	export let value = "";
	export let disabled = false;
	let preventChange = true;
	
	export let txtEng = "";
	export let txtIpa = "";
	export let txtIpaValid = false;
	let isKeyboardIpa = false;
	let isKeyboardLong = false;

	const dispatch = createEventDispatcher();

	function appendValueEng(char: string) {
		/*if (!disabled && value.length < COLS) {
			dispatch("keystroke", char);
			value += char;
		}*/
		txtEng += char;
		updateFromEng(char);
	}
	function appendValueIpa(char: string) {
		txtIpa += char;
		updateFromIpa(char);
	}
	function backspaceValueEng() {
		/*if (!disabled) {
			value = value.slice(0, value.length - 1);
		}*/
		txtEng = txtEng.slice(0, txtEng.length - 1);
		updateFromEng("");
	}
	function backspaceValueIpa() {
		txtIpa = txtIpa.slice(0, txtIpa.length - 1);
		updateFromIpa("");
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
		if (!disabled && !e.ctrlKey && !e.altKey) {
			if (e.key && /^[a-z]$/.test(e.key.toLowerCase())) {
				return appendValueEng(e.key.toLowerCase());
			}
			if (e.key === "Backspace") return backspaceValueEng();

			if (e.key === "Enter") return dispatch("submitWord");
		}
		if (e.key === "Escape") dispatch("esc");
	}
	function toggleKeyboardIpa() {
		isKeyboardIpa = !isKeyboardIpa;
	}
	function toggleKeyboardLong() {
		isKeyboardLong = !isKeyboardLong;
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
		{#if isKeyboardIpa == true}
			<button on:click="{() => {toggleKeyboardIpa();}}">IPA</button>
		{:else}
			<button on:click="{() => {toggleKeyboardIpa();}}">English</button>
		{/if}
		<input 
			class="inputnormal"
			bind:value={txtEng}
			on:input={updateFromEng}
			placeholder="English"
			disabled
		/>
		<input 
			class='{txtIpaValid ? "inputvalid": "inputnormal"}'
			bind:value={txtIpa}
			on:input={updateFromIpa}
			placeholder="IPA"
			disabled
		/>
	</div>
</div>

{#if isKeyboardIpa}
<div class:preventChange class="keyboardIpa">
	<div class="row">
		{#each keysIpa[0] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueIpa(e.detail)}
				stateShort={$letterStates[letter]}
				stateLong={$letterStates[getLongChar(letter)]}
				bind:isLong={isKeyboardLong}
				isIPA
			/>
		{/each}
	</div>
	<div class="row">
		<Key letter="ː" on:keystroke={toggleKeyboardLong} />
		{#each keysIpa[1] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueIpa(e.detail)}
				stateShort={$letterStates[letter]}
				stateLong={$letterStates[getLongChar(letter)]}
				bind:isLong={isKeyboardLong}
				isIPA
			/>
		{/each}
	</div>
	<div class="row">
		<Key letter="ENTER" on:keystroke={() => !disabled && dispatch("submitWord")} />
		{#each keysIpa[2] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueIpa(e.detail)}
				stateShort={$letterStates[letter]}
				stateLong={$letterStates[getLongChar(letter)]}
				bind:isLong={isKeyboardLong}
				isIPA
			/>
		{/each}
		<Key letter="" on:keystroke={backspaceValueIpa}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
				/>
			</svg>
		</Key>
	</div>
</div>
{:else}
<div class:preventChange class="keyboardEng">
	<div class="row">
		{#each keys[0] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueEng(e.detail)}
			/>
		{/each}
	</div>
	<div class="row">
		{#each keys[1] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueEng(e.detail)}
			/>
		{/each}
	</div>
	<div class="row">
		<Key letter="ENTER" on:keystroke={() => !disabled && dispatch("submitWord")} />
		{#each keys[2] as letter}
			<Key
				letter={letter}
				on:keystroke={(e) => appendValueEng(e.detail)}
			/>
		{/each}
		<Key letter="" on:keystroke={backspaceValueEng}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
				/>
			</svg>
		</Key>
	</div>
</div>
{/if}

<style>
	.keyboard {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2px;
	}
	.keyboardEng {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2px;
	}
	.keyboardIpa {
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
		width: 90%;
		align-items: center;
		padding: 2px;
		margin: 2px;
	}
	.inputnormal {
		font-size: 1.6rem;
		width: 40%;
		background-color: var(--bg-secondary);
		color: var(--fg-primary);
		float: left;
	}
	.inputvalid:focus {
		outline: none !important;
		border: 2px solid var(--color-correct);
		border-radius: 4px;
        box-shadow: 0 0 4px #719ECE;
		float: left;
	}
	.inputvalid {
		font-size: 1.6rem;
		width: 40%;
		background-color: var(--bg-secondary);
		color: var(--fg-primary);
		border: 2px solid var(--color-correct);
		border-radius: 4px;
		float: left;
	}
	button {
		font-size: 1rem;
		width: 20%;
		height: 100%;
		background-color: var(--bg-primary);
		color: var(--fg-secondary);
		border-color: var(--border-primary);
		float: left;
	}
	svg {
		fill: var(--fg-primary);
		width: 24px;
	}
</style>
