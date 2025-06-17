import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Portal, Modal, MD3Theme, Button, Icon, Card } from 'react-native-paper';
import { i18n } from '../library/i18n';
import { Site } from '../site';

interface PromisesProps {
    theme: MD3Theme;
    showPromises: boolean;
    setShowPromises: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Promises({ theme, showPromises, setShowPromises }: PromisesProps) {

    const close = () => setShowPromises(false);


    return (
        <Portal>
            <Modal style={{ padding: 20 }} dismissable={false} theme={{ ...theme, colors: { ...theme.colors, backdrop: theme.colors.backdrop, elevation: 'transparent' } }} visible={showPromises} onDismiss={close} contentContainerStyle={{
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
            }}>
                <View style={{
                    width: '100%',
                    paddingVertical: 20,
                    minHeight: 80,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 20,
                }}>
                    <Text variant='titleLarge' textBreakStrategy='simple' style={{maxWidth: '80%', paddingRight: 10,}}>{i18n.t('PROM_FULL')}</Text>
                    <Button onPress={close}><Icon source='close' color={theme.colors.onBackground} size={24} /></Button>
                </View>
                <ScrollView style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                    borderRadius: Site.BORDER_RADIUS,
                }}>
                    {((new Array(15)).fill(1)).map((s, i) => <Card mode='elevated' style={{ marginBottom: 20, borderRadius: Site.BORDER_RADIUS }} key={'s' + i}>
                        <Card.Content><Text selectable variant='bodyLarge' style={{ fontFamily: 'secondary2', marginBottom: 10, }}>{i18n.t("PROM.P" + (i + 1))}</Text></Card.Content>
                    </Card>)}
                </ScrollView>
            </Modal>
        </Portal>
    );
}
