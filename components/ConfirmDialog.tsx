import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, MD3Theme, Portal, Text } from "react-native-paper";
import { i18n } from '../library/i18n';
import { Site } from '../site';

interface ConfirmDialogProps {
    showConfirm: boolean;
    confirmTitle: string;
    confirmCB: (yes: boolean) => void;
    theme: MD3Theme;
    setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmDialog({ theme, confirmCB, confirmTitle, showConfirm, setShowConfirm }: ConfirmDialogProps) {
    return (
        <Portal>
            <Dialog style={{ ...style.dialog, backgroundColor: theme.colors.background }} visible={showConfirm} onDismiss={() => confirmCB(false)}>
                <Dialog.Title>{i18n.t("CONFIRMATION")}</Dialog.Title>
                <Dialog.Content>
                    <Text>{confirmTitle}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { setShowConfirm(false); confirmCB(false); }}>{i18n.t("NO")}</Button>
                    <Button onPress={() => { setShowConfirm(false); confirmCB(true); }}>{i18n.t("YES")}</Button>
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