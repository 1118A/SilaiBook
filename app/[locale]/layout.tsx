import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/lib/context/AuthContext";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as "en" | "gu" | "hi")) {
    notFound();
  }

  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <div lang={locale} className="flex-1 flex flex-col">
          {children}
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
