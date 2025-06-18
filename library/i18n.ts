import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './../locales/en.json';
import la from './../locales/la.json';
import es from './../locales/es.json';
import fr from './../locales/fr.json';
import pt from './../locales/pt.json';
import it from './../locales/it.json';
import tl from './../locales/tl.json';
import sw from './../locales/sw.json';

export const locales = [
    {code: 'en', label: 'English'},
    {code: 'la', label: 'Latina'},
    {code: 'es', label: 'Español'},
    {code: 'fr', label: 'Français'},
    {code: 'pt', label: 'Português'},
    {code: 'it', label: 'Italiano'},
    {code: 'tl', label: 'Tagalog'},
    {code: 'sw', label: 'Kiswahili'},
]

const i18 = new I18n({ 
    en, la, es, fr, pt, it, tl, sw,
});

const deviceLanguage = getLocales()[0].languageCode || locales[0].code;

i18.locale = deviceLanguage;
i18.enableFallback = true;

export const i18n = i18;