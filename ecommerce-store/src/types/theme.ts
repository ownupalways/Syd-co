// @types/theme.ts

export interface ThemeColors {
	background: string;
	backgroundSecondary: string;
	text: string;
	textSecondary: string;
	primary: string;
	primaryDark: string;
	border: string;
	shadow: string;
}

export interface Theme {
	dark: ThemeColors;
	light: ThemeColors;
}

// This represents the 't' variable used in your components
export type ThemeMode = ThemeColors;
