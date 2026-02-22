import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../type/miscellaneous";

export interface ScripturesWidgetModelView {
	details: Pick<DailyReadings, "scriptures" | "fastingInfo">;
}

export type ScripturesWidgetModel = ReadonlyModel<ScripturesWidgetModelView>;
