import React from "react";
import { MessageCircle } from "lucide-react";
import { ThemeMode } from "@/types/theme";
import Banner from "@/assets/Banner.webp"; // Uncommented

interface HeroProps {
    t: ThemeMode; 
    isDark: boolean;
}

const Hero: React.FC<HeroProps> = ({
    t,
    isDark,
}) => (
    <section
        style={{
            background: isDark
                ? `linear-gradient(135deg, ${t.backgroundSecondary}, ${t.background})`
                : `linear-gradient(135deg, #fff0f7, #ffe4f2, #ffd6ec)`,
            padding: "clamp(60px, 10vw, 100px) 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
        }}>
        {/* Background Image Layer */}
        <div 
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${Banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isDark ? 0.30 : 0.1, // Low opacity so text stays readable
                pointerEvents: "none",
            }}
        />

        <div
            style={{
                maxWidth: "600px",
                margin: "0 auto",
                position: "relative", // Keeps content above the absolute background
                zIndex: 1,
            }}>
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: isDark
                        ? "rgba(230,91,168,0.15)"
                        : "rgba(230,91,168,0.1)",
                    border: `1px solid ${t.border}`,
                    marginBottom: "20px",
                    backdropFilter: "blur(4px)", // Adds a nice glass effect
                }}>
                <MessageCircle
                    size={14}
                    color={t.primaryDark}
                />
                <span
                    style={{
                        fontSize: "13px",
                        color: t.primaryDark,
                        fontWeight: 600,
                    }}>
                    We'd Love to Hear From You
                </span>
            </div>
            <h1
                style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 900,
                    color: t.text,
                    lineHeight: 1.15,
                    marginBottom: "16px",
                }}>
                Get in{" "}
                <span
                    style={{
                        background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                    Touch 💕
                </span>
            </h1>
            <p
                style={{
                    fontSize: "16px",
                    color: t.textSecondary,
                    lineHeight: 1.7,
                    maxWidth: "480px",
                    margin: "0 auto",
                    fontWeight: 500,
                }}>
                Questions, feedback, or just want to say
                hi? We're always here for our community.
            </p>
        </div>
    </section>
);

export default Hero;
