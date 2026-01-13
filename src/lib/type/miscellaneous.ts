export type Navlink = {
	text: string;
	link: string;
};

export type DailyReadingsScripture = {
	scriptureText: string;
	designation: string;
	link: string;
};

export type Hymn = {
	title: string;
	text: string;
};

export type DailyReadings = {
	currentDate: Date;
	liturgicalWeek: string;
	saints: string;
	scriptures: DailyReadingsScripture[];
	fastingInfo: string;
	iconOfTheDay: string;
	hymns: Hymn[];
};

export type DailyQuote = {
	quote: string;
	author: string;
	source: string | null;
};

export type ScheduleItem = {
	date: Date;
	title: string;
	location: string;
	times: {
		time: Date;
		designation: string;
	}[];
};
