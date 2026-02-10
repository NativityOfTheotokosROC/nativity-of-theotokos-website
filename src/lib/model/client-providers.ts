import { ReadonlyModel } from "@mvc-react/mvc";

export interface ClientProvidersModelView {
	locale: string;
}

export type ClientProvidersModel = ReadonlyModel<ClientProvidersModelView>;
