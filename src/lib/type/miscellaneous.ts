import { ImagePlaceholder } from "@grod56/placeholder";

export type Navlink = {
	text: string;
	link: string;
	isInteractive?: boolean;
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
	iconOfTheDay: Pick<Image, "source"> & Partial<Image>;
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

export type Image = {
	source: string;
	placeholder: ImagePlaceholder;
	about?: string;
};

export type NewsArticle = {
	title: string;
	author: string;
	body: string;
	dateCreated: Date;
	dateUpdated?: Date;
	snippet: string;
	articleImage: Image;
};

export type GalleryImage = {
	image: Image;
};

export interface Notification<T> {
	type: T;
}
