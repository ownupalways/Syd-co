import React from "react";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import { ThemeMode } from "@/types/theme";
import SocialIcon from "@/components/SocialIcon";

interface SocialLinksProps {
    t: ThemeMode;
    isDark: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ t, isDark }) => {
    const socials = [
			{
				name: "instagram" as const,
				label: "Instagram",
				handle: "@sydandco",
				color: "#E65BA8",
				href: "https://instagram.com/sydandco",
			},
			{
				name: "snapchat" as const,
				label: "Snapchat",
				handle: "@sydandco",
				color: "#FFFC00",
				href: "https://snapchat.com/t/L6lpSVtv",
			},
			{
				name: "tiktok" as const,
				label: "TikTok",
				handle: "@sydandco",
				color: "#000000",
				href: "https://tiktok.com/@sydandco",
			},
			{
				name: "twitter" as const,
				label: "X",
				handle: "@sydandco",
				color: "#000000",
				href: "https://x.com/sydandcoinc?s=21",
			},
		];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${text} copied! 💕`, {
            style: {
                background: t.backgroundSecondary,
                color: t.text,
                border: `1px solid ${t.border}`,
                fontSize: "13px",
            },
        });
    };

    return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "12px",
				}}>
				{socials.map((s) => (
					<div
						key={s.name}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							padding: "12px",
							borderRadius: "12px",
							border: `1px solid ${t.border}`,
							transition: "transform 0.2s ease",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.transform =
								"translateX(4px)")
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.transform =
								"translateX(0)")
						}>
						{/* Icon Link */}
						<a
							href={s.href}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								width: "42px",
								height: "42px",
								borderRadius: "10px",
								background: `${s.color}15`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								textDecoration: "none",
							}}>
							<SocialIcon
								name={s.name}
								href={s.href} // Ensure href is passed if your SocialIcon wraps the <a> tag
								isDark={isDark}
								t={t}
							/>
						</a>

						<div style={{ flex: 1 }}>
							<a
								href={s.href}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									fontSize: "13px",
									fontWeight: 700,
									color: t.text,
									margin: 0,
									textDecoration: "none",
									display: "block",
								}}>
								{s.label}
							</a>

							{/* Interactive Copy Button */}
							<button
								onClick={() =>
									copyToClipboard(s.handle)
								}
								title="Click to copy handle"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "4px",
									background: "none",
									border: "none",
									padding: 0,
									margin: 0,
									cursor: "pointer",
									color: t.textSecondary,
									transition: "color 0.2s",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.color =
										t.primaryDark)
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.color =
										t.textSecondary)
								}>
								<span
									style={{ fontSize: "11px" }}>
									{s.handle}
								</span>
								<FiCopy size={10} />
							</button>
						</div>
					</div>
				))}
			</div>
		);
};

export default SocialLinks;
