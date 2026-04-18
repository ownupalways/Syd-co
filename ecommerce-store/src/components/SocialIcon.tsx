import React, { useState } from "react";
import {
	FaInstagram,
	FaSnapchat, // Corrected export for FontAwesome 6
	FaTiktok,
	FaXTwitter,
} from "react-icons/fa6";
import { IconType } from "react-icons";
import { ThemeMode } from "@/types/theme";

export type SocialPlatform =
	| "instagram"
	| "snapchat"
	| "tiktok"
	| "twitter";

interface SocialIconProps {
	name: SocialPlatform;
	href: string;
	isDark: boolean;
	t: ThemeMode;
}

const iconMap: Record<SocialPlatform, IconType> =
	{
		instagram: FaInstagram,
		snapchat: FaSnapchat,
		tiktok: FaTiktok,
		twitter: FaXTwitter,
	};

const SocialIcon: React.FC<SocialIconProps> = ({
	name,
	href,
	isDark,
	t,
}) => {
	const [isHovered, setIsHovered] =
		useState(false);

	const IconComponent = iconMap[name];

	const baseBg = isDark
		? "rgba(230, 91, 168, 0.1)"
		: "rgba(255, 182, 217, 0.15)";

	const hoverBg = isDark
		? "rgba(230, 91, 168, 0.3)"
		: "rgba(255, 182, 217, 0.4)";

	return (
		<a
			href={href}
			aria-label={`Follow us on ${name}`}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="flex h-10 w-10 items-center justify-center rounded-[10px] border transition-all duration-300 hover:-translate-y-1"
			style={{
				borderColor: t.border,
				color: t.primaryDark,
				background: isHovered ? hoverBg : baseBg,
			}}>
			{IconComponent && (
				<IconComponent size={20} />
			)}
		</a>
	);
};

export default SocialIcon;
