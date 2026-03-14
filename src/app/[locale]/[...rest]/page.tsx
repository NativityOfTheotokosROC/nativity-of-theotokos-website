import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function CatchAll({ params }: LayoutProps<"/[locale]">) {
  setRequestLocale((await params).locale);
  notFound();
}
