import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n, locales } from '../library/i18n';
import { StorageKeys } from '../library/storageKeys';


interface LocaleContextProps {
    locale: string;
    setLocale: (locale: string) => void;
}

export const LocaleContext = createContext<LocaleContextProps>({
    locale: i18n.locale || locales[0].code,
    setLocale: () => { },
});

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocaleState] = useState(i18n.locale || locales[0].code);

    useEffect(() => {
        AsyncStorage.getItem(StorageKeys.LOCALE).then((storedLocale) => {
            if (storedLocale) {
                i18n.locale = storedLocale;
                setLocaleState(storedLocale);
            }
        });
    }, []);

    const setLocale = (newLocale: string) => {
        i18n.locale = newLocale;
        setLocaleState(newLocale);
        AsyncStorage.setItem(StorageKeys.LOCALE, newLocale);
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};
