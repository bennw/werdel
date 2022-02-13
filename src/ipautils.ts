export let longVowelsList = ["u", "ɔ", "ɑ", "ɜ", "ɪ", "i"];

export function getLongChar(char: string){
	// returns the long vowel counterpart, if it exists. Otherwise, returns the input char
	let res = char;
	if (longVowelsList.includes(char)) {
		res = char + "ː";
	} else if (char == "ə") {
		res = "ɜː";
	}
	return res;
}

export function getCubes(val: string, isPadResult: Boolean) {
	let i=0, c=0;
	let res = [];
	if (isPadResult) { res = ["", "", "", "", ""]; }
	while (i < val.length)
	{
		res[c] = val.charAt(i);
		if (res[c] == "ɹ") res[c] = "r";
		i++;
		if (i < val.length && val.charAt(i) == "ː" && longVowelsList.includes(res[c]))
		{
			res[c] += "ː";
			i++;
		}
		c++;
	}
	return res;
}

export function getCubesStr(val: string)
{
	let cubes = getCubes(val, false);
	return cubes.join('');
}

export function getIpaLength(str: string)
{
	
}