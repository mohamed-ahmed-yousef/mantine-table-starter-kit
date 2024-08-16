import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { availableLocalesMap, defaultLocale } from "@/next.locales";
import { LocaleProvider } from "@/providers/locale-provider";
import { ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import type { ReactNode } from "react";
import App from "./_app";
const inter = Inter({ subsets: ["latin"] });
const noto = Noto_Kufi_Arabic({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Hospital for medical care",
  description: "medical care website",
};

export default function RootLayout({
                                     children,
                                     params: { locale },
                                   }: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const { langDir, hrefLang } = availableLocalesMap[locale] || defaultLocale;
  return (
      <html lang={hrefLang} dir={langDir} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={cn(inter.className, noto.className)}>
      <LocaleProvider>
        <App langDir={langDir}>
          <Notifications />
          {children}
        </App>
      </LocaleProvider>
      </body>
      </html>
  );
}
