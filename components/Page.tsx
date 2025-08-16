import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Appbar, Button, MD3Theme, Text, Divider, ActivityIndicator, Surface, Chip } from 'react-native-paper';
import LocaleSwitch from './LocaleSwitch';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from '../library/storageKeys';
import { i18n } from '../library/i18n';
import { ThemeMode } from '../library/themeMode';
import { Site } from '../site';
import { Log } from '../library/log';
import MyBottomSheet from './MyBottomSheet';
import { clearUnfinishedSessions, finishSession, getSessions, saveNewSession } from '../library/db';
import { Session } from '../library/model/session';
import Intention from './Intention';
import ConfirmDialog from './ConfirmDialog';
import { generatePages, PageContent } from '../library/model/control';
import Animated, { FadeIn, FadeOut, SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import { imageMap, RosaryMap } from '../library/imageMap';
import History from './History';
import Promises from './Promises';
import Welcome from './Welcome';
import { CustomLightTheme as MD3LightTheme, CustomDarkTheme as MD3DarkTheme } from '../library/themes';
import { ScrollView } from 'react-native-gesture-handler';
import { useNotification } from './notification/NotificationContext';

interface PageProps {
    theme: MD3Theme;
    themeMode: ThemeMode;
    saveTheme: (mode: ThemeMode) => Promise<void>;
    isDark: boolean;
}

const noticeIndex: number[] = [1];

export default function Page({ theme, saveTheme, themeMode, isDark }: PageProps) {
    const [menu, setMenu] = useState<boolean>(false);
    const [locvis, setLocvis] = useState<boolean>(false);
    const [timenow, setTimenow] = useState<number>(Date.now());
    const [ready, setReady] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [session, setSession] = useState<Session | null>(null);
    const [starting, setStarting] = useState<boolean>(false);
    const [showIntention, setShowIntention] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const confirmCBRef = useRef<(yes: boolean) => void>(() => { });
    const [dm, setDM] = useState<boolean>(false);
    const [p, setP] = useState<PageContent>(new PageContent());
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showPromises, setShowPromises] = useState<boolean>(false);
    const [showWelcome, setShowWelcome] = useState<boolean>(false);
    const {showNotification} = useNotification();
    const pages: Record<string, PageContent> = useMemo(() => {
        const p = session ? generatePages(session) : {};
        return p;
    }, [session]);

    useEffect(() => {
        const p = pages[`p_${activeIndex}`] || (new PageContent());
        setP(p);
    }, [pages, activeIndex]);

    useEffect(() => {
        let timex = setInterval(() => {
            setTimenow(Date.now());
        }, Site.PAGE_REFRESH_INTERVAL_MS);
        (async () => {
            try {
                const sessions = await getSessions(1);
                if (sessions.length > 0) {
                    setSession(sessions[0]);
                }
                const index = parseInt(await AsyncStorage.getItem(StorageKeys.INDEX) || "0") || 0;
                if (index) {
                    setActiveIndex(index);
                }
                setDM((await AsyncStorage.getItem(StorageKeys.DM)) == "YES");
                const first = (await AsyncStorage.getItem(StorageKeys.WELCOME)) != Site.VERSION;
                if (first) {
                    setTimeout(() => {
                        setShowWelcome(true);
                    }, 1500);
                }
            } catch (error) {
                Log.dev(error);
            }
            finally {
                setReady(true);
            }
        })();
        return () => clearInterval(timex);
    }, []);

    const next = () => {
        AsyncStorage.setItem(StorageKeys.INDEX, (activeIndex + 1).toString());
        setActiveIndex(activeIndex + 1);
    }

    const confirm = (title: string, callback: (yes: boolean) => void, params: any = {}) => {
        setConfirmTitle(i18n.t(title, params));
        confirmCBRef.current = callback;
        setShowConfirm(true);
    }

    const finish = () => {
        let f;
        const fin = async () => {
            showNotification({
                message: i18n.t("CONGRATS"),
                type: 'success',
            });
            await finishSession(Date.now());
            await clearUnfinishedSessions();
            setSession(null);
            AsyncStorage.setItem(StorageKeys.INDEX, '0');
            setActiveIndex(0);
        }
        if (p.altNext == "FINISH") {
            f = true;
            fin();
        }
        else {
            f = false;
            confirm("SURE", yes => {
                if (yes) {
                    fin();
                }
            });
        }

    }

    const start = async () => {
        setStarting(true);
        await clearUnfinishedSessions();
        setShowIntention(true);
    }

    const submitIntention = async (intention: string) => {
        setStarting(true);
        const saved = await saveNewSession({
            intention: intention,
            is_dm: dm,
            start: Date.now(),
        });
        if (saved) {
            setSession(saved);
            next();
        }
        else {
            showNotification({
                message: i18n.t("NEW_SESS_ERR"),
                type: 'error',
            });
        }
        setStarting(false);
    }

    const toggleDM = () => {
        showNotification({
            message: i18n.t("MODE_CHANGED_BODY", { prayer: i18n.t(!dm ? 'DIVINE_MERCY' : 'ROSARY') }),
            type: 'success',
        });
        AsyncStorage.setItem(StorageKeys.DM, !dm ? "YES" : "NO");
        setDM(!dm);
    }

    if (!ready) {
        return (
            <View style={{ ...style.loadingContainer, backgroundColor: theme.colors.background }}>
                <ActivityIndicator animating={true} size={50}></ActivityIndicator>
            </View>
        );
    }

    return (
        <ImageBackground source={activeIndex ? '' : dm ? require('./../assets/img/dmbg.png') : require('./../assets/img/hrbg.png')} style={{ flex: 1, width: '100%', height: '100%', backgroundColor: theme.colors.background }} imageStyle={{ resizeMode: 'cover' }}>
            <View style={{ ...style.container, backgroundColor: !!activeIndex ? theme.colors.background : theme.colors.backdrop }}>
                <Appbar.Header theme={!activeIndex ? MD3DarkTheme : theme} style={{ ...style.header, backgroundColor: 'transparent', paddingRight: !!activeIndex ? 0 : 0, }} mode='small' elevated={false}>
                    <Appbar.Content title={p.title ? i18n.t(p.title) : Site.BRAND} />
                    <Appbar.Action onPress={() => setMenu(true)} icon={menu ? 'close' : !!activeIndex ? 'dots-vertical' : 'dots-horizontal-circle'}></Appbar.Action>
                </Appbar.Header>
                <View style={{ ...style.content, }}>
                    {/* {!!activeIndex && <Image style={{ opacity: 0.05, objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, zIndex: 0, left: 0, }} source={session?.is_dm ? require('./../assets/img/dmbg.png') : require('./../assets/img/hrbg.png')} />} */}
                    {!!p.rosary && <Animated.View key={p.rosary ? 1000 : 1001} entering={FadeIn.duration(Site.TRANSITION_MS)} exiting={FadeOut.duration(Site.TRANSITION_MS)} style={{ flex: 1, position: 'absolute', zIndex: 0, width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 20, paddingBottom: 100, }}><Image style={{ opacity: 0.15, objectFit: 'contain', width: '100%', height: '100%', }} source={require('./../assets/img/r/r2.png')} /></Animated.View>}
                    {!!p.rosary && <Animated.View key={p.rosary} entering={FadeIn.duration(Site.TRANSITION_MS)} exiting={FadeOut.duration(Site.TRANSITION_MS)} style={{ flex: 1, position: 'absolute', zIndex: 0, width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 20, paddingBottom: 100, }}><Image style={{ opacity: 1, objectFit: 'contain', width: '100%', height: '100%', }} source={RosaryMap[p.rosary.toString()]} /></Animated.View>}
                    {!!activeIndex && <Animated.View style={{ flex: 1 }} entering={SlideInRight.duration(Site.TRANSITION_MS)} exiting={SlideOutLeft.duration(Site.TRANSITION_MS)} key={activeIndex}>
                        <ScrollView style={{ ...style.noticeView, }}>
                        {p.type == "intro" && <View style={{ ...style.introCont }}>
                            {!!p.picture && <Image style={{ height: 150, width: 150, resizeMode: 'contain' }} source={isDark ? (imageMap[p.picture + '_dark'] || imageMap[p.picture]) : imageMap[p.picture]} />}
                            {!!p.subtitle && <Text style={{ fontFamily: 'secondary2', marginTop: p.subtype == "big" ? 30 : 30, textAlign: 'center' }} variant={p.subtype == "big" ? 'displaySmall' : 'headlineLarge'}>{p.extraSub && `${p.extraSub}`} {p.subtype == "big" ? i18n.t(p.subtitle) : i18n.t(p.subtitle)}</Text>}
                            {/* {!!p.timestamp && p.subtype == "big" && <Text variant='bodySmall' style={{ fontWeight: 600, marginTop: 10, color: MD3LightTheme.colors.primary }}>{getTimeElapsed((p.timestamp || 0), timenow)}</Text>} */}
                            {((!!p.intention) || (!!p.description)) && <Surface elevation={p.subtype == "big" ? 0 : 0} style={{ ...style.noticeSurface, backgroundColor: p.subtype == "big" ? theme.colors.background : 'transparent', marginTop: 20, }}>
                                {/* {!!p.intention && <Text variant='titleLarge' style={{ fontWeight: 600, color: theme.colors.primary, textAlign: 'center' }}>{i18n.t("INTENTION")}</Text>} */}
                                {!!p.intention && <Text style={{ fontFamily: 'secondary2', marginTop: 0, textAlign: 'center' }} variant='bodyMedium'>{p.intention}</Text>}
                                {!!p.description && <Text style={{ fontFamily: 'secondary2', color: p.subtype == "big" ? theme.colors.background : theme.colors.onBackground, textAlign: 'center' }} variant='bodyLarge'>{i18n.t(p.description)}</Text>}
                            </Surface>}
                        </View>}
                        {p.type == "prayer" && <View style={{ ...style.prayerCont, height: 'auto', paddingBottom: 200 }}>
                            {!!p.subtitle && <Chip mode='flat' textStyle={{ fontFamily: 'secondary2' ,textShadowColor: theme.colors.background, textShadowOffset: { height: 2, width: 2 }, textShadowRadius: 2, opacity: 0.5, }} style={{ marginBottom: 10, backgroundColor: 'transparent' }}>{p.subtitle}</Chip>}
                            {!!p.prayer && !!p.prayer.length && p.prayer.map((prayer, i) => <View key={'prayer' + i} style={{ flex: 1, width: '100%', }}>
                                {prayer.t && <Text style={{ fontFamily: 'tertiary',padding: 0, textShadowColor: theme.colors.background, textShadowOffset: { height: 2, width: 2 }, textShadowRadius: 2, textAlign: 'center', opacity: 0.5, fontWeight: 600, marginBottom: 10, borderRadius: Site.BORDER_RADIUS, }} variant='titleMedium'>{i18n.t(prayer.t)}</Text>}
                                {prayer.v && <Text style={{ fontFamily: 'secondary2', textAlign: 'center', color: theme.colors.primary, textShadowColor: theme.colors.background, textShadowOffset: { height: 2, width: 2 }, textShadowRadius: 2 }} variant='headlineMedium'>{i18n.t(prayer.v)}</Text>}
                                <Text style={{ fontFamily: 'secondary2', textAlign: 'center', textShadowColor: theme.colors.background, textShadowOffset: { height: 2, width: 2 }, textShadowRadius: 2 }} variant='headlineMedium'>{i18n.t(prayer.r)}</Text>
                                {i != ((p.prayer?.length || -1) - 1) && <Divider style={{ marginVertical: 30, opacity: 0 }} />}
                            </View>)}
                        </View>}
                        </ScrollView>
                    </Animated.View>}
                    {!activeIndex && <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: 20,
                    }}>
                        <Text variant='titleLarge' style={{ textAlign: 'center', fontFamily: 'secondary', color: MD3LightTheme.colors.primaryContainer, fontWeight: 600 }}>{i18n.t(dm ? "HOME_DIVINE_MERCY_TITLE" : "HOME_HOLY_ROSARY_TITLE")}</Text>
                        <Text variant='titleMedium' style={{ textAlign: 'center', fontFamily: 'secondary2', marginTop: 10, color: MD3LightTheme.colors.background }}>{i18n.t(dm ? "HOME_DIVINE_MERCY_CONTENT" : "HOME_HOLY_ROSARY_CONTENT")}</Text>
                    </View>}
                    <View style={{ ...style.actionView, backgroundColor: activeIndex ? theme.colors.background : 'transparent' }}>
                        {(!activeIndex) && (<Button theme={!activeIndex ? MD3DarkTheme : theme} style={{ ...style.actionBTN, }} disabled={starting} loading={starting} labelStyle={{ ...style.actionBTNContent, }} onPress={start} mode='contained'>{i18n.t("START", { prayer: i18n.t(dm ? 'DIVINE_MERCY' : 'ROSARY') })}</Button>)}
                        {((!!activeIndex) && (!!session)) && (p.type == "prayer") && (<Button theme={!activeIndex ? MD3DarkTheme : theme} style={{ ...style.actionBTN, ...style.dirActionBTN, width: (p.altNext == "FINISH") ? '100%' : style.dirActionBTN.width }} labelStyle={{ ...style.actionBTNContent }} onPress={finish} mode={p.altNext == "FINISH" ? 'contained' : 'contained-tonal'}>{i18n.t("FINISH")}</Button>)}
                        {((!!activeIndex) && (!!session)) && (p.altNext != "FINISH") && (<Button theme={!activeIndex ? MD3DarkTheme : theme} style={{ ...style.actionBTN, ...style.dirActionBTN, width: (p.type != "prayer") ? '100%' : style.dirActionBTN.width }} labelStyle={{ ...style.actionBTNContent, }} onPress={next} mode='contained'>{i18n.t(p.altNext || "NEXT")}</Button>)}
                    </View>
                </View>

                <Intention submitIntention={submitIntention} setStarting={setStarting} theme={theme} setShowIntention={setShowIntention} showIntention={showIntention} />
                <LocaleSwitch setLocvis={setLocvis} locvis={locvis} theme={theme} />
                <MyBottomSheet setShowPromises={setShowPromises} setShowHistory={setShowHistory} dm={dm} toogleDM={toggleDM} menu={menu} locvis={locvis} saveTheme={saveTheme} setLocvis={setLocvis} setMenu={setMenu} theme={theme} themeMode={themeMode} />
                <History theme={theme} showHistory={showHistory} setShowHistory={setShowHistory} />
                <Promises setShowPromises={setShowPromises} showPromises={showPromises} theme={theme} />
                <Welcome setShowWelcome={setShowWelcome} showWelcome={showWelcome} theme={theme} />
                <ConfirmDialog confirmCB={confirmCBRef.current} confirmTitle={confirmTitle} setShowConfirm={setShowConfirm} showConfirm={showConfirm} theme={theme} />
            </View>
        </ImageBackground>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        position: 'relative',
    },
    noticeView: {
        flexGrow: 1,
        width: '100%',
        height: 'auto',
    },
    header: {
        // paddingEnd: 10,
    },
    actionView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        paddingBottom: 40,
        zIndex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionBTN: {
        width: '100%',
        borderRadius: Site.BORDER_RADIUS,
    },
    dirActionBTN: {
        width: '48%',
    },
    actionBTNContent: {
        fontSize: 18,
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeSurface: {
        flex: 1,
        padding: 20,
        borderRadius: Site.BORDER_RADIUS,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 'auto',
    },
    introCont: {
        flex: 1,
        width: '100%',
        padding: 20,
        paddingTop: 50,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    prayerCont: {
        width: '100%',
        paddingBottom: 100,
        padding: 20,
        paddingTop: 50,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    }
});
