import { toZonedTime } from "date-fns-tz";
import { DailyReadings, Hymn, Image } from "../type/miscellaneous";
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
	getIconOfTheDay: (date: Date) => Promise<unknown>;
	getHymns: (date: Date) => Promise<Hymn[]>;
}

class HolyTrinityOrthodoxImplementation implements HolyTrinityOrthodox {
	private readonly baseURL =
		"https://www.holytrinityorthodox.com/htc/ocalendar/v2calendar.php";
	private readonly iconOfTheDayBaseURL =
		"https://holytrinityorthodox.com/htc/iconoftheday/bigimages";

	async getDailyReadings(date: Date) {
		const localDate = toZonedTime(date, "CAT");
		return {
			currentDate: date,
			liturgicalWeek: await this.getLiturgicalWeek(localDate),
			saints: await this.getSaints(localDate),
			scriptures: await this.getScriptures(localDate),
			fastingInfo: await this.getFastingInfo(localDate),
			iconOfTheDay: await this.getIconOfTheDay(localDate),
			hymns: await this.getHymns(localDate),
		};
	}
	async getLiturgicalWeek(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("header", "1");

		return this._getMarkedUpText(requestURL)
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

		return this._getMarkedUpText(requestURL).then(html => {
			const $ = load(html);
			for (let i = 0; i < 10; i++) {
				$(`.typicon-${i}`).remove();
			}
			$("i").wrapInner("<span class='emphasized'></span>");
			$(".emphasized").unwrap();
			$(".cal-main").removeAttr("onclick");
			$(".cal-main").each(function () {
				$(this).attr("target", "_blank");
				$(this).removeClass();
				$(this).addClass("commemoration");
			});
			return $(".normaltext").html()!;
		});
	}
	async getScriptures(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("scripture", "2");

		return this._getMarkedUpText(requestURL).then(html => {
			const $ = load(html);
			$(".normaltext")
				.contents()
				.filter(function () {
					return this.nodeType === 3 && this.nodeValue.includes("\n");
				})
				.each(function () {
					$(this).remove();
				});
			$("em").remove();
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

		return this._getMarkedUpText(requestURL)
			.then(html => {
				const $ = load(html);
				const fastText = $(".headerfast").text();
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
		return { source: link } as Pick<Image, "source"> & Partial<Image>;
	}

	async getHymns(date: Date) {
		const requestURL = this._getDatedBaseURL(date);
		requestURL.searchParams.set("trp", "2");

		return await this._getMarkedUpText(requestURL).then(html => {
			const $ = load(html);
			const hymns: Hymn[] = [];
			const markedUpHymns = $(".normaltext p");
			markedUpHymns.each(function () {
				const _$ = load(this);
				const title = _$("b").first().text().replace(" —", "");
				_$("b").first().remove();
				_$("br").remove();
				const text = _$("*").html()!.trim().replaceAll("\n", " ");
				hymns.push({ title, text: removeMarkup(text) });
			});
			return hymns;
		});
	}

	private _getMarkedUpText(url: URL) {
		return fetch(url)
			.then(response => {
				if (response.ok) return response.arrayBuffer();
				return Promise.reject(
					`${response.status}: ${response.statusText}`,
				);
			})
			.then(encodedResponse =>
				new TextDecoder("windows-1251").decode(encodedResponse),
			);
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
