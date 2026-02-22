import { ReadonlyModel } from "@mvc-react/mvc";

export interface HeroSectionModelView {
	introduce: boolean;
	title: string;
	subtitle: string;
}

export type HeroSectionModel = ReadonlyModel<HeroSectionModelView>;
