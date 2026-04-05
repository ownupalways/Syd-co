# Sydney Store - E-Commerce Frontend Theme System

## 🎨 Theme Overview

The ecommerce-store has been set up with a
**modern, beautiful pink & white theme** with full
light/dark mode support. The design follows modern
UI/UX standards with smooth transitions and
responsive layouts.

### Color Palette

#### Light Theme (Default)

- **Primary Pink**: `#FFB6D9` (soft, light pink)
- **Primary Gradient**:
  `linear-gradient(135deg, #FFB6D9 → #FFFFFF)`
- **Deep Pink**: `#E65BA8` (accents and hover
  states)
- **Background**: White (`#FFFFFF`)
- **Text**: Dark gray (`#333333`)

#### Dark Theme

- **Primary Pink**: `#E65BA8` (deep pink for dark
  mode)
- **Primary Gradient**:
  `linear-gradient(135deg, #E65BA8 → #2D1B2B)`
- **Bright Pink**: `#FF8FBF` (highlights in dark
  mode)
- **Background**: Dark (`#1A1A1A`)
- **Text**: White (`#FFFFFF`)

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Main navigation bar
│   ├── Navbar.css          # Navbar styling
│   ├── Footer.tsx          # Footer component
│   ├── Footer.css          # Footer styling
│   └── index.ts            # Component exports
├── context/
│   ├── ThemeContext.tsx    # Theme provider & hook
│   └── index.ts            # Context exports
├── styles/
│   └── theme.ts            # Theme configuration
├── App.tsx                 # Main app component with theme provider
├── App.css                 # App styling
├── index.css               # Global CSS with theme variables
└── main.tsx                # Entry point
```

## 🎯 Features

### Navbar

- **Sticky positioning** at the top of the page
- **Logo section** with shopping emoji and
  branding
- **Navigation menu** with smooth underline hover
  effects
- **Shopping cart** button with badge counter
- **Dark/Light mode toggle** with animated icon
- **Responsive design** for mobile, tablet, and
  desktop
- **Backdrop blur effect** for modern look
- **Theme-aware shadows** and gradients

### Footer

- **Multi-column layout** with quick links,
  customer service, and legal sections
- **Social media links** with hover animations
- **Responsive grid layout** adapting to screen
  size
- **Theme-aware styling** for both light and dark
  modes
- **Smooth animations** on component entrance
- **Professional copyright and branding**

### Theme System

- **React Context API** for global theme state
  management
- **localStorage persistence** - remembers user's
  theme preference
- **System preference detection** - respects OS
  dark mode settings
- **Smooth transitions** between themes (0.3s
  ease)
- **CSS custom properties** for easy theme
  variable access

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend/ecommerce-store
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will start with theme support enabled by
default.

### 3. Using the Theme Hook in Components

```tsx
import { useTheme } from "./context";
import { theme } from "./styles/theme";

function MyComponent() {
	const { isDark, toggleTheme } = useTheme();
	const currentTheme = isDark
		? theme.dark
		: theme.light;

	return (
		<div style={{ color: currentTheme.text }}>
			{/* Your content */}
		</div>
	);
}
```

## 🎨 Customizing the Theme

### Update Color Values

Edit `src/styles/theme.ts` to change the color
palette:

```typescript
export const theme = {
	light: {
		primary: "#FFB6D9", // Change primary pink
		primaryDark: "#E65BA8", // Change deep pink
		// ... more colors
	},
	dark: {
		primary: "#E65BA8",
		primaryLight: "#FF8FBF",
		// ... more colors
	},
};
```

### Global CSS Variables

Edit `src/index.css` to modify global styles. CSS
custom properties automatically sync with the
theme:

```css
:root {
	--accent: #ffb6d9;
	--text: #333333;
	--bg: #ffffff;
	/* ... more variables */
}

html[data-theme="dark"] {
	--accent: #e65ba8;
	--text: #ffffff;
	--bg: #1a1a1a;
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: 320px - 479px

All components have responsive styles optimized
for each breakpoint.

## ✨ Key Features

✅ **Modern Design**: Gradient backgrounds, smooth
shadows, and polished UI elements ✅
**Accessible**: ARIA labels, focus-visible states,
semantic HTML ✅ **Performant**: CSS transitions
instead of JS animations, optimized redraws ✅
**Responsive**: Mobile-first design with fluid
layouts ✅ **Customizable**: Easy-to-modify theme
system ✅ **User-Friendly**: Auto-detects OS
preference, remembers user choice ✅ **Beautiful
Transitions**: Smooth 0.3s ease transitions on all
interactive elements

## 🔧 Building for Production

```bash
npm run build
```

The build will be optimized with:

- TypeScript compilation
- Vite bundling and minification
- CSS optimization
- Asset optimization

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Happy building! 🎉** The theme system is
production-ready and can be easily extended with
new colors, fonts, or layout variations.
