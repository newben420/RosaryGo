import {
    MD3LightTheme as LightTheme,
    MD3DarkTheme as DarkTheme,
} from "react-native-paper";

export const CustomLightTheme = {
    ...LightTheme,
    colors: {
        ...LightTheme.colors,
        primary: '#8E43CE',
        onPrimary: '#F8F4FF',
        background: '#F3F0F9',
        surface: '#FFFFFF',
        surfaceVariant: '#ECE6F4',
        onSurface: '#2E2B3A',
        secondary: '#A475D8',
        tertiary: '#BFA2E2',
        outline: '#8A7FA6',
        error: '#B3261E',
    },
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#CC8FDD',
        onPrimary: '#1B0F22',
        background: '#0C0C0F',
        surface: '#18141F',
        surfaceVariant: '#211B2D',
        onSurface: '#EAE6F3',
        secondary: '#B8A1DC',
        tertiary: '#967EBE',
        outline: '#6E6482',
        error: '#CF6679',
    },
};