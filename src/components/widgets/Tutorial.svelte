<script lang="ts">
	import { COLS, ROWS } from "../../utils";

	import { Tile } from "../board";
	export let visible: boolean;
</script>

<h3>how to play</h3>
<div>It's the word game you know and love, but with a twist - you're guessing a word based on its pronunciation, represented by the International Phonetic Alphabet (IPA).</div>
<div>Each guess must be a valid word that contains {COLS} IPA letters. <strong>Beware:</strong> the English word itself may have a different number of letters! Hit the enter button to submit.</div>
<div>
	After each guess, the color of the tiles will change to show how close your guess was to the
	word.
</div>
<div class:complete={visible} class="examples">
	<div><strong>Examples</strong></div>
	<div class="row">
		<Tile value="s" state="🟩" />
		<Tile value="k" state="🟩" />
		<Tile value="r" state="🟩" />
		<Tile value="iː" state="🔳" />
		<Tile value="m" state="🟩" />
		(scream)
	</div>
	<div class="row">
		<Tile value="s" state="🟩" />
		<Tile value="k" state="🟩" />
		<Tile value="r" state="🟩" />
		<Tile value="i" state="🟩" />
		<Tile value="m" state="🟩" />
		(scrim)
	</div>
	<div>Long vowels (<strong>iː, ɑː, ɔː, …</strong>) are treated as a single letter, and are considered to be different from their short counterparts (<strong>i, ɑ, ɔ, …</strong>).</div>
	<div class="row">
		<Tile value="t" state="🟩" />
		<Tile value="ʃ" state="🔳" />
		<Tile value="ɑː" state="🔳" />
		<Tile value="d" state="🟨" />
		<Tile value="ʒ" state="🔳" />
		(charge)
	</div>
	<div class="row">
		<Tile value="t" state="🟩" />
		<Tile value="æ" state="🟩" />
		<Tile value="t" state="🟩" />
		<Tile value="ə" state="🟩" />
		<Tile value="d" state="🟩" />
		(tattered)
	</div>
	<div>Affricates (<strong>tʃ, dʒ</strong>) are treated as two separate letters.</div>
</div>
<div>
	Original concept from Josh Wardle's <a
		href="https://www.powerlanguage.co.uk/wordle/"
		target="_blank">Wordle</a
	>. Code based on
	<a href="https://github.com/MikhaD" target="_blank">MikhaD's</a>
	<a href="https://mikhad.github.io/wordle" target="_blank">Wordle+</a>.
	<br />
</div>

<style lang="scss">
	div {
		margin: 14px 0;
	}
	.examples {
		border-top: 1px solid var(--border-primary);
		border-bottom: 1px solid var(--border-primary);
		:global(.row > *) {
			height: 100%;
			aspect-ratio: 1;
		}
		&:not(.complete) :global(.row .back) {
			transition-delay: 0.3s;
		}
	}
	.row {
		height: 40px;
		display: flex;
		gap: 4px;
	}
</style>
