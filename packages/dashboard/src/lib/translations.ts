import { useCallback, useEffect, useState } from "react";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

// Translation messages type
export type TranslationMessages = typeof enMessages;

// Translation function type
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>,
) => string;

// Deep access helper type
type DeepKeyOf<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? K extends string
      ? `${K}` | `${K}.${DeepKeyOf<T[K]>}`
      : never
    : K extends string
      ? K
      : never;
}[keyof T];

export type TranslationKey = DeepKeyOf<TranslationMessages>;

/**
 * SSR-safe hook to get current locale
 */
function useSSRSafeLocale(): string {
  const [locale, setLocale] = useState("en"); // Default to 'en' during SSR

  useEffect(() => {
    // Only access router locale on client side after hydration
    if (typeof window !== "undefined") {
      // Get locale from URL pathname instead of router during SSR
      const pathname = window.location.pathname;
      if (pathname.startsWith('/zh')) {
        setLocale('zh');
      } else if (pathname.startsWith('/en')) {
        setLocale('en');
      } else {
        // Default based on browser language or use default
        const browserLang = navigator.language.split('-')[0];
        setLocale(browserLang === 'zh' ? 'zh' : 'en');
      }
    }
  }, []);

  return locale;
}

/**
 * Hook to get translations for a given namespace
 */
export function useTranslations(namespace?: string): TranslationFunction {
  const locale = useSSRSafeLocale();
  const isZh = locale === "zh";

  // Select appropriate messages based on locale
  const messages = isZh ? zhMessages : enMessages;

  return useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      try {
        // If namespace is provided, prefix the key
        const fullKey = namespace ? `${namespace}.${key}` : key;

        // Navigate through nested object structure
        const keyParts = fullKey.split(".");
        let value: any = messages;

        for (const part of keyParts) {
          if (value && typeof value === "object" && part in value) {
            value = value[part];
          } else {
            // Fallback to key if translation not found
            console.warn(`Translation not found for key: ${fullKey}`);
            return key;
          }
        }

        if (typeof value !== "string") {
          console.warn(`Translation value is not a string for key: ${fullKey}`);
          return key;
        }

        // Simple parameter replacement
        if (params) {
          return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey]?.toString() || match;
          });
        }

        return value;
      } catch (error) {
        console.error(`Error in translation for key: ${key}`, error);
        return key;
      }
    },
    [messages, namespace],
  );
}

/**
 * Convenient hook for namespaced translations.
 * This is the recommended way to use translations in components
 */
export function useNamespacedTranslations(namespace: string): TranslationFunction {
  return useTranslations(namespace);
}

/**
 * Get current locale
 */
export function useLocale(): string {
  return useSSRSafeLocale();
}

/**
 * Check if current locale is Chinese
 */
export function useIsChineseLocale(): boolean {
  const locale = useLocale();
  return locale === 'zh';
}

/**
 * Switch language by updating the URL
 */
export function switchLanguage(newLocale: 'en' | 'zh') {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const currentLocale = currentPath.startsWith('/zh') ? 'zh' : currentPath.startsWith('/en') ? 'en' : 'en';
    
    if (currentLocale === newLocale) return;
    
    let newPath = currentPath;
    
    // Remove current locale prefix if it exists
    if (currentPath.startsWith('/zh/') || currentPath.startsWith('/en/')) {
      newPath = currentPath.substring(3); // Remove '/zh' or '/en'
    } else if (currentPath === '/zh' || currentPath === '/en') {
      newPath = '/';
    }
    
    // Add new locale prefix if it's not the default
    if (newLocale === 'zh') {
      newPath = '/zh' + (newPath === '/' ? '' : newPath);
    } else {
      newPath = '/en' + (newPath === '/' ? '' : newPath);
    }
    
    window.location.href = newPath;
  }
}
