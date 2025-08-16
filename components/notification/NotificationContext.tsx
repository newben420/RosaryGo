import React, { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Pressable } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import Animated, { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomLightTheme, extraColors } from "../../library/themes";
import { Site } from "../../site";
type Ty = 'success' | 'error';

type Cfig = { message: string, type: Ty, duration?: number, doNotDismissOnClick?: boolean };

interface NotificationContextProps {
    showNotification: (cfig: Cfig) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [mess, setMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [dOC, setDOC] = useState<boolean>(true);
    const [ty, setType] = useState<Ty | null>(null);
    const TOO = useRef<any>(null);

    const showNotification = ({ message, type, duration, doNotDismissOnClick }: Cfig) => {
        setMessage(message);
        setType(type);
        setVisible(true);
        setDOC(!doNotDismissOnClick);
        if(!duration && duration !== 0){
            duration = 3000;
        }
        if (TOO.current) {
            clearTimeout(TOO.current);
        }
        TOO.current = setTimeout(() => {
            setVisible(false);
        }, duration || Number.MAX_SAFE_INTEGER);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Animated.View
                key={mess + (visible ? "true" : "false")}
                entering={SlideInDown.duration(Site.TRANSITION_MS).easing(Easing.out(Easing.exp))}
                exiting={SlideOutDown.duration(Site.TRANSITION_MS).easing(Easing.in(Easing.exp))}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    pointerEvents: "auto",
                }}
            >
                {visible &&
                    <Notification
                        dOC={dOC}
                        setVisible={setVisible}
                        message={mess || ""}
                        type={ty}
                    />
                }
            </Animated.View>
        </NotificationContext.Provider>
    );
};

const Notification = ({ message, type, setVisible, dOC }: { message: string; type: Ty | null; setVisible: React.Dispatch<React.SetStateAction<boolean>>; dOC: boolean; }) => {
    const inset = useSafeAreaInsets()
    return (
        <Pressable
            onPress={() => {
                if (dOC) {
                    setVisible(false);
                }
            }}
            style={{
                backgroundColor:
                    type === "error"
                        ? CustomLightTheme.colors.error
                        : type === "success"
                            ? extraColors.success
                            : undefined,
                padding: 0,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
                <Text
                    variant="bodyMedium"
                    style={{ color: CustomLightTheme.colors.background, padding: 15, paddingBottom: inset.bottom + 15, textAlign: 'center' }}
                >
                    {message}
                </Text>
        </Pressable>
    );
};