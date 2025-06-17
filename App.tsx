import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { dbSetUp } from "./library/db";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { Log } from "./library/log";
import {
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider, useLocale } from "./components/LocaleContext";
import { Site } from "./site";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "./library/storageKeys";
import Page from "./components/Page";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeMode } from "./library/themeMode";
import { NotifierWrapper } from "react-native-notifier";
import { CustomDarkTheme, CustomLightTheme } from "./library/themes";
SplashScreen.preventAutoHideAsync();
import * as Font from 'expo-font';




interface MainAppProps {
  isReady: boolean;
  onLayoutRootView: () => void;
};


function MainApp({ isReady, onLayoutRootView }: MainAppProps) {
  const { locale } = useLocale();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const isDark = useMemo(() => {
    return themeMode === "system"
      ? systemScheme === "dark"
      : themeMode === "dark";
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => (isDark ? CustomDarkTheme : CustomLightTheme), [isDark]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(StorageKeys.THEME);
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeMode(saved);
      }
    })();
  }, [themeMode]);

  const saveTheme = useCallback(
    async (mode: ThemeMode) => {
      setThemeMode(mode);
      await AsyncStorage.setItem(StorageKeys.THEME, mode);
    },
    [setThemeMode]
  );

  if (!isReady) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <GestureHandlerRootView>
          <NotifierWrapper>
            <PaperProvider theme={theme}>
              <BottomSheetModalProvider>
                <Page isDark={isDark} themeMode={themeMode} saveTheme={saveTheme} theme={theme} />
              </BottomSheetModalProvider>
            </PaperProvider>
          </NotifierWrapper>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    const prepareApp = async () => {
      try {
        const start = Date.now();
        // begin setup
        // db setup
        await dbSetUp();
        await Font.loadAsync({
          'secondary2': require('./assets/font/CrimsonPro-VariableFont_wght.ttf'),
          'secondary': require('./assets/font/EBGaramond-VariableFont_wght.ttf'),
          'tertiary': require('./assets/font/Calligraffitti-Regular.ttf'),
        })
        // end setup
        const end = Date.now();
        const duration = end - start;
        if (duration < Site.SPLASH_TIME_MS) {
          await new Promise((r) => setTimeout(r, Site.SPLASH_TIME_MS - duration));
        }
      } catch (error) {
        Log.dev(error);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <LocaleProvider>
      <MainApp isReady={isReady} onLayoutRootView={onLayoutRootView} />
    </LocaleProvider>
  );
}
