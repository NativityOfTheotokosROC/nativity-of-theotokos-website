import MailerLite from "@mailerlite/mailerlite-nodejs";
import { MAILERLITE_API_KEY } from "../utility/server-constant";

const mailerLite = new MailerLite({ api_key: MAILERLITE_API_KEY });

export default mailerLite;
