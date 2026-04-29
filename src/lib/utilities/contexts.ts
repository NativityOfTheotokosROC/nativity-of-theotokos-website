import { createContext } from "react";
import { LoginTooltipModel } from "../models/login-tooltip";

export const LoginTooltipContext = createContext<LoginTooltipModel | undefined>(
	undefined,
);
