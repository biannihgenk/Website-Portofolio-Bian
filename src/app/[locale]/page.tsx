import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Public home page placeholder.
 * Will be replaced with the Stitch design implementation in a later phase.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("meta");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">{t("siteTitle")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("siteDescription")}</p>
      <p className="mt-8 text-sm text-muted-foreground/60">
        🏗️ Infrastructure phase — public pages will be implemented from Stitch designs.
      </p>
    </main>
  );
}
