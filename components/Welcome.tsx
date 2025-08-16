import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Portal, Modal, MD3Theme, Button } from 'react-native-paper';
import { i18n } from '../library/i18n';
import { Site } from '../site';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../library/storageKeys';
import { ScrollView } from 'react-native-gesture-handler';

interface WelcomeProps {
    theme: MD3Theme;
    showWelcome: boolean;
    setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Welcome({ theme, showWelcome, setShowWelcome }: WelcomeProps) {

    const close = async () => {
        setShowWelcome(false);
        await AsyncStorage.setItem(StorageKeys.WELCOME, Site.VERSION);
    }


    return (
        <Portal>
            <Modal style={{ padding: 20 }} dismissable={true} theme={{ ...theme, colors: { ...theme.colors, backdrop: theme.colors.backdrop, elevation: 'transparent' } }} visible={showWelcome} onDismiss={close} contentContainerStyle={{
                backgroundColor: theme.colors.background,
                padding: 20,
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: Site.BORDER_RADIUS,
                boxShadow: 'none',
                paddingBottom: 20,
            }}>
                <ScrollView style={{
                    width: '100%',
                }}>
                    <Text variant='titleLarge' style={{ textAlign: 'center' }}>{i18n.t("WELCOME", { brand: Site.BRAND, version: Site.VERSION })}</Text>
                    <Text variant='bodyMedium' style={style.p}>{i18n.t('WC.P1')}</Text>
                    <Text variant='bodyMedium' style={style.p}>{i18n.t('WC.P2')}</Text>
                    <Button onPress={close} style={{
                        borderRadius: Site.BORDER_RADIUS,
                        marginTop: 20,
                    }} mode='contained'>{i18n.t("CONTINUE")}</Button>
                </ScrollView>
            </Modal>
        </Portal>
    );
}

const style = StyleSheet.create({
    p: {
        textAlign: 'center',
        marginTop: 20,
    }
});
