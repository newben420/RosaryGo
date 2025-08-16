import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Share, Linking } from 'react-native';
import { MD3Theme, List, Divider, Text } from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { i18n, locales } from '../library/i18n';
import { ThemeMode } from '../library/themeMode';
import { Site } from '../site';
import { Log } from '../library/log';
import * as StoreReview from 'expo-store-review';

interface MyBottomSheetProps {
    theme: MD3Theme;
    themeMode: ThemeMode;
    saveTheme: (mode: ThemeMode) => Promise<void>;
    menu: boolean,
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
    locvis: boolean;
    setLocvis: React.Dispatch<React.SetStateAction<boolean>>;
    dm: boolean;
    toogleDM: () => void;
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPromises: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyBottomSheet({ theme, saveTheme, themeMode, menu, setMenu, setShowHistory, setShowPromises, locvis, setLocvis, dm, toogleDM }: MyBottomSheetProps) {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const onAnimate = (fromIndex: number, toIndex: number) => {
        setMenu(toIndex >= 0)
    }

    const openLocaleMenu = () => {
        handleDismissModalPress();
        setLocvis(true);
    }

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            appearsOnIndex={0}
            disappearsOnIndex={-1}
        />
    );

    useEffect(() => {
        if (menu) {
            bottomSheetModalRef.current?.present();
        }
    }, [menu]);

    const renderHandle = (props: BottomSheetHandleProps) => (
        <BottomSheetHandle
            {...props}
            style={{ ...style.bottomSheetHandle, backgroundColor: theme.colors.background }}
        />
    );

    const changeTheme = (dark: boolean) => {
        handleDismissModalPress();
        saveTheme(dark ? "dark" : 'system');
    }

    const share = async () => {
        handleDismissModalPress();
        const message = i18n.t("SHARE_DESC", { url: Site.APP_URL });
        try {
            const result = await Share.share({
                message: message,
                title: Site.BRAND,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Log.dev(error);
        }
    }

    const rate = async () => {
        handleDismissModalPress();
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
            StoreReview.requestReview();
        } else {
            // Fallback: open store link manually
            Linking.openURL(Site.APP_URL);
        }
    }

    const snapPoints = useMemo(() => ['50%', '75%'], []);

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: theme.colors.background }}
            handleComponent={renderHandle}
            detached={true}
            snapPoints={snapPoints}
            onAnimate={onAnimate}
            handleIndicatorStyle={{ backgroundColor: theme.colors.backdrop }}
        >
            <BottomSheetView style={{ ...style.bottomContainer, backgroundColor: theme.colors.background }}>
                <View style={style.bottomInnerContainer}>
                    <List.Section>
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t(`HISTORY`)}
                            onPress={() => { setShowHistory(true); handleDismissModalPress(); }}
                            left={props => <List.Icon {...props} icon={'history'} />}
                        />
                        {!dm && <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t(`PROM_SHORT`)}
                            onPress={() => { setShowPromises(true); handleDismissModalPress(); }}
                            left={props => <List.Icon {...props} icon={'shield-crown'} />}
                        />}
                    </List.Section>
                    <Divider />
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.outline }}>{i18n.t("MENU.MODE") + ': ' + i18n.t(dm ? 'DIVINE_MERCY' : 'ROSARY')}</List.Subheader>
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t(`USE`, { mode: i18n.t(dm ? 'ROSARY' : 'DIVINE_MERCY') })}
                            onPress={() => { toogleDM(); handleDismissModalPress(); }}
                            left={props => <List.Icon {...props} icon={'hands-pray'} />}
                        />
                    </List.Section>
                    <Divider />
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.outline }}>{i18n.t("MENU.APP")}</List.Subheader>
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t(`THEME.${theme.dark ? 'dark' : 'light'}`)}
                            onPress={() => changeTheme(!theme.dark)}
                            left={props => <List.Icon {...props} icon={theme.dark ? 'weather-night' : 'weather-sunny'} />}
                        />
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t('LANG', { lang: locales.find(l => l.code == i18n.locale)?.label })}
                            onPress={openLocaleMenu}
                            left={props => <List.Icon {...props} icon="translate" />}
                        />
                    </List.Section>
                    <Divider />
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.outline }}>{i18n.t("MENU.COMMUNITY")}</List.Subheader>
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t(`SHARE`)}
                            onPress={share}
                            left={props => <List.Icon {...props} icon={Platform.OS == "ios" ? 'export-variant' : 'share-variant'} />}
                        />
                        <List.Item
                            titleStyle={style.menuItemTitleStyle}
                            style={style.menuItemStyle}
                            title={i18n.t('RATE', { brand: Site.BRAND })}
                            onPress={rate}
                            left={props => <List.Icon {...props} icon="star" />}
                        />
                    </List.Section>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        paddingVertical: 40,
                        opacity: 0.5,
                    }}>
                        <Text variant='bodySmall'>{Site.SRC} &copy; {Site.YEAR}</Text>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const style = StyleSheet.create({
    bottomSheetHandle: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bottomInnerContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
    },
    menuItemStyle: {
        marginVertical: 10
    },
    menuItemTitleStyle: {
        fontSize: 18,
    },
});
