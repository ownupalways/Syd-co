export const theme = {
	light: {
		// Primary colors
		primary: "#FFB6D9", // Light pink
		primaryLight: "#FFF0F7", // Lightest pink for backgrounds
		primaryDark: "#E65BA8", // Deep pink for accents

		// Background colors
		background: "#FFFFFF", // White background
		backgroundSecondary: "#FFF5FB", // Very light pink background

		// Text colors
		text: "#333333", // Dark text
		textSecondary: "#666666", // Medium gray for secondary text
		textLight: "#FFFFFF", // White text

		// Gradients
		gradientPrimary:
			"linear-gradient(135deg, #FFB6D9 0%, #FFFFFF 100%)", // Pink to white
		gradientPrimaryReverse:
			"linear-gradient(135deg, #FFFFFF 0%, #FFB6D9 100%)", // White to pink

		// UI elements
		border: "#E0B0D0", // Light pink border
		shadow: "rgba(230, 91, 168, 0.15)", // Pink-tinted shadow
		hover: "#FFC4E1", // Slightly darker pink on hover
	},
	dark: {
		// Primary colors
		primary: "#E65BA8", // Deep pink
		primaryLight: "#FF8FBF", // Brighter pink for dark mode
		primaryDark: "#C41E7C", // Very dark pink

		// Background colors
		background: "#1A1A1A", // Dark background
		backgroundSecondary: "#2D1B2B", // Dark purplish background

		// Text colors
		text: "#FFFFFF", // White text
		textSecondary: "#E0E0E0", // Light gray for secondary text
		textLight: "#FFE5F0", // Light pink text

		// Gradients
		gradientPrimary:
			"linear-gradient(135deg, #E65BA8 0%, #2D1B2B 100%)", // Pink to dark
		gradientPrimaryReverse:
			"linear-gradient(135deg, #2D1B2B 0%, #E65BA8 100%)", // Dark to pink

		// UI elements
		border: "#6B3B63", // Dark pink border
		shadow: "rgba(230, 91, 168, 0.25)", // Pink-tinted shadow
		hover: "#D64B9C", // Slightly darker pink on hover
	},
};

export type Theme = typeof theme.light;
