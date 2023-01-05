import seedrandom from "seedrandom";
import { GameMode } from "./enums";
import wordList from "./words_5";
import { ipadict, ipaanswers } from "./ipa";
import { getCubes, getCubesStr } from "./ipautils";

export const ROWS = 8;
export const COLS = 5;

export const ipaDict = {
	...ipadict,
	contains: (ipa_str: string) => {
		return Object.values(ipadict).includes(ipa_str);
	},
	getEngFromIpa: (ipa_str: string) => {
		return Object.keys(ipadict).find(key => ipadict[key] === ipa_str);
	},
};
export const engWords = {
	...wordList,
	contains: (word: string) => {
		return wordList.words.includes(word) || wordList.valid.includes(word);
	},
};
export const words = {
	...ipaanswers,
	words: ipaanswers,
	contains: (word: string) => {
		return ipaanswers.includes(word);
	},
};

export function checkHardMode(board: GameBoard, row: number): HardModeData {
	const prevWordArr = getCubes(board.words[row - 1], false);
	const wordArr = getCubes(board.words[row], false);
	for (let i = 0; i < COLS; ++i) {
		if (board.state[row - 1][i] === "🟩" && prevWordArr[i] !== wordArr[i]) {
			return { pos: i, char: prevWordArr[i], type: "🟩" };
		}
	}
	for (let i = 0; i < COLS; ++i) {
		if (board.state[row - 1][i] === "🟨" && !wordArr.includes(prevWordArr[i])) {
			return { pos: i, char: prevWordArr[i], type: "🟨" };
		}
	}
	return { pos: -1, char: "", type: "⬛" };
}

export function getRowData(n: number, board: GameBoard) {
	const wordData = {
		// letters not contained
		not: [],
		// for letters contained in the word that are not the same as any that are in the correct place
		contained: new Set<string>(),
		letters: Array.from({ length: COLS }, () => ({ val: null, not: new Set<string>() })),
	};
	for (let row = 0; row < n; ++row) {
		const wordArr = getCubes(board.words[row], false);
		for (let col = 0; col < COLS; ++col) {
			if (board.state[row][col] === "🟨") {
				wordData.contained.add(wordArr[col]);
				wordData.letters[col].not.add(wordArr[col]);
			} else if (board.state[row][col] === "🟩") {
				wordData.contained.delete(wordArr[col]);
				wordData.letters[col].val = wordArr[col];
			} else {
				wordData.not.push(wordArr[col]);
			}
		}
	}
	let exp = "";
	for (let i = 0; i < COLS; ++i) {
		exp += wordData.letters[i].val
			? wordData.letters[i].val
			: `[^${[...wordData.not, ...wordData.letters[i].not].join(" ")}]`;
	}
	return (word: string) => {
		if (new RegExp(exp).test(word)) {
			for (const char of wordData.contained) {
				if (!word.includes(char)) return false;
			}
			return true;
		}
		return false;
	};
}

export function getState(word: string, guess: string): LetterState[] {
	//const charArr = word.split("");
	const charArr = getCubes(word, false);
	const ansArr = getCubes(guess, false);
	const result = Array<LetterState>(5).fill("⬛");
	for (let i = 0; i < charArr.length; ++i) {
		if (charArr[i] === ansArr[i]) {
			result[i] = "🟩";
			charArr[i] = "$";
		}
	}
	return result.map((e, i) => charArr.includes(ansArr[i]) && e !== "🟩" ? "🟨" : e);
}

export function contractNum(n: number) {
	switch (n % 10) {
		case 1: return `${n}st`;
		case 2: return `${n}nd`;
		case 3: return `${n}rd`;
		default: return `${n}th`;
	}
}

export const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
export const keysIpa = ["ɑaæɐəeɛiɪɒɔʊuʌ", "bdfɡhjʒklmnŋ", "prsʃtθðvwz"];

export function newSeed(mode: GameMode) {
	const today = new Date();
	switch (mode) {
		case GameMode.daily:
			return new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf();
		case GameMode.hourly:
			return new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()).valueOf();
		case GameMode.infinite:
			return new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()).valueOf();
	}
}

export const modeData: ModeData = {
	default: GameMode.daily,
	modes: [
		{
			name: "Daily",
			unit: 86400000,
			start: 1644681600000,	// 13/02/2022
			seed: newSeed(GameMode.daily),
			historical: false,
			streak: true,
		},
		{
			name: "Hourly",
			unit: 3600000,
			start: 1644681600000,	// 13/02/2022 0:00
			seed: newSeed(GameMode.hourly),
			historical: false,
			icon: "m50,7h100v33c0,40 -35,40 -35,60c0,20 35,20 35,60v33h-100v-33c0,-40 35,-40 35,-60c0,-20 -35,-20 -35,-60z",
			streak: true,
		},
		{
			name: "Infinite",
			unit: 1000,
			start: 1644681600000,	// 13/02/2022 0:00
			seed: newSeed(GameMode.infinite),
			historical: false,
			icon: "m7,100c0,-50 68,-50 93,0c25,50 93,50 93,0c0,-50 -68,-50 -93,0c-25,50 -93,50 -93,0z",
		}
	]
};

export function getWordNumber(mode: GameMode) {
	return Math.round((modeData.modes[mode].seed - modeData.modes[mode].start) / modeData.modes[mode].unit) + 1;
}

export function seededRandomInt(min: number, max: number, seed: number) {
	const rng = seedrandom(`${seed}`);
	return Math.floor(min + (max - min) * rng());
}

export const DELAY_INCREMENT = 150;

export const PRAISE = [
	"Genius!",
	"Magnificent!",
	"Impressive!",
	"Splendid!",
	"Great!",
	"Success!",
	"Got it!",
	"Phew!",
];

export function createNewGame(mode: GameMode): GameState {
	return {
		active: true,
		guesses: 0,
		time: modeData.modes[mode].seed,
		wordNumber: getWordNumber(mode),
		validHard: true,
		board: {
			words: Array(ROWS).fill(""),
			state: Array.from({ length: ROWS }, () => (Array(COLS).fill("🔳")))
		},
	};
}

export function createDefaultSettings(): Settings {
	return {
		hard: new Array(modeData.modes.length).map(() => false),
		dark: true,
		colorblind: false,
		tutorial: 2,
	};
}

export function createDefaultStats(mode: GameMode): Stats {
	const stats = {
		played: 0,
		lastGame: 0,
		guesses: {
			fail: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
		}
	};
	if (!modeData.modes[mode].streak) return stats;
	return {
		...stats,
		streak: 0,
		maxStreak: 0,
	};
};

export function createLetterStates(): { [key: string]: LetterState; } {
	return {
		a: "🔳",
		b: "🔳",
		c: "🔳",
		d: "🔳",
		e: "🔳",
		f: "🔳",
		ɡ: "🔳",
		h: "🔳",
		i: "🔳",
		iː: "🔳",
		j: "🔳",
		k: "🔳",
		l: "🔳",
		m: "🔳",
		n: "🔳",
		o: "🔳",
		p: "🔳",
		q: "🔳",
		r: "🔳",
		s: "🔳",
		t: "🔳",
		u: "🔳",
		uː: "🔳",
		v: "🔳",
		w: "🔳",
		x: "🔳",
		y: "🔳",
		z: "🔳",
		ə: "🔳",
		ɔ: "🔳",
		ɔː: "🔳",
		ʌ: "🔳",
		ʊ: "🔳",
		ɐ: "🔳",
		ɒ: "🔳",
		ɑ: "🔳",
		ɑː: "🔳",
		æ: "🔳",
		ɜː: "🔳",
		ɛ: "🔳",
		ɪ: "🔳",
		ɪː: "🔳",
		ŋ: "🔳",
		ð: "🔳",
		θ: "🔳",
		ʒ: "🔳",
		ʃ: "🔳",
		ɹ: "🔳",
	};
}

export const definitions = new Map<string, Promise<DictionaryEntry>>();
