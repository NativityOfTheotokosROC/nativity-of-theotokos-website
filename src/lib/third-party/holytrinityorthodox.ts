import { load } from "cheerio";
import { toZonedTime } from "date-fns-tz";
import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";
import { DailyReadings, Hymn, Image, Language } from "../types/general";
import { getLocalTimeZone } from "../utilities/date-time";
import { removeMarkup } from "../utilities/miscellaneous";
import { Commemoration } from "../models/commemoration";

export async function dailyReadings(date: Date, language: Language) {
	"use cache: remote";
	cacheLife("max");
	cacheTag("holytrinity-readings");
	const localDate = toZonedTime(date, getLocalTimeZone());
	const [
		liturgicalWeek,
		saints,
		scriptures,
		fastingInfo,
		iconOfTheDay,
		hymns,
	] = await Promise.all([
		getLiturgicalWeek(localDate, language),
		getSaints(localDate, language),
		getScriptures(localDate, language),
		getFastingInfo(localDate, language),
		getIconOfTheDay(localDate, language),
		getHymns(localDate, language),
	]);
	return {
		currentDate: date,
		liturgicalWeek,
		saints,
		scriptures,
		fastingInfo,
		iconOfTheDay,
		hymns,
	} satisfies DailyReadings;
}
export async function getLiturgicalWeek(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getBaseURL(language));
	requestURL.searchParams.set("header", "1");

	return _getMarkedUpText(requestURL)
		.then(html => {
			const $ = load(html);
			$(".headerfast").remove();
			$(".headernofast").remove();
			return $.html();
		})
		.then(markedUpText => removeMarkup(markedUpText));
}
export async function getSaints(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getBaseURL(language));
	requestURL.searchParams.set("lives", "2");

	return _getMarkedUpText(requestURL).then(html => {
		const $ = load(html);
		for (let i = 0; i < 10; i++) {
			$(`.typicon-${i}`).remove();
		}
		$("i").wrapInner("<span class='emphasized'></span>");
		$(".emphasized").unwrap();
		$(".cal-main").removeAttr("onclick");
		$(".cal-main").each(function () {
			const urlParts = $(this).attr("href")!.split("/");
			const id = [
				urlParts[urlParts.length - 2],
				urlParts[urlParts.length - 1],
			]
				.join("_")
				.replace(/\.html?/, "");
			$(this).attr("href", `/commemorations/${id}`);
			$(this).removeClass();
			$(this).addClass("commemoration");
		});
		return $(".normaltext").html()!;
	});
}

export async function getCommemoration(
	id: string,
	language: Language,
): Promise<Commemoration | null> {
	"use cache: remote";

	const requestURL = new URL(
		_getCommemorationURL(language) + `/${id.replace("_", "/")}.htm`,
	);
	const t = await getTranslations({
		locale: language,
		namespace: "commemoration",
	});
	try {
		const html = await _getMarkedUpText(requestURL, "UTF-8");
		const $ = load(html);
		const titleElement = $(".ofd_los_header");
		const iconElement = $("img").first();
		const feastDaysElement = $(".ofd_los_body").first();

		const title = titleElement.text().trim();
		titleElement.remove();
		const iconSource = iconElement.attr("src");
		const iconAbout = iconElement.attr("alt");
		const prefix = id.split("_")[0];
		const icon = iconSource
			? ({
					source: _getCommemorationImageURL(
						`/${prefix}/${iconSource}`,
						language,
					),
					about: iconAbout,
				} satisfies Pick<Image, "source" | "about">)
			: undefined;
		iconElement.unwrap();
		iconElement.remove();
		const feastDays = `${feastDaysElement.text()} (${t("oldCalendar")})`;
		feastDaysElement.remove();
		$("img").each(function () {
			const iconSource = $(this).attr("src")!;
			const prefix = id.split("_")[0];
			$(this).attr(
				"src",
				_getCommemorationImageURL(`/${prefix}/${iconSource}`, language),
			);
		});
		const paragraphs: string[] = [];
		$(".ofd_los_body").each(function () {
			const text = $(this)
				.unwrap()
				.html()!
				.replaceAll(/\n+/gm, " ")
				.replaceAll(/(\&nbsp;){2,}|\u00a0{2,}/gm, "\n")
				.replaceAll(/(\&nbsp;)+|\u00a0+/gm, " ")
				.trim()
				.replaceAll(/\n+/gm, "<br><br>");
			paragraphs.push(text);
		});
		const body = paragraphs
			.join("<br><br>")
			.replaceAll(/(<br>\s*<br>\s*<br>)+/gm, "<br><br>"); // Tee-hee
		return { title, feastDays, icon, body, id } satisfies Commemoration;
	} catch (error) {
		if (error instanceof Response && error.status == 404) return null;
		throw error;
	}
}

export async function getScriptures(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getBaseURL(language));
	requestURL.searchParams.set("scripture", "2");

	return _getMarkedUpText(requestURL).then(html => {
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
			$(this).addClass("scripture");
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
			_$("*").wrapAll('<span class="reading"></span>');
			markedUpScriptures.push(_$(".reading").html()!);
		});
		const scriptures = markedUpScriptures.map(scripture => {
			const _$ = load(scripture, null, false);
			return {
				scriptureText: _$(".scripture").text().trim(),
				designation: _$(".designation").text().trim(),
				link: _$(".scripture").attr("href")!.trim(),
			};
		});
		return scriptures;
	});
}
export async function getFastingInfo(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getBaseURL(language));
	const t = await getTranslations({
		locale: language,
		namespace: "dailyReadings",
	});
	requestURL.searchParams.set("header", "1");

	return _getMarkedUpText(requestURL)
		.then(html => {
			const $ = load(html);
			const fastText = $(".headerfast").text();
			return (fastText ? fastText : $(".headernofast").text()).trim();
		})
		.then(markedUpText => removeMarkup(markedUpText))
		.then(info => (info.length === 0 ? t("noFast") : info));
}

export async function getIconOfTheDay(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getIconOfTheDayURL(language));
	requestURL.searchParams.set("img", "1");
	const encoding = requestURL.href.includes("/ru/") ? "UTF-8" : undefined;

	return (await _getMarkedUpText(requestURL, encoding).then(html => {
		const $ = load(html);
		const iconImage = $(".icon_img");
		const src = iconImage.attr("src")!;
		const imagePath = !src.startsWith("/htc/") ? `/htc/${src}` : src;
		const about = iconImage.attr("alt")!.replace(/\&.+\;/, "");
		const source = new URL(imagePath, `${requestURL.origin}`).href;
		return { source, about };
	})) satisfies Pick<Image, "source" | "about"> & Partial<Image>;
}

export async function getHymns(date: Date, language: Language) {
	const requestURL = _getDatedBaseURL(date, _getBaseURL(language));
	requestURL.searchParams.set("trp", "2");

	return await _getMarkedUpText(requestURL).then(html => {
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

function _getBaseURL(language: Language) {
	const interpolation = language === "ru" ? "/ru/" : "/";
	return `https://www.holytrinityorthodox.com/htc/ocalendar${interpolation}v2calendar.php`;
}

function _getIconOfTheDayURL(language: Language) {
	const interpolation = language === "ru" ? "/ru/" : "/";
	return `https://www.holytrinityorthodox.com/htc/iconoftheday${interpolation}v6TitleIconTroparion.php`;
}

function _getCommemorationURL(language: Language) {
	const interpolation = language === "ru" ? "/ru/" : "/";
	return `https://www.holytrinityorthodox.com/htc/ocalendar${interpolation}los`;
}

function _getCommemorationImageURL(path: string, language: Language) {
	const interpolation = language === "ru" ? "/ru/" : "/";
	return `https://www.holytrinityorthodox.com/htc/ocalendar${interpolation}los${path}`;
}

function _getMarkedUpText(
	url: URL,
	encoding: "windows-1251" | "UTF-8" = "windows-1251",
) {
	return fetch(url)
		.then(response => {
			if (response.ok) return response.arrayBuffer();
			return Promise.reject(response);
		})
		.then(encodedResponse =>
			new TextDecoder(encoding).decode(encodedResponse),
		);
}

function _getDatedBaseURL(date: Date, baseURL: string) {
	const requestURL = new URL(baseURL);

	requestURL.searchParams.set("today", date.getDate().toString());
	requestURL.searchParams.set("month", (date.getMonth() + 1).toString());
	requestURL.searchParams.set("year", date.getFullYear().toString());
	return requestURL;
}
