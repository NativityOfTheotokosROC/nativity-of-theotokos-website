import { DailyReadings } from "../type/miscellaneous";
import { julianDate, removeMarkup } from "../utility/miscellaneous";
import { load } from "cheerio";

interface HolyTrinityOrthodox {
	getDailyReadings: (date: Date) => Promise<DailyReadings>;
	getLiturgicalWeek: (date: Date) => Promise<string>;
	getSaints: (date: Date) => Promise<string>;
	getScriptures: (date: Date) => Promise<
		{
			scriptureText: string;
			designation: string;
			link: string;
		}[]
	>;
	getFastingInfo: (date: Date) => Promise<string>;
	getIconOfTheDay: (date: Date) => Promise<string>;
	getHymnsLink: (date: Date) => string;
}

class HolyTrinityOrthodoxImplementation implements HolyTrinityOrthodox {
	private readonly baseURL =
		"https://www.holytrinityorthodox.com/htc/ocalendar/v2calendar.php";
	private readonly iconOfTheDayBaseURL =
		"https://holytrinityorthodox.com/htc/iconoftheday/bigimages";

	async getDailyReadings(date: Date) {
		return {
			currentDate: date.toLocaleDateString("en-uk", {
				dateStyle: "full",
			}),
			liturgicalWeek: await this.getLiturgicalWeek(date),
			saints: await this.getSaints(date),
			scriptures: await this.getScriptures(date),
			fastingInfo: await this.getFastingInfo(date),
			iconOfTheDay: await this.getIconOfTheDay(date),
			hymnsLink: this.getHymnsLink(date),
		};
	}
	async getLiturgicalWeek(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("header", "1");

		return fetch(requestURL)
			.then(response => {
				if (response.ok) return response.text();
				return Promise.reject(
					`${response.status}: ${response.statusText}`
				);
			})
			.then(html => {
				const $ = load(html);
				$(".headerfast").remove();
				$(".headernofast").remove();
				return $.html();
			})
			.then(markedUpText => removeMarkup(markedUpText));
	}
	async getSaints(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("lives", "2");

		return fetch(requestURL)
			.then(response => {
				if (response.ok) return response.text();
				return Promise.reject(
					`${response.status}: ${response.statusText}`
				);
			})
			.then(html => {
				const $ = load(html);
				$(".cal-main").removeAttr("onclick");
				$(".cal-main").each(function () {
					$(this).attr("target", "_blank");
				});
				return $(".normaltext").html()!;
			});
	}
	async getScriptures(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("scripture", "2");

		return fetch(requestURL)
			.then(response => {
				if (response.ok) return response.arrayBuffer();
				return Promise.reject(
					`${response.status}: ${response.statusText}`
				);
			})
			.then(encodedResponse =>
				new TextDecoder("windows-1251").decode(encodedResponse)
			)
			.then(html => {
				const $ = load(html);
				$(".normaltext")
					.contents()
					.filter(function () {
						return this.nodeType === 3 && this.nodeValue == "\n";
					})
					.each(function () {
						$(this).remove();
					});
				$(".cal-main").removeAttr("onclick");
				$(".cal-main").each(function () {
					$(this).removeClass();
					$(this).addClass("scripture-text");
				});
				$(".normaltext")
					.contents()
					.filter(function () {
						return this.nodeType === 3;
					})
					.each(function () {
						$(this).wrap('<span class="designation"></span>');
					});
				const childrenHtml = $(".normaltext")
					.children()
					.map(function () {
						return $.html(this);
					})
					.toArray()
					.join("");
				const verses = childrenHtml.split("<br>");
				const markedUpScriptures: string[] = [];
				verses.forEach(verse => {
					// HACK
					if (!verse.trim()) return;

					const _$ = load(verse, null, false);
					_$("*").wrapAll('<span class="scripture"></span>');
					markedUpScriptures.push(_$(".scripture").html()!);
				});
				const scriptures = markedUpScriptures.map(scripture => {
					const _$ = load(scripture, null, false);
					return {
						scriptureText: _$(".scripture-text").text().trim(),
						designation: _$(".designation").text().trim(),
						link: _$(".scripture-text").attr("href")!.trim(),
					};
				});
				return scriptures;
			});
	}
	async getFastingInfo(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("header", "1");

		return fetch(requestURL)
			.then(response => {
				if (response.ok) return response.text();
				return Promise.reject(
					`${response.status}: ${response.statusText}`
				);
			})
			.then(html => {
				const $ = load(html);
				const fastText = $(".headerfast").text();
				console.log(fastText ?? $(".headernofast").text());
				return (fastText ? fastText : $(".headernofast").text()).trim();
			})
			.then(markedUpText => removeMarkup(markedUpText))
			.then(info => (info.length == 0 ? "No Fast" : info));
	}

	async getIconOfTheDay(date: Date) {
		const liturgicalCalendarDate = julianDate(date);
		const month = (liturgicalCalendarDate.getMonth() + 1)
			.toString()
			.padStart(2, "0");
		const day = liturgicalCalendarDate
			.getDate()
			.toString()
			.padStart(2, "0");
		let link = "/theotokos.webp";
		const saintOfTheDayLink = `${this.iconOfTheDayBaseURL}/${month}/${month}${day}.jpg`;
		const response = await fetch(saintOfTheDayLink, { method: "HEAD" });
		if (response.ok) {
			link = saintOfTheDayLink;
		}
		return link;
	}

	getHymnsLink(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("dt", "1");
		requestURL.searchParams.set("trp", "1");

		return requestURL.href;
	}

	private _getDatedBaseURL(date: Date) {
		const requestURL = new URL(this.baseURL);

		requestURL.searchParams.set("today", date.getDate().toString());
		requestURL.searchParams.set("month", (date.getMonth() + 1).toString());
		requestURL.searchParams.set("year", date.getFullYear().toString());
		return requestURL;
	}
}

const holytrinityorthodox: HolyTrinityOrthodox =
	new HolyTrinityOrthodoxImplementation();

export default holytrinityorthodox;
