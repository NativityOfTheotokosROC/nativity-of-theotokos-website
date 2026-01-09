export type Navlink = {
	text: string;
	link: string;
};

export type DailyReadingsScripture = {
	scriptureText: string;
	designation: string;
	link: string;
};

export type DailyReadings = {
	currentDate: string;
	liturgicalWeek: string;
	saints: string;
	scriptures: DailyReadingsScripture[];
	fastingInfo: string;
	iconOfTheDay: string;
	hymnsLink: string;
};

export type DailyQuote = {
	quote: string;
	author: string;
	source: string | null;
};
