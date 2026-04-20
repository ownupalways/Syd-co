import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ 
  icon: Icon, 
  type, 
  label, 
  ...props 
}) => {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const [showPassword, setShowPassword] = useState(false);

  // Toggle between 'password' and 'text' types
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 12px 12px 44px",
    borderRadius: "12px",
    border: `1.5px solid ${t.border}`,
    background: t.background,
    color: t.text,
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label && (
        <label style={{ fontSize: "14px", fontWeight: 600, color: t.textSecondary }}>
          {label}
        </label>
      )}
      
      <div style={{ position: "relative", width: "100%" }}>
        {/* Left Icon */}
        <Icon 
          size={18} 
          style={{ 
            position: "absolute", 
            left: "14px", 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: t.textSecondary,
            pointerEvents: "none"
          }} 
        />

        <input 
          {...props} 
          type={inputType} 
          style={inputStyle} 
          onFocus={(e) => (e.currentTarget.style.borderColor = t.primaryDark)}
          onBlur={(e) => (e.currentTarget.style.borderColor = t.border)}
        />

        {/* Password Visibility Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: t.textSecondary,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
