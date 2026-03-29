import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../type/general";

export interface ScripturesWidgetModelView {
	details: Pick<DailyReadings, "scriptures" | "fastingInfo">;
}

export type ScripturesWidgetModel = ReadonlyModel<ScripturesWidgetModelView>;
