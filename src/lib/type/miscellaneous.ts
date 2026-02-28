import { routing } from "@/src/i18n/routing";
import { ImagePlaceholder } from "@grod56/placeholder";

export type Navlink = {
	text: string;
	link: string;
	isReplaceable?: boolean;
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
	iconOfTheDay: Pick<Image, "source" | "about"> & Partial<Image>;
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
	uri: string;
	title: string;
	author: string;
	body: string;
	dateCreated: Date;
	dateUpdated?: Date;
	snippet: string;
	articleImage: Required<Pick<Image, "source" | "about">> &
		Partial<Pick<Image, "placeholder">>;
};

export type GalleryImage = {
	image: Image;
};

export interface Notification<T> {
	type: T;
}

export type Language = typeof routing.defaultLocale;

export type Resource = {
	label: string;
	link: string;
	graphic: string;
};
