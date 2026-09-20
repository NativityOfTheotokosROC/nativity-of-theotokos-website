import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../utilities/types";

export type ScripturesWidgetModelView = {
	details: Pick<DailyReadings, "scriptures" | "fastingInfo">;
};

export type ScripturesWidgetModel = ReadonlyModel<ScripturesWidgetModelView>;
