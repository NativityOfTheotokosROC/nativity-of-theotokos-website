import { routing } from "@/src/i18n/routing";
import { ImagePlaceholder } from "@grod56/placeholder";
import { getTranslations } from "next-intl/server";

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
	title: string;
	venue: string;
	date: Date;
	times: {
		time: Date;
		designation: string;
	}[];
};

export type ScheduleItemWithTranslations = {
	[K in keyof ScheduleItem]: K extends "title" | "venue"
		? Translation
		: K extends "times"
			? {
					[A in keyof ScheduleItem[K][number]]: A extends "designation"
						? Translation
						: ScheduleItem[K][number][A];
				}[]
			: ScheduleItem[K];
};

export type RecurringScheduleItem = Omit<ScheduleItem, "date"> & {
	recurringPattern: string;
	isDisabled: boolean;
};

export type InstantaneousScheduleItem = ScheduleItem & {
	id: number;
	isRemoved: boolean;
};

export type TypeDiff<
	T extends Record<string, unknown>,
	U extends Record<string, unknown>,
> = { [K in Exclude<keyof T, keyof U>]: K extends keyof U ? never : T[K] };

export type InstantaneousScheduleItemWithTranslations = TypeDiff<
	InstantaneousScheduleItem,
	ScheduleItem
> &
	ScheduleItemWithTranslations;

export type RecurringScheduleItemWithTranslations = TypeDiff<
	RecurringScheduleItem,
	ScheduleItem
> &
	ScheduleItemWithTranslations;

export type RecurringScheduleItemInstance = ScheduleItem & {
	recurringItemId: number;
};

export type Image = {
	source: string;
	placeholder: ImagePlaceholder;
	about?: string;
};

export type ArticleTicket = {
	ticketId: string;
	assignee: ArticleAuthor;
};

export type ArticleAuthor = {
	name: string;
	email?: string;
};

export type RenameProperty<
	T extends Record<string, unknown>,
	O extends keyof T,
	N extends string,
> = Omit<T, O> & { [K in N]: T[O] };

export type RenameProperties<
	T extends Record<string, unknown>,
	N extends [keyof T, string][],
> = Omit<T, N[number][0]> & { [K in N[number][1]]: T[N[number][0]] };

export type ReplacePropertyType<
	T extends Record<string, unknown>,
	K extends keyof T,
	N,
> = Omit<T, K> & { [P in K]: N };
let x: ReplacePropertyType<Article, "uri", URL>;

export type ReplacePropertyTypes<
	T extends Record<string, unknown>,
	N extends [keyof T, unknown][],
> = Omit<T, N[number][0]> & {
	[P in N[number][0]]: N[number][1];
};

export type Article = {
	uri: string;
	title: string;
	author: ArticleAuthor;
	body: string;
	dateCreated: Date;
	dateUpdated?: Date;
	snippet: string;
	articleImage: RenameProperties<
		Required<Pick<Image, "source" | "about">> &
			Partial<Pick<Image, "placeholder"> & {}>,
		[["source", "url"], ["about", "caption"]]
	>;
	isArticleFeatured: boolean;
};

export type NewArticle = {
	title: string;
	body: string;
	snippet?: string;
	articleImage: Required<Pick<Image, "source" | "about">>;
	isArticleFeatured: boolean;
	authorName?: string;
};

export type GalleryImage = {
	image: Image;
};

export type Notification<T> = {
	type: T;
};

export type MessageNotification<T> = Notification<T> & { message: string };

export type Language = typeof routing.defaultLocale;

export type Resource = {
	label: string;
	link: string;
	graphic: string;
};

export type User = {
	name: string;
	email: string;
};

export type Translator = Awaited<ReturnType<typeof getTranslations<never>>>;

export type Role = "admin" | "staff" | "user" | "quotes" | "writer" | "editor";

export type Path = `/${string}`;

export type ShareData = {
	title: string;
	url: string;
	text?: string;
};

export type Translation = {
	english: string;
	russian?: string | null;
};
export type CompleteTranslation = {
	[P in keyof Translation]-?: NonNullable<Translation[P]>;
};

export type Options<T extends Record<string, unknown>> =
	| {
			options?: Partial<T>;
	  }
	| undefined;
export type ArticleAuthorWithTranslations = ReplacePropertyType<
	ArticleAuthor,
	"name",
	Translation
>;
export type ArticleWithTranslations = {
	[K in keyof Article]: K extends "title" | "body" | "snippet"
		? Translation
		: K extends "author"
			? ArticleAuthorWithTranslations
			: K extends "articleImage"
				? {
						[A in keyof Article[K]]: A extends "caption"
							? Translation
							: Article[K][A];
					}
				: Article[K];
};
