export function getCubes(val: string, isPadResult: Boolean) {
	let i=0, c=0;
	let long_vowels = ["u", "ɔ", "ɑ", "ɜ", "ɪ", "i"];
	let res = [];
	if (isPadResult) { res = ["", "", "", "", ""]; }
	while (i < val.length)
	{
		res[c] = val.charAt(i);
		if (res[c] == "ɹ") res[c] = "r";
		i++;
		if (i < val.length && val.charAt(i) == "ː" && long_vowels.includes(res[c]))
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