import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../types/general";

export type ScripturesWidgetModelView = {
	details: Pick<DailyReadings, "scriptures" | "fastingInfo">;
};

export type ScripturesWidgetModel = ReadonlyModel<ScripturesWidgetModelView>;
