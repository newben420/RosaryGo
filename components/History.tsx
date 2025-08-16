import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Portal, Modal, MD3Theme, Button, Icon, ActivityIndicator, Card } from 'react-native-paper';
import { i18n } from '../library/i18n';
import { Site } from '../site';
import { Session } from '../library/model/session';
import { Log } from '../library/log';
import { deleteSession, getHistory } from '../library/db';
import { getMysteryIndex } from '../library/model/mysteries';
import { getDateTime, getTimeElapsed } from '../library/dateTime';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { useNotification } from './notification/NotificationContext';

interface HistoryProps {
    theme: MD3Theme;
    showHistory: boolean;
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function History({ theme, showHistory, setShowHistory }: HistoryProps) {
    const [ready, setReady] = useState<boolean>(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [index, setIndex] = useState<number>(-1);
    const {showNotification} = useNotification();

    const del = async (id: number, index: number) => {
        const d = await deleteSession(id);
        if (d) {
            setSessions(sessions.filter((x, i) => i != index));
        }
        else {
            showNotification({
                message: i18n.t("SESS_NDEL"),
                type: 'error',
            });
        }
    }

    useEffect(() => {
        if (showHistory) {
            setReady(false);
            (async () => {
                try {
                    const s = await getHistory();
                    setSessions(s);
                } catch (error) {
                    Log.dev(error);
                }
                finally {
                    setReady(true);
                }
            })();
        }
        else {
            setSessions([]);
        }
    }, [showHistory]);

    useEffect(() => {
        setIndex(-1);
    }, [sessions]);

    const close = () => setShowHistory(false);


    return (
        <Portal>
            <Modal style={{ padding: 20 }} dismissable={false} theme={{ ...theme, colors: { ...theme.colors, backdrop: theme.colors.backdrop, elevation: 'transparent' } }} visible={showHistory} onDismiss={close} contentContainerStyle={{
                backgroundColor: theme.colors.background,
                padding: 0,
                flex: 1,
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                borderRadius: Site.BORDER_RADIUS,
                boxShadow: 'none',
                paddingBottom: 20,
                // overflow: 'hidden',
            }}>
                <View style={{
                    width: '100%',
                    minHeight: 80,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 20,
                    paddingVertical: 20,
                }}>
                    <Text variant='titleLarge'>{i18n.t('HISTORY')}
                        {/* {!!sessions.length && '(' + formatNumber(sessions.length) + ')'} */}
                    </Text>
                    <Button onPress={close}><Icon source='close' color={theme.colors.onBackground} size={24} /></Button>
                </View>
                {ready && <ScrollView style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 20,
                    borderRadius: Site.BORDER_RADIUS,
                }}>
                    {!!sessions.length && sessions.map((s, i) => <Card onPress={() => { setIndex(index == i ? -1 : i) }} mode='elevated' style={{ marginBottom: 20, borderRadius: Site.BORDER_RADIUS,backgroundColor:theme.colors.surface, }} key={'s' + i}>
                        <Card.Title titleVariant='titleLarge' subtitleVariant='labelSmall' titleStyle={{ marginBottom: 10, marginTop: 20, fontFamily: 'secondary2' }} subtitleStyle={{ fontFamily: 'secondary2', marginBottom: 5, color: theme.colors.primary }}
                            subtitle={i18n.t("TIMER", { duration: getTimeElapsed(s.start || 0, s.stop || 0), timestamp: getDateTime(s.start || 0) })}
                            title={s.is_dm ? i18n.t('DIVINE_MERCY') : i18n.t(`MYSTERIES.NAME_${getMysteryIndex(s.start || 0)}`)}
                        />
                        {/* {!!s.intention && <Card.Content><Text variant='bodyLarge' style={{ marginBottom: 10, }}>{i18n.t("INTENTION_2", { intention: s.intention })}</Text></Card.Content>} */}
                        {!!s.intention && <Card.Content><Text variant='bodyLarge' style={{ marginBottom: 10, fontFamily: 'secondary2' }}>{s.intention}</Text></Card.Content>}
                        <Card.Actions>
                            <Animated.View key={index} entering={FadeIn.duration(Site.TRANSITION_MS)} exiting={FadeOut.duration(Site.TRANSITION_MS)} style={{ flex: 1 }}>{index == i && <Button style={{ width: '100%', marginBottom: 10, borderRadius: Site.BORDER_RADIUS }} onPress={() => del(s.id || 0, i)} mode='contained' buttonColor={theme.colors.errorContainer}><Icon size={20} color={theme.colors.error} source='delete' /></Button>}</Animated.View>
                        </Card.Actions>
                    </Card>)}
                    {!sessions.length && <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: 20,
                        opacity: 0.5,
                    }}>
                        <Icon source='hands-pray' size={50} />
                        <Text variant='bodyLarge' style={{ marginTop: 20, }}>{i18n.t('NO_HISTORY')}</Text>
                    </View>}
                </ScrollView>}
                {!ready && <View style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: Site.BORDER_RADIUS,
                }}>
                    <ActivityIndicator animating={true} size={50}></ActivityIndicator>
                </View>
                }

            </Modal>
        </Portal>
    );
}

const style = StyleSheet.create({

});
