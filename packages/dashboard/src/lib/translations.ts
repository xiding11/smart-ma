import { useRouter } from 'next/router';
import { useCallback } from 'react';
import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';

// Translation messages type
export type TranslationMessages = typeof enMessages;

// Translation function type
export type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

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
 * Universal translation hook that provides consistent i18n functionality
 * across all dashboard components
 */
export function useTranslations(namespace?: string): TranslationFunction {
  const router = useRouter();
  const locale = router.locale || 'en';
  const isZh = locale === 'zh';
  
  // Select appropriate messages based on locale
  const messages = isZh ? zhMessages : enMessages;
  
  return useCallback((key: string, params?: Record<string, string | number>): string => {
    try {
      // If namespace is provided, prefix the key
      const fullKey = namespace ? `${namespace}.${key}` : key;
      
      // Navigate through nested object structure
      const keyParts = fullKey.split('.');
      let value: any = messages;
      
      for (const part of keyParts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          // Fallback to key if translation not found
          console.warn(`Translation not found for key: ${fullKey}`);
          return key;
        }
      }
      
      if (typeof value !== 'string') {
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
  }, [messages, namespace]);
}

/**
 * Hook for translations within a specific namespace
 * This is the recommended way to use translations in components
 */
export function useNamespacedTranslations(namespace: string): TranslationFunction {
  return useTranslations(namespace);
}

/**
 * Get current locale
 */
export function useLocale(): string {
  const router = useRouter();
  return router.locale || 'en';
}

/**
 * Check if current locale is Chinese
 */
export function useIsChineseLocale(): boolean {
  const locale = useLocale();
  return locale === 'zh';
}

/**
 * Direct translation function for use outside of React components
 */
export function translate(key: string, locale: string = 'en', params?: Record<string, string | number>): string {
  const messages = locale === 'zh' ? zhMessages : enMessages;
  
  try {
    const keyParts = key.split('.');
    let value: any = messages;
    
    for (const part of keyParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
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
}