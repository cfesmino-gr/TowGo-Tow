import { createContext, useContext } from 'react'
import raw from './i18n.json'

export type Lang = 'en' | 'lv' | 'ar'
export type Dict = typeof raw.en

export const languages: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'lv', label: 'LV' },
  { code: 'ar', label: 'AR' },
]

export function getDict(lang: Lang): Dict {
  return { ...raw.en, ...(raw[lang] as Partial<Dict>) }
}

type I18nValue = {
  lang: Lang
  t: Dict
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18nValue>({
  lang: 'en',
  t: raw.en,
  setLang: () => undefined,
})

export function useI18n() {
  return useContext(I18nContext)
}
