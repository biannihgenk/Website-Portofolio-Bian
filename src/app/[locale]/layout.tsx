import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono, Caveat } from "next/font/google";
import { routing } from "@/lib/i18n/routing";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

import { InteractiveNetworkBackground } from "@/components/layout/InteractiveNetworkBackground";
import { InteractiveDeskCompanion } from "@/components/home/InteractiveDeskCompanion";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable} ${caveat.variable} min-h-screen bg-[#fbf9f3] text-[#222222] font-sans antialiased selection:bg-[#dbeafe] selection:text-[#222222]`}
      >
        <NextIntlClientProvider messages={messages}>
          <InteractiveNetworkBackground />
          <div className="relative z-10 w-full min-h-screen">
            {children}
          </div>
          <InteractiveDeskCompanion />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
