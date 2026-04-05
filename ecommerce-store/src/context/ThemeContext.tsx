import React, {
	useState,
	useEffect,
} from "react";
import { ThemeContext } from "./theme.context";

export const ThemeProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [isDark, setIsDark] = useState(() => {
		// Check system preference or localStorage
		const saved = localStorage.getItem(
			"theme-preference",
		);
		if (saved) return saved === "dark";
		return window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
	});

	useEffect(() => {
		localStorage.setItem(
			"theme-preference",
			isDark ? "dark" : "light",
		);
		document.documentElement.setAttribute(
			"data-theme",
			isDark ? "dark" : "light",
		);
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark((prev) => !prev);
	};

	return (
		<ThemeContext.Provider
			value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
