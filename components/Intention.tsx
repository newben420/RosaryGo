import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, MD3Theme, Portal, TextInput } from "react-native-paper";
import { i18n } from '../library/i18n';
import { Site } from '../site';
import { sanitizeInput } from '../library/generalUtil';

interface IntentionProps {
    theme: MD3Theme;
    showIntention: boolean;
    setShowIntention: React.Dispatch<React.SetStateAction<boolean>>;
    setStarting: React.Dispatch<React.SetStateAction<boolean>>;
    submitIntention: (intention: string) => void
}

export default function Intention({ theme, showIntention, setShowIntention, setStarting, submitIntention }: IntentionProps) {

    const [text, setText] = useState<string>('');



    const hideDialog = () => {
        setShowIntention(false);
        setStarting(false);
    }

    const handleSubmit = (val: string = "") => {
        hideDialog();
        setText('');
        submitIntention(sanitizeInput(val));
    }

    return (
        <Portal>
            <Dialog style={{ ...style.dialog, backgroundColor: theme.colors.background }} visible={showIntention} onDismiss={hideDialog}>
                <Dialog.Title>{i18n.t("INTENTION")}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        mode='outlined'
                        autoFocus={true}
                        multiline={false}
                        numberOfLines={1}
                        maxLength={100}
                        placeholder={i18n.t("INTENTION_PLACEHOLDER")}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button labelStyle={{color: theme.colors.error}} onPress={() => hideDialog()}>{i18n.t("CANCEL")}</Button>
                    <Button onPress={() => handleSubmit()}>{i18n.t("SKIP")}</Button>
                    <Button disabled={!text} onPress={() => handleSubmit(text)}>{i18n.t("SAVE")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const style = StyleSheet.create({
    dialog: {
        borderRadius: Site.BORDER_RADIUS,
    }
});