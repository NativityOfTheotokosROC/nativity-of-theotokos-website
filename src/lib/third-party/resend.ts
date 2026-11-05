import "server-only";
import { Resend } from "resend";
import { RESEND_API_KEY } from "../utilities/server-constants";

const resend = new Resend(RESEND_API_KEY);
export default resend;
