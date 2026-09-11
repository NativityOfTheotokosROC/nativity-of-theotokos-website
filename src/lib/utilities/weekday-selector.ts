const ALL_DAYS_ARRAY = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thur",
	"Fri",
	"Sat",
] as const;
export type Day = (typeof ALL_DAYS_ARRAY)[number];

function isCronPatternValid(pattern: string) {
	const patternArray = pattern.split(" ");
	return patternArray.length === 5 || patternArray.length === 6;
}

function isDaysPatternValid(pattern: string) {
	return /^\*?$|(\d(,\d)*$)/.test(pattern);
}

export function transformDaysToPattern(days: Set<Day>, cronPattern?: string) {
	const pattern = cronPattern ?? "0 0 * * *";
	if (!isCronPatternValid(pattern))
		throw new Error("Invalid cron pattern provided");
	const patternArray = pattern.split(" ");
	const cronDays = [...days].map(day => {
		switch (day) {
			case "Sun":
				return 0;
			case "Mon":
				return 1;
			case "Tue":
				return 2;
			case "Wed":
				return 3;
			case "Thur":
				return 4;
			case "Fri":
				return 5;
			case "Sat":
				return 6;
		}
	});
	patternArray[patternArray.length - 1] = cronDays.join(",");
	return patternArray.join(" ");
}

export function transformPatternToDays(cronPattern: string) {
	if (!isCronPatternValid(cronPattern))
		throw new Error("Invalid cron pattern provided");
	const patternArray = cronPattern.split(" ");
	const daysPattern = patternArray[patternArray.length - 1];
	if (!isDaysPatternValid(daysPattern))
		throw new Error("Days pattern is invalid");
	if (daysPattern === "*") return new Set(ALL_DAYS_ARRAY);
	return new Set<Day>(
		daysPattern.split(",").map(value => {
			switch (value) {
				case "0":
					return "Sun";
				case "1":
					return "Mon";
				case "2":
					return "Tue";
				case "3":
					return "Wed";
				case "4":
					return "Thur";
				case "5":
					return "Fri";
				case "6":
					return "Sat";
				default:
					throw new Error("Days pattern is invalid");
			}
		}),
	);
}
