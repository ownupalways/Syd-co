import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { theme } from "../styles/theme";
import sydLogo from "../assets/syd-hero.png";
import { Send, Phone, MapPin } from "lucide-react";
import {
  FaInstagram,
  FaSnapchat,
  FaXTwitter,
} from "react-icons/fa6";
import api from "../api/axios";
import toast from "react-hot-toast";

/* ===================== TYPES ===================== */
interface ThemeColors {
  border: string;
  primaryDark: string;
  text?: string;
  textSecondary?: string;
  background?: string;
  backgroundSecondary?: string;
  primary?: string;
}

interface SocialIconProps {
  icon: React.ElementType;
  href: string;
  label: string;
  isDark: boolean;
  theme: ThemeColors;
}

/* ===================== SOCIAL ICON COMPONENT ===================== */
const SocialIcon: React.FC<SocialIconProps> = ({ 
  icon: Icon, 
  href, 
  label, 
  isDark, 
  theme: t 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseBg = isDark ? "rgba(230,91,168,0.1)" : "rgba(255,182,217,0.15)";
  const hoverBg = isDark ? "rgba(230,91,168,0.3)" : "rgba(255,182,217,0.4)";

  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex h-10.5 w-10.5 items-center justify-center rounded-[10px] border transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: t.border,
        color: t.primaryDark,
        background: isHovered ? hoverBg : baseBg,
      }}
    >
      <Icon size={18} />
    </a>
  );
};

/* ===================== INFO ITEM ===================== */
type InfoItemProps = {
  icon: React.ElementType;
  text: string;
  isDark: boolean;
  primaryColor: string;
};

const InfoItem: React.FC<InfoItemProps> = ({
  icon: Icon,
  text,
  isDark,
  primaryColor,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        cursor: "default",
        transition: "all 0.2s ease",
        color: hovered ? primaryColor : isDark ? "#aaa" : "#666",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <Icon
        size={16}
        aria-hidden="true"
        style={{
          transition: "all 0.2s ease",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
      />
      <span>{text}</span>
    </span>
  );
};

/* ===================== FOOTER ===================== */
export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await api.post("/newsletter/subscribe", { email });
      setSubscribed(true);
      setEmail("");
      toast.success("🎉 Subscribed! Check your email for confirmation.");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
      };

      const msg = error.response?.data?.message || "Subscription failed";
      toast.error(msg.includes("already") ? "This email is already subscribed!" : msg);
    }
  };

  const sections = [
    {
      title: "Quick Links",
      links: [
        { label: "Shop", to: "/shop" },
        { label: "About Us", to: "/about" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", to: "/contact" },
        { label: "Returns & Exchanges", to: "#" },
        { label: "Shipping Info", to: "#" },
        { label: "Track Order", to: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "#" },
        { label: "Terms of Service", to: "#" },
      ],
    },
  ];

  const socials = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/nunbuttheelz?igsh=eGtrenFldTlmYWZ0&utm_source=qr",
      label: "Instagram",
    },
    {
      icon: FaSnapchat,
      href: "https://snapchat.com/t/L6lpSVtv",
      label: "Snapchat",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/sydandcoinc?s=21",
      label: "Twitter",
    },
  ];

  return (
    <footer
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${t.backgroundSecondary} 0%, ${t.background} 100%)`
          : `linear-gradient(135deg, #fff0f7 0%, #ffe4f2 50%, #ffd6ec 100%)`,
        borderTop: `1px solid ${t.border}`,
        marginTop: "80px",
      }}
    >
      {/* ================= NEWSLETTER ================= */}
      <div
        style={{
          background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
          padding: "clamp(32px, 6vw, 48px) clamp(16px, 5vw, 24px)",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 800 }}>
            Join the Syd & Co Family ✨
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 20 }}>
            Get exclusive deals, new arrivals & style tips straight to your inbox
          </p>

          {subscribed ? (
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "14px 24px",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              🎉 Thank you for subscribing!
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}
            >
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: "1 1 250px",
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: "rgba(255,255,255,0.9)",
                  color: "#333",
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 48,
                  padding: "0 20px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: "#111",
                  color: "#fff",
                }}
              >
                Subscribe <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 40px) 16px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(20px, 4vw, 32px)",
            marginBottom: 48,
          }}
        >
          {/* BRAND */}
          <div>
            <img
              src={sydLogo}
              alt="Syd & Co"
              style={{ height: 82, borderRadius: "50%", marginBottom: 16 }}
            />
            <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.7 }}>
              Your favorite destination for quality beauty & fashion products.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
              <InfoItem icon={MapPin} text="USA" isDark={isDark} primaryColor={t.primaryDark} />
              <InfoItem icon={Phone} text="+1(262) 362-1810" isDark={isDark} primaryColor={t.primaryDark} />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              {socials.map((social) => (
                <SocialIcon key={social.label} {...social} isDark={isDark} theme={t} />
              ))}
            </div>
          </div>

          {/* LINKS */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4
                style={{
                  fontWeight: 700,
                  marginBottom: "12px",
                  color: t.text,
                  position: "relative",
                  display: "inline-block",
                  paddingBottom: "6px",
                }}
              >
                {section.title}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: "2px",
                    width: "40%",
                    background: t.primaryDark,
                    borderRadius: "10px",
                  }}
                />
              </h4>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0, margin: 0 }}>
                {section.links.map(({ label, to }) => (
                  <li key={`${section.title}-${label}`}>
                    <Link
                      to={to}
                      className="transition-all duration-200"
                      style={{
                        color: t.textSecondary,
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = t.primaryDark;
                        e.currentTarget.style.transform = "translateX(3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = t.textSecondary;
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div
          style={{
            borderTop: `1px solid ${t.border}`,
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "13px", color: t.textSecondary }}>
            © {currentYear} Syd & Co. All rights reserved.
          </p>
          <p style={{ fontSize: "13px", color: t.textSecondary, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
            <span style={{ fontStyle: "italic" }}>Powered by</span>
            <span
              style={{ fontWeight: 600, color: t.primaryDark, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Tushclouds
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
