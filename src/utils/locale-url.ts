import { getRelativeLocaleUrl } from 'astro:i18n';
import * as config from 'astro:config/server';

const defaultLocale = config.i18n?.defaultLocale ?? 'en';

// Routes available in every supported locale (the home page is always
// localized). Any other route only exists in the default locale.
const localizedRoutes: ReadonlySet<string> = new Set(['/privacy']);

// "/privacy/" -> "/privacy" so paths compare equal regardless of trailing slash.
const normalize = (path: string): string =>
    path.length > 1 ? path.replace(/\/+$/, '') : path;

/** True when `path` has a counterpart in every supported locale. */
export function isLocalized(path: string): boolean {
    const p = normalize(path);
    return p === '/' || localizedRoutes.has(p);
}

/**
 * URL of `path` in the given locale. When the page has no counterpart in
 * that locale (e.g. /notes/* when switching to pl), falls back to the
 * default-locale (English) version of the same page, so the link never
 * points to a 404.
 */
export function localeUrl(locale: string, path: string): string {
    const target = isLocalized(path) ? locale : defaultLocale;
    return getRelativeLocaleUrl(target, path);
}
