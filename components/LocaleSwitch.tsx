import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Portal, Modal, Surface, Chip } from 'react-native-paper';
import { i18n, locales } from '../library/i18n';
import { LocaleContext } from './LocaleContext';
import { Site } from '../site';

interface LocaleSwitchProps {
    theme: any;
    locvis: boolean;
    setLocvis: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LocaleSwitch({ theme, locvis, setLocvis }: LocaleSwitchProps) {
    const { locale, setLocale } = useContext(LocaleContext);

    const changeLocale = (code: string) => {
        setLocale(code);
        setLocvis(false);
    };

    const close = () => setLocvis(false);


    return (
        <>
            {/* <Pressable onPress={openMenu}>
                <Text style={{ padding: 20 }}>{locales.find(x => x.code == i18n.locale)?.label}</Text>
            </Pressable> */}

            <Portal>
                <Modal theme={theme} visible={locvis} onDismiss={close} contentContainerStyle={{
                    backgroundColor: 'transparent',
                    padding: 20,
                }}>
                    <Surface style={{...style.surface, backgroundColor: theme.colors.background}}>
                        <Text variant='titleLarge'>{i18n.t('CHANGE_LANG')}</Text>
                        <View style={style.chipContainer}>
                            {
                                locales.map((lang) => (
                                    <Chip mode='outlined' disabled={lang.code == i18n.locale} selected={lang.code == i18n.locale} style={style.chip} onPress={() => changeLocale(lang.code)} key={lang.code}>{lang.label}</Chip>
                                ))
                            }
                        </View>
                    </Surface>

                </Modal>
            </Portal>
        </>
    );
}

const style = StyleSheet.create({
    surface: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
        borderRadius: Site.BORDER_RADIUS,
    },
    chipContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        flexWrap: 'wrap',
    },
    chip: {
        marginRight: 20,
        marginBottom: 20,
        borderRadius: Site.BORDER_RADIUS,
    }
});
