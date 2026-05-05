import { ReadonlyModel } from "@mvc-react/mvc";

export type HeroSectionModelView = {
	introduce: boolean;
	title: string;
	subtitle: string;
};

export type HeroSectionModel = ReadonlyModel<HeroSectionModelView>;
