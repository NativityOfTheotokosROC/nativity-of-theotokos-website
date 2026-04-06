export function julianDate(date: Date) {
	return new Date(new Date().setDate(date.getDate() - 13));
}

export function removeMarkup(markedUpText: string): string {
	const regex: RegExp = /(<([^>]+)>)/gi;
	return markedUpText.replace(regex, "");
}

export function formatPhoneNumber(phoneNumber: `+${number}`) {
	let formattedNumber = phoneNumber[0];
	for (let i = 1; i <= phoneNumber.length; i += 3) {
		formattedNumber += `${phoneNumber.slice(i, i + 3)} `;
	}
	return formattedNumber.trim();
}

// TODO: More precise definition
export function isRemotePath(src: string) {
	try {
		new URL(src);
		return true;
	} catch {
		return false;
	}
}

export const emptyStringAsUndefined = (value: string) => {
	return value == "" ? undefined : value;
};
