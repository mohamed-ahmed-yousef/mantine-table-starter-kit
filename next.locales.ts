const localeConfig = [
	{
		code: "ar",
		localName: "العربية",
		name: "Arabic",
		langDir: "rtl",
		dateFormat: "YYYY.MM.DD",
		hrefLang: "ar",
		enabled: true,
		default: true,
	},
	{
		code: "en",
		localName: "English",
		name: "English",
		langDir: "ltr",
		dateFormat: "MM.DD.YYYY",
		hrefLang: "en-GB",
		enabled: true,
		default: false,
	},
];

// As set of available and enabled locales for the website
// This is used for allowing us to redirect the user to any
// of the available locales that we have enabled on the website
const availableLocales = localeConfig.filter((locale) => locale.enabled);

// This gives an easy way of accessing all available locale codes
const availableLocaleCodes = availableLocales.map((locale) => locale.code);

// This provides the default locale information for the Next.js Application
// This is marked by the unique `locale.default` property on the `en` locale
// biome-ignore lint/style/noNonNullAssertion: an error will be thrown if not defined
const defaultLocale = availableLocales.find((locale) => locale.default)!;

if (!defaultLocale) {
	throw new Error("No default locale found");
}

// Creates a Map of available locales for easy access
const availableLocalesMap = Object.fromEntries(
	localeConfig.map((locale) => [locale.code, locale]),
);

type 	Locale = (typeof availableLocaleCodes)[number];

export {
	type Locale,
	availableLocales,
	availableLocaleCodes,
	availableLocalesMap,
	defaultLocale,
};