export type Navlink = {
	text: string;
	link: string;
};

export type DailyReadings = {
	currentDate: string;
	liturgicalWeek: string;
	saints: string;
	scriptures: {
		scriptureText: string;
		designation: string;
		link: string;
	}[];
	fastingInfo: string;
	iconOfTheDay: string;
	hymnsLink: string;
};
